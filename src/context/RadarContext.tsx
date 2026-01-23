import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RadarData, SkillNode, DEFAULT_RADAR_DATA } from '@/types/skill';

interface RadarContextType {
  data: RadarData;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateNode: (id: string, updates: Partial<SkillNode>) => void;
  addChildNode: (parentId: string) => void;
  deleteNode: (id: string) => void;
  updateRootName: (name: string) => void;
  resetData: () => void;
}

const STORAGE_KEY = 'personal-360-radar-data';

const RadarContext = createContext<RadarContextType | null>(null);

export const useRadar = () => {
  const context = useContext(RadarContext);
  if (!context) {
    throw new Error('useRadar must be used within a RadarProvider');
  }
  return context;
};

const updateNodeRecursive = (
  nodes: SkillNode[],
  id: string,
  updates: Partial<SkillNode>
): SkillNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children.length > 0) {
      return { ...node, children: updateNodeRecursive(node.children, id, updates) };
    }
    return node;
  });
};

const addChildRecursive = (
  nodes: SkillNode[],
  parentId: string,
  newChild: SkillNode
): SkillNode[] => {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, newChild] };
    }
    if (node.children.length > 0) {
      return { ...node, children: addChildRecursive(node.children, parentId, newChild) };
    }
    return node;
  });
};

const deleteNodeRecursive = (nodes: SkillNode[], id: string): SkillNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: deleteNodeRecursive(node.children, id),
    }));
};

const findNodeRecursive = (nodes: SkillNode[], id: string): SkillNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeRecursive(node.children, id);
    if (found) return found;
  }
  return null;
};

export const RadarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RadarData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_RADAR_DATA;
      }
    }
    return DEFAULT_RADAR_DATA;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateNode = useCallback((id: string, updates: Partial<SkillNode>) => {
    setData((prev) => ({
      ...prev,
      skills: updateNodeRecursive(prev.skills, id, updates),
    }));
  }, []);

  const addChildNode = useCallback((parentId: string) => {
    const newId = `skill-${Date.now()}`;
    const newChild: SkillNode = {
      id: newId,
      label: 'New Skill',
      rating: 5,
      comments: '',
      parentId,
      children: [],
    };

    if (parentId === 'root') {
      setData((prev) => ({
        ...prev,
        skills: [...prev.skills, { ...newChild, parentId: null }],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        skills: addChildRecursive(prev.skills, parentId, newChild),
      }));
    }

    setSelectedNodeId(newId);
  }, []);

  const deleteNode = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: deleteNodeRecursive(prev.skills, id),
    }));
    setSelectedNodeId(null);
  }, []);

  const updateRootName = useCallback((name: string) => {
    setData((prev) => ({ ...prev, rootName: name }));
  }, []);

  const resetData = useCallback(() => {
    setData(DEFAULT_RADAR_DATA);
    setSelectedNodeId(null);
  }, []);

  return (
    <RadarContext.Provider
      value={{
        data,
        selectedNodeId,
        setSelectedNodeId,
        updateNode,
        addChildNode,
        deleteNode,
        updateRootName,
        resetData,
      }}
    >
      {children}
    </RadarContext.Provider>
  );
};

export { findNodeRecursive };

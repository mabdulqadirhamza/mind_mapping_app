import { hierarchy, tree, HierarchyPointNode } from 'd3-hierarchy';
import { Node, Edge } from '@xyflow/react';
import { SkillNode } from '@/types/skill';

interface HierarchyNode {
  id: string;
  label: string;
  rating: number;
  isRoot: boolean;
  children?: HierarchyNode[];
}

const BASE_LAYER_SPACING = 220;
const MIN_NODE_ANGLE_SPACING = 0.15; // Minimum angle between nodes in radians
const CENTER_OFFSET = { x: 0, y: 0 };

// Count total descendants for a node
const countDescendants = (node: HierarchyNode): number => {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countDescendants(child), 0);
};

// Count total nodes at each depth level
const countNodesAtDepth = (node: HierarchyNode, depth: number, counts: Map<number, number>) => {
  const current = counts.get(depth) || 0;
  counts.set(depth, current + 1);
  if (node.children) {
    node.children.forEach(child => countNodesAtDepth(child, depth + 1, counts));
  }
};

export const calculateRadialLayout = (
  rootName: string,
  skills: SkillNode[],
  selectedNodeId: string | null
): { nodes: Node[]; edges: Edge[] } => {
  // Build hierarchy data
  const buildHierarchy = (nodes: SkillNode[]): HierarchyNode[] => {
    return nodes.map((node) => ({
      id: node.id,
      label: node.label,
      rating: node.rating,
      isRoot: false,
      children: node.children.length > 0 ? buildHierarchy(node.children) : undefined,
    }));
  };

  const rootData: HierarchyNode = {
    id: 'root',
    label: rootName,
    rating: 10,
    isRoot: true,
    children: buildHierarchy(skills),
  };

  // Create d3 hierarchy
  const root = hierarchy(rootData);
  
  // Count nodes at each depth to calculate dynamic spacing
  const depthCounts = new Map<number, number>();
  countNodesAtDepth(rootData, 0, depthCounts);
  
  // Find the maximum nodes at any depth level
  const maxNodesAtAnyDepth = Math.max(...Array.from(depthCounts.values()));
  
  // Calculate dynamic layer spacing based on tree complexity
  const dynamicLayerSpacing = Math.max(
    BASE_LAYER_SPACING,
    BASE_LAYER_SPACING + (maxNodesAtAnyDepth > 8 ? (maxNodesAtAnyDepth - 8) * 15 : 0)
  );
  
  // Calculate tree layout with improved separation
  const treeLayout = tree<HierarchyNode>()
    .size([2 * Math.PI, root.height * dynamicLayerSpacing])
    .separation((a, b) => {
      // Calculate separation based on number of descendants and depth
      const aDescendants = countDescendants(a.data);
      const bDescendants = countDescendants(b.data);
      const maxDescendants = Math.max(aDescendants, bDescendants);
      
      // Base separation factor
      let separation = 1;
      
      // Siblings get less separation, non-siblings get more
      if (a.parent !== b.parent) {
        separation = 2;
      }
      
      // Add extra separation for nodes with many descendants
      if (maxDescendants > 1) {
        separation += Math.log2(maxDescendants) * 0.3;
      }
      
      // Reduce separation factor at deeper levels to spread nodes more evenly
      // but ensure minimum spacing
      const depthFactor = Math.max(0.5, 1 / Math.sqrt(a.depth || 1));
      
      return separation * depthFactor;
    });

  const treeData = treeLayout(root);
  
  // Post-process to ensure minimum angular separation
  const nodesByDepth = new Map<number, HierarchyPointNode<HierarchyNode>[]>();
  treeData.each(node => {
    const nodes = nodesByDepth.get(node.depth) || [];
    nodes.push(node);
    nodesByDepth.set(node.depth, nodes);
  });
  
  // Sort nodes by angle and adjust if too close
  nodesByDepth.forEach((nodes, depth) => {
    if (depth === 0 || nodes.length <= 1) return;
    
    nodes.sort((a, b) => a.x - b.x);
    
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const curr = nodes[i];
      const minAngle = MIN_NODE_ANGLE_SPACING * (1 + depth * 0.1);
      
      if (curr.x - prev.x < minAngle) {
        // Spread nodes apart
        const adjustment = (minAngle - (curr.x - prev.x)) / 2;
        prev.x -= adjustment;
        curr.x += adjustment;
      }
    }
  });

  // Convert to React Flow nodes
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  treeData.each((node) => {
    const angle = node.x;
    const radius = node.y;
    
    // Convert polar to Cartesian coordinates
    const x = Math.cos(angle - Math.PI / 2) * radius + CENTER_OFFSET.x;
    const y = Math.sin(angle - Math.PI / 2) * radius + CENTER_OFFSET.y;

    const isCenter = node.data.isRoot;
    const depth = node.depth;

    nodes.push({
      id: node.data.id,
      type: isCenter ? 'centerNode' : 'skillNode',
      position: { x: x - (isCenter ? 64 : 50), y: y - (isCenter ? 64 : 30) },
      data: {
        label: node.data.label,
        rating: node.data.rating,
        isSelected: selectedNodeId === node.data.id,
        depth,
      },
    });

    // Create edges to parent
    if (node.parent) {
      edges.push({
        id: `edge-${node.parent.data.id}-${node.data.id}`,
        source: node.parent.data.id,
        sourceHandle: 'center',
        target: node.data.id,
        targetHandle: 'center',
        type: 'straight',
        style: {
          stroke: node.depth === 1 ? 'hsl(199, 89%, 60%)' : '#94a3b8',
          strokeWidth: 2,
          filter: node.depth === 1 ? 'drop-shadow(0 0 4px hsl(199, 89%, 60%))' : 'drop-shadow(0 0 2px rgba(148, 163, 184, 0.4))',
        },
        animated: node.depth === 1,
        zIndex: 0,
      });
    }
  });

  return { nodes, edges };
};

import React, { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  BackgroundVariant,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

import { useRadar } from '@/context/RadarContext';
import { calculateRadialLayout } from '@/utils/radialLayout';
import CenterNode from './CenterNode';
import SkillNodeComponent from './SkillNode';
import MentorSidebar from './MentorSidebar';
import RadarHeader from './RadarHeader';

const nodeTypes = {
  centerNode: CenterNode,
  skillNode: SkillNodeComponent,
};

const GrowthRadar: React.FC = () => {
  const flowRef = useRef<HTMLDivElement>(null);
  const { data, selectedNodeId, setSelectedNodeId } = useRadar();

  // Calculate layout whenever data changes
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    return calculateRadialLayout(data.rootName, data.skills, selectedNodeId);
  }, [data, selectedNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

  // Update nodes when layout changes
  React.useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const handleCapture = useCallback(async () => {
    if (!flowRef.current) return;

    try {
      const reactFlowWrapper = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement;
      if (!reactFlowWrapper) {
        toast.error('Could not find the radar view');
        return;
      }

      const currentNodes = nodes;
      if (currentNodes.length === 0) {
        toast.error('No nodes to capture');
        return;
      }

      // Calculate bounds of all nodes with padding
      const nodesBounds = getNodesBounds(currentNodes);
      const padding = 100;
      
      // Add padding to bounds
      const paddedBounds = {
        x: nodesBounds.x - padding,
        y: nodesBounds.y - padding,
        width: nodesBounds.width + padding * 2,
        height: nodesBounds.height + padding * 2,
      };

      const IMAGE_WIDTH = 2048;
      const IMAGE_HEIGHT = 2048;

      // Calculate the viewport that would show all nodes
      const viewport = getViewportForBounds(
        paddedBounds,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        0.1,
        2,
        0
      );

      const dataUrl = await toPng(reactFlowWrapper, {
        backgroundColor: '#0a0e17',
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        quality: 1,
        style: {
          width: `${IMAGE_WIDTH}px`,
          height: `${IMAGE_HEIGHT}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      const link = document.createElement('a');
      link.download = `360-MindMapr-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('360 View captured successfully!');
    } catch (error) {
      console.error('Error capturing radar:', error);
      toast.error('Failed to capture the radar view');
    }
  }, [nodes]);

  return (
    <div className="w-full h-screen deep-space-bg" ref={flowRef}>
      <RadarHeader onCapture={handleCapture} />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="pt-20"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={1}
          color="hsl(222, 30%, 15%)"
        />
        <Controls
          className="!bg-card/90 !border-primary/40 !shadow-xl text-primary [&_button]:!text-primary [&_svg]:!fill-current [&_svg]:!stroke-current"
          showInteractive={false}
        />
        
        <MiniMap
          className="!bg-card !border-border"
          nodeColor={(node) => {
            if (node.type === 'centerNode') return 'hsl(199, 89%, 48%)';
            const rating = (node.data as { rating?: number })?.rating || 5;
            if (rating <= 4) return 'hsl(0, 72%, 51%)';
            if (rating <= 7) return 'hsl(38, 92%, 50%)';
            return 'hsl(142, 71%, 45%)';
          }}
          maskColor="hsl(222, 47%, 6%, 0.8)"
        />
      </ReactFlow>

      <MentorSidebar />
    </div>
  );
};

export default GrowthRadar;

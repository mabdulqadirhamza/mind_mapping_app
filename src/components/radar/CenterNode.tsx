import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface CenterNodeData extends Record<string, unknown> {
  label: string;
  onAddChild?: () => void;
}

const CenterNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as CenterNodeData;
  
  return (
    <div className="relative group w-32 h-32">
      <div className="w-32 h-32 rounded-full center-node-gradient flex items-center justify-center shadow-2xl animate-pulse-glow cursor-pointer transition-transform duration-300 hover:scale-105">
        <div className="absolute inset-1 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
          <span className="text-lg font-display font-bold text-foreground text-center px-2 leading-tight">
            {nodeData.label}
          </span>
        </div>
      </div>
      
      {/* Single centered handle - all edges originate from center */}
      <Handle 
        type="source" 
        position={Position.Top} 
        id="center"
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        style={{ 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};

export default memo(CenterNode);

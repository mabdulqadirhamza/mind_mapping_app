import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getRatingColor } from '@/types/skill';

interface SkillNodeData extends Record<string, unknown> {
  label: string;
  rating: number;
  isSelected: boolean;
  depth: number;
}

const SkillNodeComponent: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as SkillNodeData;
  const ratingType = getRatingColor(nodeData.rating);
  
  const borderColorClass = {
    beginner: 'border-rating-beginner',
    intermediate: 'border-rating-intermediate',
    expert: 'border-rating-expert',
  }[ratingType];

  const progressColorClass = {
    beginner: 'rating-bar-beginner',
    intermediate: 'rating-bar-intermediate',
    expert: 'rating-bar-expert',
  }[ratingType];

  const glowClass = nodeData.isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';
  const sizeClass = nodeData.depth === 1 ? 'min-w-[120px]' : 'min-w-[100px]';

  return (
    <div className={`relative group ${sizeClass}`}>
      <div
        className={`
          px-4 py-3 rounded-xl bg-node-bg border-2 ${borderColorClass}
          transition-all duration-300 cursor-pointer
          hover:bg-node-hover hover:scale-105
          ${glowClass}
        `}
      >
        {/* Label */}
        <div className="text-sm font-medium text-foreground text-center mb-2 truncate">
          {nodeData.label}
        </div>
        
        {/* Rating Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColorClass} transition-all duration-500 rounded-full`}
            style={{ width: `${(nodeData.rating / 10) * 100}%` }}
          />
        </div>
        
        {/* Rating Number */}
        <div className="text-xs text-muted-foreground text-center mt-1">
          {nodeData.rating}/10
        </div>
      </div>
      
      {/* Single centered target handle - all incoming edges connect to center */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="center"
        className="!opacity-0 !w-0 !h-0 !min-w-0 !min-h-0"
        style={{ 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Single centered source handle - all outgoing edges exit from center */}
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

export default memo(SkillNodeComponent);

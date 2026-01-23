import React from 'react';
import { X, Plus, Trash2, MessageSquare, Target } from 'lucide-react';
import { useRadar, findNodeRecursive } from '@/context/RadarContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getRatingColor, getRatingLabel } from '@/types/skill';

const MentorSidebar: React.FC = () => {
  const {
    data,
    selectedNodeId,
    setSelectedNodeId,
    updateNode,
    addChildNode,
    deleteNode,
    updateRootName,
  } = useRadar();

  if (!selectedNodeId) return null;

  const isRoot = selectedNodeId === 'root';
  const node = isRoot ? null : findNodeRecursive(data.skills, selectedNodeId);

  if (!isRoot && !node) return null;

  const ratingType = node ? getRatingColor(node.rating) : 'expert';
  const ratingLabel = node ? getRatingLabel(node.rating) : '';

  const ratingColorClass = {
    beginner: 'text-rating-beginner',
    intermediate: 'text-rating-intermediate',
    expert: 'text-rating-expert',
  }[ratingType];

  return (
    <div className="fixed right-0 top-0 h-full w-80 glass-panel z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">Mentor Mode</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedNodeId(null)}
          className="hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isRoot ? (
          // Root node editing
          <div className="space-y-4">
            <div>
              <Label htmlFor="root-name" className="text-muted-foreground">Your Name</Label>
              <Input
                id="root-name"
                value={data.rootName}
                onChange={(e) => updateRootName(e.target.value)}
                className="mt-2 bg-muted border-border"
                placeholder="Enter your name"
              />
            </div>
          </div>
        ) : node ? (
          // Skill node editing
          <>
            {/* Label */}
            <div>
              <Label htmlFor="skill-label" className="text-muted-foreground">Skill Name</Label>
              <Input
                id="skill-label"
                value={node.label}
                onChange={(e) => updateNode(node.id, { label: e.target.value })}
                className="mt-2 bg-muted border-border"
                placeholder="Skill name"
              />
            </div>

            {/* Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-muted-foreground">Proficiency Rating</Label>
                <span className={`text-sm font-semibold ${ratingColorClass}`}>
                  {node.rating}/10 • {ratingLabel}
                </span>
              </div>
              <Slider
                value={[node.rating]}
                onValueChange={([value]) => updateNode(node.id, { rating: value })}
                min={1}
                max={10}
                step={1}
                className="mt-4"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            <Separator />

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="comments" className="text-muted-foreground">Notes & Comments</Label>
              </div>
              <Textarea
                id="comments"
                value={node.comments}
                onChange={(e) => updateNode(node.id, { comments: e.target.value })}
                className="mt-2 bg-muted border-border min-h-[100px] resize-none"
                placeholder="Add notes for your mentor discussion..."
              />
            </div>
          </>
        ) : null}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={() => addChildNode(selectedNodeId)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Child Skill
        </Button>
        
        {!isRoot && (
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => deleteNode(selectedNodeId)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Skill
          </Button>
        )}
      </div>
    </div>
  );
};

export default MentorSidebar;

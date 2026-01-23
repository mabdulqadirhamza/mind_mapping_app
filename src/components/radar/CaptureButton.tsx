import React, { useCallback } from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const IMAGE_WIDTH = 2048;
const IMAGE_HEIGHT = 2048;

interface CaptureButtonProps {
  flowRef: React.RefObject<HTMLDivElement>;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ flowRef }) => {
  const { getNodes } = useReactFlow();

  const handleCapture = useCallback(async () => {
    if (!flowRef.current) return;

    try {
      const reactFlowWrapper = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement;
      if (!reactFlowWrapper) {
        toast.error('Could not find the radar view');
        return;
      }

      const nodes = getNodes();
      if (nodes.length === 0) {
        toast.error('No nodes to capture');
        return;
      }

      // Calculate bounds of all nodes with padding
      const nodesBounds = getNodesBounds(nodes);
      const padding = 100;
      
      // Add padding to bounds
      const paddedBounds = {
        x: nodesBounds.x - padding,
        y: nodesBounds.y - padding,
        width: nodesBounds.width + padding * 2,
        height: nodesBounds.height + padding * 2,
      };

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
      link.download = `growth-radar-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('360 View captured successfully!');
    } catch (error) {
      console.error('Error capturing radar:', error);
      toast.error('Failed to capture the radar view');
    }
  }, [flowRef, getNodes]);

  return (
    <Button
      onClick={handleCapture}
      className="bg-primary hover:bg-primary/90"
    >
      <Camera className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Capture 360 View</span>
      <span className="sm:hidden">Capture</span>
    </Button>
  );
};

export default CaptureButton;

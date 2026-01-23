import React, { useCallback } from 'react';
import { RotateCcw, Radar, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRadar } from '@/context/RadarContext';
import { toast } from 'sonner';

interface RadarHeaderProps {
  onCapture?: () => void;
}

const RadarHeader: React.FC<RadarHeaderProps> = ({ onCapture }) => {
  const { resetData } = useRadar();

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset to default data? This cannot be undone.')) {
      resetData();
      toast.success('Mind Map reset to default');
    }
  }, [resetData]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-panel">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl center-node-gradient flex items-center justify-center">
            <Radar className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">
              360 Mind Map
            </h1>
            <p className="text-xs text-muted-foreground">
              Track your professional skills
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onCapture && (
            <Button
              onClick={onCapture}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Capture 360 View</span>
              <span className="sm:hidden">Capture</span>
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="hidden sm:flex"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
};

export default RadarHeader;

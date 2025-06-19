
import React from 'react';
import { Shield } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface ResourceSlidersProps {
  config: any;
  onResourceChange: (type: 'attack' | 'midfield' | 'defense', value: number[]) => void;
  isProMode: boolean;
}

const ResourceSliders: React.FC<ResourceSlidersProps> = ({
  config,
  onResourceChange,
  isProMode
}) => {
  return (
    <div className="space-y-4 pt-2">
      <h4 className="text-sm font-medium text-gray-200 flex items-center gap-2 px-1">
        <Shield className="w-4 h-4" />
        Resource Allocation {!isProMode && '(Auto-calculated)'}
      </h4>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Attack</label>
            <span className="text-sm font-medium text-red-400">{config.resources.attack}</span>
          </div>
          <div className="px-2">
            <Slider
              value={[config.resources.attack]}
              onValueChange={(value) => onResourceChange('attack', value)}
              min={60}
              max={120}
              step={5}
              className="w-full"
              disabled={!isProMode}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Midfield</label>
            <span className="text-sm font-medium text-yellow-400">{config.resources.midfield}</span>
          </div>
          <div className="px-2">
            <Slider
              value={[config.resources.midfield]}
              onValueChange={(value) => onResourceChange('midfield', value)}
              min={60}
              max={120}
              step={5}
              className="w-full"
              disabled={!isProMode}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Defense</label>
            <span className="text-sm font-medium text-blue-400">{config.resources.defense}</span>
          </div>
          <div className="px-2">
            <Slider
              value={[config.resources.defense]}
              onValueChange={(value) => onResourceChange('defense', value)}
              min={60}
              max={120}
              step={5}
              className="w-full"
              disabled={!isProMode}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center pt-1">
        Total: {Object.values(config.resources).reduce((sum, val) => sum + val, 0)}/240 points
      </div>
    </div>
  );
};

export default ResourceSliders;


import React from 'react';
import { Switch } from "@/components/ui/switch";

interface ModeToggleProps {
  isProMode: boolean;
  onToggle: (isProMode: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ isProMode, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg border border-gray-600">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-white">Configuration Mode</h3>
        <p className="text-xs text-gray-400">
          {isProMode ? 'Advanced settings with full control' : 'Simplified settings for quick setup'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${!isProMode ? 'text-white font-medium' : 'text-gray-400'}`}>
          Beginner
        </span>
        <Switch 
          checked={isProMode} 
          onCheckedChange={onToggle}
        />
        <span className={`text-sm ${isProMode ? 'text-white font-medium' : 'text-gray-400'}`}>
          Pro
        </span>
      </div>
    </div>
  );
};

export default ModeToggle;

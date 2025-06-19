
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { predefinedStrategies, playStyles, intensityLevels, teamMentalities } from '@/constants/soccerConfigData';
import SimpleDropdown from './SimpleDropdown';

interface BeginnerModeProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
  onPredefinedStrategy: (strategyValue: string) => void;
  onCreateWithAI: () => void;
}

const BeginnerMode: React.FC<BeginnerModeProps> = ({
  config,
  onConfigChange,
  onPredefinedStrategy,
  onCreateWithAI
}) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onCreateWithAI}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Create with AI
      </Button>

      <SimpleDropdown
        label="Team Strategy"
        value=""
        options={predefinedStrategies}
        onChange={onPredefinedStrategy}
        placeholder="Choose a strategy..."
      />

      <SimpleDropdown
        label="Playing Style"
        value={config.style}
        options={playStyles}
        onChange={(value) => onConfigChange('style', value)}
      />

      <SimpleDropdown
        label="Team Intensity"
        value={config.pressing_intensity}
        options={intensityLevels}
        onChange={(value) => onConfigChange('pressing_intensity', value)}
      />

      <SimpleDropdown
        label="Team Mentality"
        value={config.mentality}
        options={teamMentalities}
        onChange={(value) => onConfigChange('mentality', value)}
      />
    </div>
  );
};

export default BeginnerMode;

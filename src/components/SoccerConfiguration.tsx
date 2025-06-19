
import React, { useState } from 'react';
import { predefinedStrategies } from '@/constants/soccerConfigData';
import { calculateResourceBonus, generateRandomStrategy } from '@/utils/soccerConfigUtils';
import ModeToggle from './soccer/ModeToggle';
import BeginnerMode from './soccer/BeginnerMode';
import ProMode from './soccer/ProMode';
import ResourceSliders from './soccer/ResourceSliders';

interface SoccerConfig {
  formation: string;
  style: string;
  tempo: string;
  mentality: string;
  resources: {
    attack: number;
    midfield: number;
    defense: number;
  };
  pressing_intensity: string;
  risk_reward: string;
  fouling_strategy: string;
  defensive_line: string;
  specialists: string[];
}

interface SoccerConfigurationProps {
  config: SoccerConfig;
  onConfigChange: (config: SoccerConfig) => void;
}

const SoccerConfiguration: React.FC<SoccerConfigurationProps> = ({ config, onConfigChange }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isProMode, setIsProMode] = useState<boolean>(false);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    
    if (!isProMode) {
      // Auto-adjust resources based on selections
      const bonus = calculateResourceBonus(newConfig);
      const baseResources = { attack: 80, midfield: 80, defense: 80 };
      
      newConfig.resources = {
        attack: Math.max(60, Math.min(120, baseResources.attack + bonus.attack)),
        midfield: Math.max(60, Math.min(120, baseResources.midfield + bonus.midfield)),
        defense: Math.max(60, Math.min(120, baseResources.defense + bonus.defense))
      };
      
      // Ensure total doesn't exceed 240
      const total = newConfig.resources.attack + newConfig.resources.midfield + newConfig.resources.defense;
      if (total > 240) {
        const excess = total - 240;
        const reduction = Math.ceil(excess / 3);
        newConfig.resources.attack = Math.max(60, newConfig.resources.attack - reduction);
        newConfig.resources.midfield = Math.max(60, newConfig.resources.midfield - reduction);
        newConfig.resources.defense = Math.max(60, newConfig.resources.defense - reduction);
      }
    }
    
    onConfigChange(newConfig);
  };

  const handleResourceChange = (type: 'attack' | 'midfield' | 'defense', value: number[]) => {
    const newConfig = { ...config };
    newConfig.resources[type] = value[0];
    onConfigChange(newConfig);
  };

  const handlePredefinedStrategy = (strategyValue: string) => {
    const strategy = predefinedStrategies.find(s => s.value === strategyValue);
    if (strategy) {
      const newConfig = {
        ...config,
        ...strategy.config,
        resources: {
          attack: 80,
          midfield: 80,
          defense: 80
        }
      };
      onConfigChange(newConfig);
    }
  };

  const handleCreateWithAI = () => {
    const randomConfig = generateRandomStrategy();
    const newConfig = {
      ...config,
      ...randomConfig
    };
    onConfigChange(newConfig);
  };

  const handleSpecialistToggle = (specialistId: string) => {
    const currentSpecialists = [...config.specialists];
    const index = currentSpecialists.indexOf(specialistId);
    
    if (index > -1) {
      currentSpecialists.splice(index, 1);
    } else if (currentSpecialists.length < 3) {
      currentSpecialists.push(specialistId);
    }
    
    handleConfigChange('specialists', currentSpecialists);
  };

  return (
    <div className="space-y-6 p-1">
      <ModeToggle 
        isProMode={isProMode} 
        onToggle={setIsProMode} 
      />

      {!isProMode ? (
        <BeginnerMode
          config={config}
          onConfigChange={handleConfigChange}
          onPredefinedStrategy={handlePredefinedStrategy}
          onCreateWithAI={handleCreateWithAI}
        />
      ) : (
        <ProMode
          config={config}
          onConfigChange={handleConfigChange}
          onSpecialistToggle={handleSpecialistToggle}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      )}

      <ResourceSliders
        config={config}
        onResourceChange={handleResourceChange}
        isProMode={isProMode}
      />
    </div>
  );
};

export default SoccerConfiguration;

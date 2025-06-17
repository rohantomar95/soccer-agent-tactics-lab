
import React from 'react';
import { Users, Settings, Target, Zap, DollarSign, Star } from 'lucide-react';

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
  const specialists = [
    { id: 'pace_merchant', name: 'Pace Merchant', effects: { pace: 35, attack: 40, creativity: -10 } },
    { id: 'playmaker', name: 'Playmaker', effects: { creativity: 25, midfield: 30, defense: -10 } },
    { id: 'destroyer', name: 'Destroyer', effects: { physicality: 30, defense: 25, creativity: -20 } }
  ];

  const handleResourceChange = (resource: string, value: number) => {
    const newResources = { ...config.resources };
    const oldValue = newResources[resource as keyof typeof newResources];
    
    // Calculate total of other resources
    const otherTotal = Object.keys(newResources)
      .filter(key => key !== resource)
      .reduce((sum, key) => sum + newResources[key as keyof typeof newResources], 0);
    
    // Check if new total would exceed 240
    if (value + otherTotal <= 240 && value >= 60 && value <= 120) {
      newResources[resource as keyof typeof newResources] = value;
      onConfigChange({ ...config, resources: newResources });
    }
  };

  const handleSpecialistToggle = (specialistId: string) => {
    const currentSpecialists = [...config.specialists];
    const index = currentSpecialists.indexOf(specialistId);
    
    if (index > -1) {
      currentSpecialists.splice(index, 1);
    } else if (currentSpecialists.length < 3) {
      currentSpecialists.push(specialistId);
    }
    
    onConfigChange({ ...config, specialists: currentSpecialists });
  };

  const getTotalResources = () => {
    return Object.values(config.resources).reduce((sum, val) => sum + val, 0);
  };

  return (
    <div className="w-full space-y-[2.667rem] md:space-y-[0.781rem]">
      {/* Formation & Style */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <Settings className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Formation & Playing Style
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[4.267rem] md:gap-[1rem]">
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Formation
            </label>
            <select
              value={config.formation}
              onChange={(e) => onConfigChange({ ...config, formation: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="4-4-2" className="bg-gray-800">4-4-2 (Balanced)</option>
              <option value="4-3-3" className="bg-gray-800">4-3-3 (Attacking wings)</option>
              <option value="4-2-3-1" className="bg-gray-800">4-2-3-1 (Creative midfield)</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Playing Style
            </label>
            <select
              value={config.style}
              onChange={(e) => onConfigChange({ ...config, style: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="possession" className="bg-gray-800">Possession (Patient build-up)</option>
              <option value="counter" className="bg-gray-800">Counter (Hit on transition)</option>
              <option value="attacking" className="bg-gray-800">Attacking (Go forward)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tempo & Mentality */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <Zap className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Tempo & Mentality
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[4.267rem] md:gap-[1rem]">
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Tempo
            </label>
            <div className="flex gap-[1.6rem] md:gap-2">
              {['slow', 'medium', 'fast'].map(tempo => (
                <button
                  key={tempo}
                  onClick={() => onConfigChange({ ...config, tempo })}
                  className={`flex-1 py-[2.133rem] px-[3.2rem] md:py-2 md:px-3 rounded-[1.28rem] md:rounded-md text-subheader2 md:text-sm font-medium transition-colors ${
                    config.tempo === tempo
                      ? 'bg-dapp-textAccentTerq text-gray-900'
                      : 'bg-white/5 text-dapp-textSecondary hover:bg-white/10'
                  }`}
                >
                  {tempo.charAt(0).toUpperCase() + tempo.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Mentality
            </label>
            <select
              value={config.mentality}
              onChange={(e) => onConfigChange({ ...config, mentality: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="defensive" className="bg-gray-800">Defensive</option>
              <option value="balanced" className="bg-gray-800">Balanced</option>
              <option value="attacking" className="bg-gray-800">Attacking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <DollarSign className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Resource Allocation
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] space-y-[4.267rem] md:space-y-4">
          <div className="text-dapp-textSecondary text-subheader2 md:text-sm">
            Total: {getTotalResources()}/240 points
          </div>
          {Object.entries(config.resources).map(([resource, value]) => (
            <div key={resource}>
              <div className="flex justify-between items-center mb-[2.133rem] md:mb-2">
                <label className="text-dapp-textSecondary text-subheader2 md:text-sm font-medium capitalize">{resource}</label>
                <span className="text-dapp-textSecondary text-subheader2 md:text-sm">{value} points</span>
              </div>
              <input
                type="range"
                min="60"
                max="120"
                value={value}
                onChange={(e) => handleResourceChange(resource, parseInt(e.target.value))}
                className="w-full h-[1.6rem] md:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Settings */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <Target className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Tactical Settings
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] grid grid-cols-1 md:grid-cols-2 gap-[4.267rem] md:gap-[1rem]">
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Pressing Intensity
            </label>
            <select
              value={config.pressing_intensity}
              onChange={(e) => onConfigChange({ ...config, pressing_intensity: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="passive" className="bg-gray-800">Passive</option>
              <option value="selective" className="bg-gray-800">Selective</option>
              <option value="swarm" className="bg-gray-800">Swarm</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Risk/Reward
            </label>
            <select
              value={config.risk_reward}
              onChange={(e) => onConfigChange({ ...config, risk_reward: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="conservative" className="bg-gray-800">Conservative</option>
              <option value="ambitious" className="bg-gray-800">Ambitious</option>
              <option value="hollywood" className="bg-gray-800">Hollywood</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Fouling Strategy
            </label>
            <select
              value={config.fouling_strategy}
              onChange={(e) => onConfigChange({ ...config, fouling_strategy: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="clean" className="bg-gray-800">Clean</option>
              <option value="professional" className="bg-gray-800">Professional</option>
              <option value="aggressive" className="bg-gray-800">Aggressive</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Defensive Line
            </label>
            <select
              value={config.defensive_line}
              onChange={(e) => onConfigChange({ ...config, defensive_line: e.target.value })}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="high_line" className="bg-gray-800">High Line</option>
              <option value="medium_line" className="bg-gray-800">Medium Line</option>
              <option value="deep_block" className="bg-gray-800">Deep Block</option>
            </select>
          </div>
        </div>
      </div>

      {/* Specialists */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <Star className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Specialists ({config.specialists.length}/3)
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] space-y-[2.667rem] md:space-y-3">
          {specialists.map(specialist => (
            <div
              key={specialist.id}
              onClick={() => handleSpecialistToggle(specialist.id)}
              className={`p-[3.2rem] md:p-3 rounded-[1.6rem] md:rounded-lg border-[0.267rem] md:border-2 cursor-pointer transition-all hover:shadow-md ${
                config.specialists.includes(specialist.id)
                  ? 'border-dapp-textAccentTerq bg-dapp-textAccentTerq/10'
                  : 'border-dapp-strokeSecondary hover:border-dapp-strokeSecondary/60'
              }`}
            >
              <div className="font-medium text-dapp-textPrimary text-subheader2 md:text-base">{specialist.name}</div>
              <div className="text-dapp-textSecondary text-content md:text-sm">
                Effects: {Object.entries(specialist.effects)
                  .map(([stat, value]) => `${stat} ${value > 0 ? '+' : ''}${value}`)
                  .join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoccerConfiguration;

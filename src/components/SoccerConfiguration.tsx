
import React from 'react';
import { Users, Settings, Target, Zap, DollarSign, Star, Info } from 'lucide-react';

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
  const formations = [
    { 
      value: '4-4-2', 
      name: '4-4-2 (Classic)', 
      description: 'Balanced formation with strong midfield presence. Good for possession and counter-attacks.',
      resourceBonus: { attack: 5, midfield: 10, defense: 5 }
    },
    { 
      value: '4-3-3', 
      name: '4-3-3 (Attacking)', 
      description: 'Offensive formation with wide wingers. High attacking threat but vulnerable on flanks.',
      resourceBonus: { attack: 15, midfield: 0, defense: -5 }
    },
    { 
      value: '4-2-3-1', 
      name: '4-2-3-1 (Creative)', 
      description: 'Modern formation with creative midfielder. Great for building attacks through the center.',
      resourceBonus: { attack: 10, midfield: 15, defense: -5 }
    },
    { 
      value: '3-5-2', 
      name: '3-5-2 (Wing-backs)', 
      description: 'Dynamic formation with attacking wing-backs. Dominates midfield but risky in defense.',
      resourceBonus: { attack: 10, midfield: 20, defense: -10 }
    },
    { 
      value: '5-3-2', 
      name: '5-3-2 (Defensive)', 
      description: 'Solid defensive setup with counter-attacking potential. Very hard to break down.',
      resourceBonus: { attack: -10, midfield: 5, defense: 25 }
    },
    { 
      value: '4-1-4-1', 
      name: '4-1-4-1 (Compact)', 
      description: 'Compact formation with defensive midfielder. Excellent for pressing and transitions.',
      resourceBonus: { attack: 0, midfield: 10, defense: 10 }
    }
  ];

  const playingStyles = [
    { 
      value: 'possession', 
      name: 'Possession', 
      description: 'Patient build-up play, keeping the ball and waiting for openings. High pass accuracy.',
      resourceBonus: { attack: 0, midfield: 15, defense: 5 }
    },
    { 
      value: 'counter', 
      name: 'Counter-Attack', 
      description: 'Quick transitions from defense to attack. Fast, direct play to catch opponents off-guard.',
      resourceBonus: { attack: 20, midfield: -5, defense: 5 }
    },
    { 
      value: 'attacking', 
      name: 'All-Out Attack', 
      description: 'Aggressive forward play with many players in attack. High risk, high reward approach.',
      resourceBonus: { attack: 25, midfield: 0, defense: -15 }
    },
    { 
      value: 'defensive', 
      name: 'Defensive', 
      description: 'Solid defensive block, hard to break down. Focus on clean sheets and set pieces.',
      resourceBonus: { attack: -15, midfield: 0, defense: 25 }
    }
  ];

  const tempos = [
    { 
      value: 'slow', 
      name: 'Slow', 
      description: 'Methodical build-up, patient passing. Conserves energy and reduces mistakes.',
      resourceBonus: { attack: -5, midfield: 10, defense: 10 }
    },
    { 
      value: 'medium', 
      name: 'Medium', 
      description: 'Balanced tempo with variety in play. Adapts to game situations effectively.',
      resourceBonus: { attack: 0, midfield: 5, defense: 5 }
    },
    { 
      value: 'fast', 
      name: 'Fast', 
      description: 'High-intensity, quick passing. Overwhelms opponents but requires high fitness.',
      resourceBonus: { attack: 15, midfield: 0, defense: -5 }
    }
  ];

  const mentalities = [
    { 
      value: 'defensive', 
      name: 'Defensive', 
      description: 'Priority on not conceding. Low defensive line, compact shape.',
      resourceBonus: { attack: -10, midfield: 0, defense: 20 }
    },
    { 
      value: 'balanced', 
      name: 'Balanced', 
      description: 'Equal focus on attack and defense. Adaptable to game flow.',
      resourceBonus: { attack: 5, midfield: 5, defense: 5 }
    },
    { 
      value: 'attacking', 
      name: 'Attacking', 
      description: 'Focus on scoring goals. Higher defensive line, more players forward.',
      resourceBonus: { attack: 20, midfield: 0, defense: -10 }
    }
  ];

  const specialists = [
    { 
      id: 'pace_merchant', 
      name: 'Pace Merchant', 
      description: 'Lightning-fast winger who burns past defenders on the flanks.',
      effects: { pace: 35, attack: 40, creativity: -10 },
      resourceCost: { attack: 15, midfield: -5, defense: 0 }
    },
    { 
      id: 'playmaker', 
      name: 'Playmaker', 
      description: 'Creative genius who threads perfect passes and controls the tempo.',
      effects: { creativity: 25, midfield: 30, defense: -10 },
      resourceCost: { attack: 5, midfield: 20, defense: -10 }
    },
    { 
      id: 'destroyer', 
      name: 'Destroyer', 
      description: 'Physical midfielder who breaks up play and wins every tackle.',
      effects: { physicality: 30, defense: 25, creativity: -20 },
      resourceCost: { attack: -10, midfield: 10, defense: 20 }
    },
    { 
      id: 'target_man', 
      name: 'Target Man', 
      description: 'Powerful striker who dominates in the air and holds up play.',
      effects: { strength: 35, aerial: 40, pace: -15 },
      resourceCost: { attack: 25, midfield: -5, defense: 0 }
    },
    { 
      id: 'sweeper_keeper', 
      name: 'Sweeper Keeper', 
      description: 'Modern goalkeeper who acts as an extra defender and starts attacks.',
      effects: { distribution: 30, defense: 20, aerial: 15 },
      resourceCost: { attack: 5, midfield: 5, defense: 15 }
    },
    { 
      id: 'wing_back', 
      name: 'Attacking Wing-Back', 
      description: 'Tireless defender who provides width in attack and tracks back.',
      effects: { stamina: 40, crossing: 25, pace: 20 },
      resourceCost: { attack: 15, midfield: 15, defense: 5 }
    },
    { 
      id: 'box_to_box', 
      name: 'Box-to-Box Midfielder', 
      description: 'Complete midfielder who contributes in all phases of play.',
      effects: { stamina: 35, versatility: 30, consistency: 25 },
      resourceCost: { attack: 10, midfield: 25, defense: 10 }
    },
    { 
      id: 'false_nine', 
      name: 'False 9', 
      description: 'Clever striker who drops deep to create space and confusion.',
      effects: { creativity: 30, movement: 35, finishing: -10 },
      resourceCost: { attack: 10, midfield: 20, defense: 0 }
    }
  ];

  const calculateResourceBonus = () => {
    let bonus = { attack: 0, midfield: 0, defense: 0 };
    
    // Formation bonus
    const formation = formations.find(f => f.value === config.formation);
    if (formation) {
      bonus.attack += formation.resourceBonus.attack;
      bonus.midfield += formation.resourceBonus.midfield;
      bonus.defense += formation.resourceBonus.defense;
    }
    
    // Style bonus
    const style = playingStyles.find(s => s.value === config.style);
    if (style) {
      bonus.attack += style.resourceBonus.attack;
      bonus.midfield += style.resourceBonus.midfield;
      bonus.defense += style.resourceBonus.defense;
    }
    
    // Tempo bonus
    const tempo = tempos.find(t => t.value === config.tempo);
    if (tempo) {
      bonus.attack += tempo.resourceBonus.attack;
      bonus.midfield += tempo.resourceBonus.midfield;
      bonus.defense += tempo.resourceBonus.defense;
    }
    
    // Mentality bonus
    const mentality = mentalities.find(m => m.value === config.mentality);
    if (mentality) {
      bonus.attack += mentality.resourceBonus.attack;
      bonus.midfield += mentality.resourceBonus.midfield;
      bonus.defense += mentality.resourceBonus.defense;
    }
    
    // Specialist bonuses
    config.specialists.forEach(specialistId => {
      const specialist = specialists.find(s => s.id === specialistId);
      if (specialist) {
        bonus.attack += specialist.resourceCost.attack;
        bonus.midfield += specialist.resourceCost.midfield;
        bonus.defense += specialist.resourceCost.defense;
      }
    });
    
    return bonus;
  };

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    
    // Auto-adjust resources based on selections
    const bonus = calculateResourceBonus();
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
        <div className="p-[4.267rem] md:p-[1.25rem] grid grid-cols-1 gap-[4.267rem] md:gap-[1rem]">
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Formation
            </label>
            <select
              value={config.formation}
              onChange={(e) => handleConfigChange('formation', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              {formations.map(formation => (
                <option key={formation.value} value={formation.value} className="bg-gray-800">
                  {formation.name}
                </option>
              ))}
            </select>
            <div className="flex items-start gap-[1.067rem] md:gap-[0.313rem] mt-[2.133rem] md:mt-[0.625rem]">
              <Info className="w-[3.2rem] h-[3.2rem] md:w-3 md:h-3 text-dapp-textSecondary mt-[0.533rem] md:mt-[0.156rem] flex-shrink-0" />
              <p className="text-dapp-textSecondary text-content md:text-[0.781rem] leading-relaxed">
                {formations.find(f => f.value === config.formation)?.description}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Playing Style
            </label>
            <select
              value={config.style}
              onChange={(e) => handleConfigChange('style', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              {playingStyles.map(style => (
                <option key={style.value} value={style.value} className="bg-gray-800">
                  {style.name}
                </option>
              ))}
            </select>
            <div className="flex items-start gap-[1.067rem] md:gap-[0.313rem] mt-[2.133rem] md:mt-[0.625rem]">
              <Info className="w-[3.2rem] h-[3.2rem] md:w-3 md:h-3 text-dapp-textSecondary mt-[0.533rem] md:mt-[0.156rem] flex-shrink-0" />
              <p className="text-dapp-textSecondary text-content md:text-[0.781rem] leading-relaxed">
                {playingStyles.find(s => s.value === config.style)?.description}
              </p>
            </div>
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
        <div className="p-[4.267rem] md:p-[1.25rem] grid grid-cols-1 gap-[4.267rem] md:gap-[1rem]">
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Tempo
            </label>
            <div className="flex gap-[1.6rem] md:gap-2">
              {tempos.map(tempo => (
                <button
                  key={tempo.value}
                  onClick={() => handleConfigChange('tempo', tempo.value)}
                  className={`flex-1 py-[2.133rem] px-[3.2rem] md:py-2 md:px-3 rounded-[1.28rem] md:rounded-md text-subheader2 md:text-sm font-medium transition-colors ${
                    config.tempo === tempo.value
                      ? 'bg-dapp-textAccentTerq text-gray-900'
                      : 'bg-white/5 text-dapp-textSecondary hover:bg-white/10'
                  }`}
                >
                  {tempo.name}
                </button>
              ))}
            </div>
            <div className="flex items-start gap-[1.067rem] md:gap-[0.313rem] mt-[2.133rem] md:mt-[0.625rem]">
              <Info className="w-[3.2rem] h-[3.2rem] md:w-3 md:h-3 text-dapp-textSecondary mt-[0.533rem] md:mt-[0.156rem] flex-shrink-0" />
              <p className="text-dapp-textSecondary text-content md:text-[0.781rem] leading-relaxed">
                {tempos.find(t => t.value === config.tempo)?.description}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Mentality
            </label>
            <select
              value={config.mentality}
              onChange={(e) => handleConfigChange('mentality', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              {mentalities.map(mentality => (
                <option key={mentality.value} value={mentality.value} className="bg-gray-800">
                  {mentality.name}
                </option>
              ))}
            </select>
            <div className="flex items-start gap-[1.067rem] md:gap-[0.313rem] mt-[2.133rem] md:mt-[0.625rem]">
              <Info className="w-[3.2rem] h-[3.2rem] md:w-3 md:h-3 text-dapp-textSecondary mt-[0.533rem] md:mt-[0.156rem] flex-shrink-0" />
              <p className="text-dapp-textSecondary text-content md:text-[0.781rem] leading-relaxed">
                {mentalities.find(m => m.value === config.mentality)?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="bg-dapp-cardPrimary rounded-[3.2rem] md:rounded-[0.938rem] border-[0.267rem] md:border-[0.078rem] border-dapp-strokeSecondary">
        <div className="flex items-center w-full p-[4.267rem] md:p-[1.1rem] justify-between h-[12.8rem] md:h-[3rem] bg-dapp-surfaceCardTitle">
          <div className="flex items-center gap-[2.133rem] md:gap-[0.625rem]">
            <DollarSign className="w-[4.267rem] h-[4.267rem] md:w-5 md:h-5 text-dapp-textPrimary" />
            <div className="text-dapp-textPrimary text-subheader md:text-[1.1rem] font-semibold font-polySansTrialMedianMono">
              Resource Allocation (Auto-Adjusted)
            </div>
          </div>
        </div>
        <div className="p-[4.267rem] md:p-[1.25rem] space-y-[4.267rem] md:space-y-4">
          <div className="text-dapp-textSecondary text-subheader2 md:text-sm">
            Total: {getTotalResources()}/240 points (automatically balanced based on your tactical choices)
          </div>
          {Object.entries(config.resources).map(([resource, value]) => (
            <div key={resource}>
              <div className="flex justify-between items-center mb-[2.133rem] md:mb-2">
                <label className="text-dapp-textSecondary text-subheader2 md:text-sm font-medium capitalize">{resource}</label>
                <span className="text-dapp-textSecondary text-subheader2 md:text-sm">{value} points</span>
              </div>
              <div className="w-full h-[1.6rem] md:h-2 bg-gray-200 rounded-lg relative">
                <div 
                  className="h-full bg-dapp-textAccentTerq rounded-lg transition-all duration-300"
                  style={{ width: `${((value - 60) / 60) * 100}%` }}
                />
              </div>
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
              onChange={(e) => handleConfigChange('pressing_intensity', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="passive" className="bg-gray-800">Passive - Sit back and wait</option>
              <option value="selective" className="bg-gray-800">Selective - Press in key areas</option>
              <option value="swarm" className="bg-gray-800">Swarm - High intensity all over</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Risk/Reward
            </label>
            <select
              value={config.risk_reward}
              onChange={(e) => handleConfigChange('risk_reward', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="conservative" className="bg-gray-800">Conservative - Safe plays</option>
              <option value="ambitious" className="bg-gray-800">Ambitious - Calculated risks</option>
              <option value="hollywood" className="bg-gray-800">Hollywood - Spectacular attempts</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Fouling Strategy
            </label>
            <select
              value={config.fouling_strategy}
              onChange={(e) => handleConfigChange('fouling_strategy', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="clean" className="bg-gray-800">Clean - Minimal contact</option>
              <option value="professional" className="bg-gray-800">Professional - Tactical fouls</option>
              <option value="aggressive" className="bg-gray-800">Aggressive - Physical approach</option>
            </select>
          </div>
          <div>
            <label className="block text-dapp-textSecondary text-subheader2 md:text-[0.938rem] font-normal font-sourceSansRegular mb-[2.133rem] md:mb-[0.625rem]">
              Defensive Line
            </label>
            <select
              value={config.defensive_line}
              onChange={(e) => handleConfigChange('defensive_line', e.target.value)}
              className="w-full px-[3.2rem] py-[2.133rem] md:px-3 md:py-2 bg-white/5 border border-dapp-strokeSecondary rounded-[1.28rem] md:rounded-md text-white focus:border-dapp-strokeSecondary outline-none"
            >
              <option value="high_line" className="bg-gray-800">High Line - Aggressive positioning</option>
              <option value="medium_line" className="bg-gray-800">Medium Line - Balanced approach</option>
              <option value="deep_block" className="bg-gray-800">Deep Block - Conservative defense</option>
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
          <div className="text-dapp-textSecondary text-content md:text-[0.781rem]">
            Choose up to 3 specialists to enhance your team's capabilities
          </div>
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
              <div className="font-medium text-dapp-textPrimary text-subheader2 md:text-base mb-[1.067rem] md:mb-1">
                {specialist.name}
              </div>
              <div className="text-dapp-textSecondary text-content md:text-sm mb-[1.067rem] md:mb-1">
                {specialist.description}
              </div>
              <div className="text-dapp-textSecondary text-content md:text-xs">
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

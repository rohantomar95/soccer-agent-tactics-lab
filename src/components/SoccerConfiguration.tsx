
import React, { useState } from 'react';
import { ChevronDown, Users, Target, Zap, Shield, Clock, Lightbulb, AlertTriangle, MapPin, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const formations = [
    { 
      value: '4-4-2', 
      name: '4-4-2 Classic', 
      description: 'Balanced formation with strong midfield presence. Good for possession and counter-attacks.',
      icon: '⚖️',
      resourceBonus: { attack: 5, midfield: 10, defense: 5 }
    },
    { 
      value: '4-3-3', 
      name: '4-3-3 Attacking', 
      description: 'Offensive formation with wide wingers. High attacking threat but vulnerable on flanks.',
      icon: '⚔️',
      resourceBonus: { attack: 15, midfield: 0, defense: -5 }
    },
    { 
      value: '4-2-3-1', 
      name: '4-2-3-1 Creative', 
      description: 'Modern formation with creative midfielder. Great for building attacks through the center.',
      icon: '🎨',
      resourceBonus: { attack: 10, midfield: 15, defense: -5 }
    },
    { 
      value: '3-5-2', 
      name: '3-5-2 Wing-backs', 
      description: 'Dynamic formation with attacking wing-backs. Dominates midfield but risky in defense.',
      icon: '🚀',
      resourceBonus: { attack: 10, midfield: 20, defense: -10 }
    },
    { 
      value: '5-3-2', 
      name: '5-3-2 Defensive', 
      description: 'Solid defensive setup with counter-attacking potential. Very hard to break down.',
      icon: '🛡️',
      resourceBonus: { attack: -10, midfield: 5, defense: 25 }
    },
    { 
      value: '4-1-4-1', 
      name: '4-1-4-1 Compact', 
      description: 'Compact formation with defensive midfielder. Excellent for pressing and transitions.',
      icon: '🔒',
      resourceBonus: { attack: 0, midfield: 10, defense: 10 }
    },
    { 
      value: '3-4-3', 
      name: '3-4-3 Wide Attack', 
      description: 'Aggressive formation with wide attacking players. Overwhelming in attack, exposed in defense.',
      icon: '🔥',
      resourceBonus: { attack: 20, midfield: 5, defense: -15 }
    },
    { 
      value: '4-5-1', 
      name: '4-5-1 Defensive', 
      description: 'Ultra-defensive setup with packed midfield. Excellent for soaking pressure and countering.',
      icon: '🏰',
      resourceBonus: { attack: -15, midfield: 20, defense: 20 }
    },
    { 
      value: '5-4-1', 
      name: '5-4-1 Ultra-Defensive', 
      description: 'Maximum defensive stability. Nearly impossible to break down but limited attacking options.',
      icon: '⛔',
      resourceBonus: { attack: -20, midfield: 10, defense: 30 }
    }
  ];

  const playingStyles = [
    { 
      value: 'possession', 
      name: 'Possession', 
      description: 'Patient build-up play, keeping the ball and waiting for openings. High pass accuracy.',
      icon: '🎯',
      resourceBonus: { attack: 0, midfield: 15, defense: 5 }
    },
    { 
      value: 'counter', 
      name: 'Counter-Attack', 
      description: 'Quick transitions from defense to attack. Fast, direct play to catch opponents off-guard.',
      icon: '⚡',
      resourceBonus: { attack: 20, midfield: -5, defense: 5 }
    },
    { 
      value: 'attacking', 
      name: 'All-Out Attack', 
      description: 'Aggressive forward play with many players in attack. High risk, high reward approach.',
      icon: '🗡️',
      resourceBonus: { attack: 25, midfield: 0, defense: -15 }
    },
    { 
      value: 'defensive', 
      name: 'Defensive', 
      description: 'Solid defensive block, hard to break down. Focus on clean sheets and set pieces.',
      icon: '🛡️',
      resourceBonus: { attack: -15, midfield: 0, defense: 25 }
    },
    { 
      value: 'pressing', 
      name: 'High Pressing', 
      description: 'Intense pressure all over the pitch. Wins ball high up but exhausting for players.',
      icon: '🔄',
      resourceBonus: { attack: 15, midfield: 15, defense: -10 }
    },
    { 
      value: 'direct', 
      name: 'Direct Play', 
      description: 'Long balls and aerial duels. Bypasses midfield to create quick chances.',
      icon: '📏',
      resourceBonus: { attack: 15, midfield: -10, defense: 10 }
    },
    { 
      value: 'technical', 
      name: 'Technical', 
      description: 'Short passing and technical skill focus. Beautiful football but can be predictable.',
      icon: '⚽',
      resourceBonus: { attack: 10, midfield: 20, defense: -5 }
    }
  ];

  const tempos = [
    { 
      value: 'slow', 
      name: 'Slow Tempo', 
      description: 'Methodical build-up, patient passing. Conserves energy and reduces mistakes.',
      icon: '🐌',
      resourceBonus: { attack: -5, midfield: 10, defense: 10 }
    },
    { 
      value: 'medium', 
      name: 'Medium Tempo', 
      description: 'Balanced tempo with variety in play. Adapts to game situations effectively.',
      icon: '⚖️',
      resourceBonus: { attack: 0, midfield: 5, defense: 5 }
    },
    { 
      value: 'fast', 
      name: 'Fast Tempo', 
      description: 'High-intensity, quick passing. Overwhelms opponents but requires high fitness.',
      icon: '🏃',
      resourceBonus: { attack: 15, midfield: 0, defense: -5 }
    }
  ];

  const mentalities = [
    { 
      value: 'defensive', 
      name: 'Defensive', 
      description: 'Priority on not conceding. Low defensive line, compact shape.',
      icon: '🛡️',
      resourceBonus: { attack: -10, midfield: 0, defense: 20 }
    },
    { 
      value: 'cautious', 
      name: 'Cautious', 
      description: 'Careful approach with emphasis on security. Waits for clear opportunities.',
      icon: '⚠️',
      resourceBonus: { attack: -5, midfield: 5, defense: 10 }
    },
    { 
      value: 'balanced', 
      name: 'Balanced', 
      description: 'Equal focus on attack and defense. Adaptable to game flow.',
      icon: '⚖️',
      resourceBonus: { attack: 5, midfield: 5, defense: 5 }
    },
    { 
      value: 'positive', 
      name: 'Positive', 
      description: 'Confident attacking approach. Looks to create chances regularly.',
      icon: '📈',
      resourceBonus: { attack: 10, midfield: 0, defense: -5 }
    },
    { 
      value: 'attacking', 
      name: 'Attacking', 
      description: 'Focus on scoring goals. Higher defensive line, more players forward.',
      icon: '⚔️',
      resourceBonus: { attack: 20, midfield: 0, defense: -10 }
    },
    { 
      value: 'overload', 
      name: 'Overload Attack', 
      description: 'All-out assault on goal. Maximum attacking commitment, defensive risks.',
      icon: '💥',
      resourceBonus: { attack: 30, midfield: 0, defense: -20 }
    }
  ];

  const pressingIntensities = [
    {
      value: 'passive',
      name: 'Passive',
      description: 'Conservative pressing. Saves energy and maintains defensive shape.',
      icon: '😴',
    },
    {
      value: 'selective',
      name: 'Selective',
      description: 'Smart pressing in key moments. Balanced approach with tactical awareness.',
      icon: '🧠',
    },
    {
      value: 'swarm',
      name: 'Swarm',
      description: 'Aggressive all-out pressing. High intensity but drains stamina quickly.',
      icon: '🐝',
    }
  ];

  const riskRewards = [
    {
      value: 'conservative',
      name: 'Conservative',
      description: 'Safe passing and low-risk plays. High success rate but limited creativity.',
      icon: '🛡️',
    },
    {
      value: 'ambitious',
      name: 'Ambitious',
      description: 'Balanced risk-taking. Good mix of safety and creative opportunities.',
      icon: '🎯',
    },
    {
      value: 'hollywood',
      name: 'Hollywood',
      description: 'High-risk, spectacular plays. Low success rate but potential for brilliance.',
      icon: '🌟',
    }
  ];

  const foulingStrategies = [
    {
      value: 'clean',
      name: 'Clean',
      description: 'Minimal fouling, fair play approach. Lower card risk but allows opponent flow.',
      icon: '✨',
    },
    {
      value: 'professional',
      name: 'Professional',
      description: 'Strategic fouling when necessary. Stops dangerous attacks professionally.',
      icon: '👔',
    },
    {
      value: 'aggressive',
      name: 'Aggressive',
      description: 'Physical intimidation tactics. High card risk but disrupts opponent rhythm.',
      icon: '⚡',
    }
  ];

  const defensiveLines = [
    {
      value: 'high_line',
      name: 'High Line',
      description: 'Advanced defensive position. Great for offside trap but vulnerable to pace.',
      icon: '⬆️',
    },
    {
      value: 'medium_line',
      name: 'Medium Line',
      description: 'Balanced defensive positioning. Adaptable to different game situations.',
      icon: '➡️',
    },
    {
      value: 'deep_block',
      name: 'Deep Block',
      description: 'Conservative defensive positioning. Solid but concedes space to opponent.',
      icon: '⬇️',
    }
  ];

  const specialists = [
    { 
      id: 'pace_merchant', 
      name: 'Pace Merchant', 
      description: 'Lightning-fast winger who burns past defenders on the flanks.',
      icon: '💨',
      effects: { pace: 35, attack: 40, creativity: -10 },
      resourceCost: { attack: 15, midfield: -5, defense: 0 }
    },
    { 
      id: 'playmaker', 
      name: 'Playmaker', 
      description: 'Creative genius who threads perfect passes and controls the tempo.',
      icon: '🎨',
      effects: { creativity: 25, midfield: 30, defense: -10 },
      resourceCost: { attack: 5, midfield: 20, defense: -10 }
    },
    { 
      id: 'destroyer', 
      name: 'Destroyer', 
      description: 'Physical midfielder who breaks up play and wins every tackle.',
      icon: '💥',
      effects: { physicality: 30, defense: 25, creativity: -20 },
      resourceCost: { attack: -10, midfield: 10, defense: 20 }
    },
    { 
      id: 'target_man', 
      name: 'Target Man', 
      description: 'Powerful striker who dominates in the air and holds up play.',
      icon: '🎯',
      effects: { strength: 35, aerial: 40, pace: -15 },
      resourceCost: { attack: 25, midfield: -5, defense: 0 }
    },
    { 
      id: 'sweeper_keeper', 
      name: 'Sweeper Keeper', 
      description: 'Modern goalkeeper who acts as an extra defender and starts attacks.',
      icon: '🧤',
      effects: { distribution: 30, defense: 20, aerial: 15 },
      resourceCost: { attack: 5, midfield: 5, defense: 15 }
    },
    { 
      id: 'wing_back', 
      name: 'Attacking Wing-Back', 
      description: 'Tireless defender who provides width in attack and tracks back.',
      icon: '🏃‍♂️',
      effects: { stamina: 40, crossing: 25, pace: 20 },
      resourceCost: { attack: 15, midfield: 15, defense: 5 }
    },
    { 
      id: 'box_to_box', 
      name: 'Box-to-Box Midfielder', 
      description: 'Complete midfielder who contributes in all phases of play.',
      icon: '🔄',
      effects: { stamina: 35, versatility: 30, consistency: 25 },
      resourceCost: { attack: 10, midfield: 25, defense: 10 }
    },
    { 
      id: 'false_nine', 
      name: 'False 9', 
      description: 'Clever striker who drops deep to create space and confusion.',
      icon: '🎭',
      effects: { creativity: 30, movement: 35, finishing: -10 },
      resourceCost: { attack: 10, midfield: 20, defense: 0 }
    },
    { 
      id: 'set_piece_specialist', 
      name: 'Set Piece Specialist', 
      description: 'Master of dead ball situations. Deadly from free kicks and corners.',
      icon: '🎯',
      effects: { free_kicks: 60, corners: 45, open_play: -15 },
      resourceCost: { attack: 20, midfield: 10, defense: 0 }
    },
    { 
      id: 'dead_ball_specialist', 
      name: 'Penalty Expert', 
      description: 'Ice-cold from the penalty spot and dangerous from all set pieces.',
      icon: '🥅',
      effects: { penalties: 70, free_kicks: 50, pressure_handling: 40 },
      resourceCost: { attack: 15, midfield: 5, defense: 0 }
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

  const CustomDropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    icon: Icon 
  }: { 
    label: string; 
    value: string; 
    options: any[]; 
    onChange: (value: string) => void;
    icon: any;
  }) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Icon className="w-4 h-4" />
          {label}
        </label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-750 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedOption?.icon}</span>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-64 overflow-y-auto">
            <SelectGroup>
              <SelectLabel className="text-gray-400 px-2 py-1">{label} Options</SelectLabel>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer p-3"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium">{option.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const SpecialistDropdown = () => {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Star className="w-4 h-4" />
          Specialists ({config.specialists.length}/3)
        </label>
        <Popover open={openDropdown === 'specialists'} onOpenChange={(open) => setOpenDropdown(open ? 'specialists' : null)}>
          <PopoverTrigger asChild>
            <button className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-750 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>
                  {config.specialists.length > 0 
                    ? `${config.specialists.length} specialist${config.specialists.length > 1 ? 's' : ''} selected`
                    : 'Select specialists'
                  }
                </span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white p-0 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-medium text-gray-200">Available Specialists</h3>
              <p className="text-xs text-gray-400">Choose up to 3 specialists for your team</p>
            </div>
            <div className="p-2 space-y-1">
              {specialists.map((specialist) => {
                const isSelected = config.specialists.includes(specialist.id);
                const canSelect = config.specialists.length < 3 || isSelected;
                
                return (
                  <div
                    key={specialist.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-600/20 border border-blue-500/50' 
                        : canSelect 
                          ? 'hover:bg-gray-700' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => canSelect && handleSpecialistToggle(specialist.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{specialist.icon}</span>
                          <span className="font-medium text-sm">{specialist.name}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {specialist.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Formation */}
      <CustomDropdown
        label="Formation"
        value={config.formation}
        options={formations}
        onChange={(value) => handleConfigChange('formation', value)}
        icon={Users}
      />

      {/* Playing Style */}
      <CustomDropdown
        label="Playing Style"
        value={config.style}
        options={playingStyles}
        onChange={(value) => handleConfigChange('style', value)}
        icon={Target}
      />

      {/* Tempo */}
      <CustomDropdown
        label="Tempo"
        value={config.tempo}
        options={tempos}
        onChange={(value) => handleConfigChange('tempo', value)}
        icon={Clock}
      />

      {/* Mentality */}
      <CustomDropdown
        label="Mentality"
        value={config.mentality}
        options={mentalities}
        onChange={(value) => handleConfigChange('mentality', value)}
        icon={Lightbulb}
      />

      {/* Pressing Intensity */}
      <CustomDropdown
        label="Pressing Intensity"
        value={config.pressing_intensity}
        options={pressingIntensities}
        onChange={(value) => handleConfigChange('pressing_intensity', value)}
        icon={Zap}
      />

      {/* Risk/Reward */}
      <CustomDropdown
        label="Risk/Reward Level"
        value={config.risk_reward}
        options={riskRewards}
        onChange={(value) => handleConfigChange('risk_reward', value)}
        icon={Target}
      />

      {/* Fouling Strategy */}
      <CustomDropdown
        label="Fouling Strategy"
        value={config.fouling_strategy}
        options={foulingStrategies}
        onChange={(value) => handleConfigChange('fouling_strategy', value)}
        icon={AlertTriangle}
      />

      {/* Defensive Line */}
      <CustomDropdown
        label="Defensive Line"
        value={config.defensive_line}
        options={defensiveLines}
        onChange={(value) => handleConfigChange('defensive_line', value)}
        icon={MapPin}
      />

      {/* Specialists */}
      <SpecialistDropdown />

      {/* Resource Allocation Display */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Resource Allocation (Auto-calculated)
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Attack</div>
            <div className="text-lg font-semibold text-red-400">{config.resources.attack}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Midfield</div>
            <div className="text-lg font-semibold text-yellow-400">{config.resources.midfield}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Defense</div>
            <div className="text-lg font-semibold text-blue-400">{config.resources.defense}</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          Total: {Object.values(config.resources).reduce((sum, val) => sum + val, 0)}/240 points
        </div>
      </div>
    </div>
  );
};

export default SoccerConfiguration;

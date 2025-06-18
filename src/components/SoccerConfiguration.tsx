import React, { useState } from 'react';
import { ChevronDown, Users, Target, Zap, Shield, Clock, Lightbulb, AlertTriangle, MapPin, Star, Sparkles } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import { Button } from "@/components/ui/button";

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

  // Predefined strategies for beginner mode
  const predefinedStrategies = [
    {
      value: 'attacking',
      name: 'All-Out Attack',
      description: 'Score lots of goals with aggressive attacking play',
      config: {
        formation: '4-3-3',
        style: 'attacking',
        tempo: 'fast',
        mentality: 'attacking',
        pressing_intensity: 'swarm',
        risk_reward: 'hollywood',
        fouling_strategy: 'clean',
        defensive_line: 'high_line',
        specialists: ['pace_merchant', 'target_man']
      }
    },
    {
      value: 'balanced',
      name: 'Balanced Play',
      description: 'Well-rounded approach with equal focus on attack and defense',
      config: {
        formation: '4-4-2',
        style: 'possession',
        tempo: 'medium',
        mentality: 'balanced',
        pressing_intensity: 'selective',
        risk_reward: 'ambitious',
        fouling_strategy: 'professional',
        defensive_line: 'medium_line',
        specialists: ['playmaker', 'box_to_box']
      }
    },
    {
      value: 'defensive',
      name: 'Solid Defense',
      description: 'Rock-solid defense with counter-attacking opportunities',
      config: {
        formation: '5-3-2',
        style: 'defensive',
        tempo: 'slow',
        mentality: 'defensive',
        pressing_intensity: 'passive',
        risk_reward: 'conservative',
        fouling_strategy: 'professional',
        defensive_line: 'deep_block',
        specialists: ['destroyer', 'sweeper_keeper']
      }
    },
    {
      value: 'counter',
      name: 'Counter Attack',
      description: 'Fast transitions and quick strikes on the break',
      config: {
        formation: '4-2-3-1',
        style: 'counter',
        tempo: 'fast',
        mentality: 'cautious',
        pressing_intensity: 'selective',
        risk_reward: 'ambitious',
        fouling_strategy: 'professional',
        defensive_line: 'medium_line',
        specialists: ['pace_merchant', 'false_nine']
      }
    }
  ];

  const playStyles = [
    { value: 'possession', name: 'Possession', description: 'Keep the ball and build patiently' },
    { value: 'attacking', name: 'Attacking', description: 'Go forward and score goals' },
    { value: 'defensive', name: 'Defensive', description: 'Stay solid and defend well' },
    { value: 'counter', name: 'Counter', description: 'Quick attacks on the break' }
  ];

  const intensityLevels = [
    { value: 'passive', name: 'Relaxed', description: 'Save energy, stay calm' },
    { value: 'selective', name: 'Smart', description: 'Press at the right moments' },
    { value: 'swarm', name: 'Intense', description: 'High pressure everywhere' }
  ];

  const teamMentalities = [
    { value: 'defensive', name: 'Defensive', description: 'Safety first approach' },
    { value: 'balanced', name: 'Balanced', description: 'Equal focus on both ends' },
    { value: 'attacking', name: 'Attacking', description: 'Go for goals aggressively' }
  ];

  // ... keep existing code (formations, playingStyles, tempos, mentalities, etc. arrays)
  const formations = [
    { 
      value: '4-4-2', 
      name: '4-4-2 Classic', 
      description: 'Balanced formation with strong midfield presence. Good for possession and counter-attacks.',
      resourceBonus: { attack: 5, midfield: 10, defense: 5 }
    },
    { 
      value: '4-3-3', 
      name: '4-3-3 Attacking', 
      description: 'Offensive formation with wide wingers. High attacking threat but vulnerable on flanks.',
      resourceBonus: { attack: 15, midfield: 0, defense: -5 }
    },
    { 
      value: '4-2-3-1', 
      name: '4-2-3-1 Creative', 
      description: 'Modern formation with creative midfielder. Great for building attacks through the center.',
      resourceBonus: { attack: 10, midfield: 15, defense: -5 }
    },
    { 
      value: '3-5-2', 
      name: '3-5-2 Wing-backs', 
      description: 'Dynamic formation with attacking wing-backs. Dominates midfield but risky in defense.',
      resourceBonus: { attack: 10, midfield: 20, defense: -10 }
    },
    { 
      value: '5-3-2', 
      name: '5-3-2 Defensive', 
      description: 'Solid defensive setup with counter-attacking potential. Very hard to break down.',
      resourceBonus: { attack: -10, midfield: 5, defense: 25 }
    },
    { 
      value: '4-1-4-1', 
      name: '4-1-4-1 Compact', 
      description: 'Compact formation with defensive midfielder. Excellent for pressing and transitions.',
      resourceBonus: { attack: 0, midfield: 10, defense: 10 }
    },
    { 
      value: '3-4-3', 
      name: '3-4-3 Wide Attack', 
      description: 'Aggressive formation with wide attacking players. Overwhelming in attack, exposed in defense.',
      resourceBonus: { attack: 20, midfield: 5, defense: -15 }
    },
    { 
      value: '4-5-1', 
      name: '4-5-1 Defensive', 
      description: 'Ultra-defensive setup with packed midfield. Excellent for soaking pressure and countering.',
      resourceBonus: { attack: -15, midfield: 20, defense: 20 }
    },
    { 
      value: '5-4-1', 
      name: '5-4-1 Ultra-Defensive', 
      description: 'Maximum defensive stability. Nearly impossible to break down but limited attacking options.',
      resourceBonus: { attack: -20, midfield: 10, defense: 30 }
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
    },
    { 
      value: 'pressing', 
      name: 'High Pressing', 
      description: 'Intense pressure all over the pitch. Wins ball high up but exhausting for players.',
      resourceBonus: { attack: 15, midfield: 15, defense: -10 }
    },
    { 
      value: 'direct', 
      name: 'Direct Play', 
      description: 'Long balls and aerial duels. Bypasses midfield to create quick chances.',
      resourceBonus: { attack: 15, midfield: -10, defense: 10 }
    },
    { 
      value: 'technical', 
      name: 'Technical', 
      description: 'Short passing and technical skill focus. Beautiful football but can be predictable.',
      resourceBonus: { attack: 10, midfield: 20, defense: -5 }
    }
  ];

  const tempos = [
    { 
      value: 'slow', 
      name: 'Slow Tempo', 
      description: 'Methodical build-up, patient passing. Conserves energy and reduces mistakes.',
      resourceBonus: { attack: -5, midfield: 10, defense: 10 }
    },
    { 
      value: 'medium', 
      name: 'Medium Tempo', 
      description: 'Balanced tempo with variety in play. Adapts to game situations effectively.',
      resourceBonus: { attack: 0, midfield: 5, defense: 5 }
    },
    { 
      value: 'fast', 
      name: 'Fast Tempo', 
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
      value: 'cautious', 
      name: 'Cautious', 
      description: 'Careful approach with emphasis on security. Waits for clear opportunities.',
      resourceBonus: { attack: -5, midfield: 5, defense: 10 }
    },
    { 
      value: 'balanced', 
      name: 'Balanced', 
      description: 'Equal focus on attack and defense. Adaptable to game flow.',
      resourceBonus: { attack: 5, midfield: 5, defense: 5 }
    },
    { 
      value: 'positive', 
      name: 'Positive', 
      description: 'Confident attacking approach. Looks to create chances regularly.',
      resourceBonus: { attack: 10, midfield: 0, defense: -5 }
    },
    { 
      value: 'attacking', 
      name: 'Attacking', 
      description: 'Focus on scoring goals. Higher defensive line, more players forward.',
      resourceBonus: { attack: 20, midfield: 0, defense: -10 }
    },
    { 
      value: 'overload', 
      name: 'Overload Attack', 
      description: 'All-out assault on goal. Maximum attacking commitment, defensive risks.',
      resourceBonus: { attack: 30, midfield: 0, defense: -20 }
    }
  ];

  const pressingIntensities = [
    {
      value: 'passive',
      name: 'Passive',
      description: 'Conservative pressing. Saves energy and maintains defensive shape.',
    },
    {
      value: 'selective',
      name: 'Selective',
      description: 'Smart pressing in key moments. Balanced approach with tactical awareness.',
    },
    {
      value: 'swarm',
      name: 'Swarm',
      description: 'Aggressive all-out pressing. High intensity but drains stamina quickly.',
    }
  ];

  const riskRewards = [
    {
      value: 'conservative',
      name: 'Conservative',
      description: 'Safe passing and low-risk plays. High success rate but limited creativity.',
    },
    {
      value: 'ambitious',
      name: 'Ambitious',
      description: 'Balanced risk-taking. Good mix of safety and creative opportunities.',
    },
    {
      value: 'hollywood',
      name: 'Hollywood',
      description: 'High-risk, spectacular plays. Low success rate but potential for brilliance.',
    }
  ];

  const foulingStrategies = [
    {
      value: 'clean',
      name: 'Clean',
      description: 'Minimal fouling, fair play approach. Lower card risk but allows opponent flow.',
    },
    {
      value: 'professional',
      name: 'Professional',
      description: 'Strategic fouling when necessary. Stops dangerous attacks professionally.',
    },
    {
      value: 'aggressive',
      name: 'Aggressive',
      description: 'Physical intimidation tactics. High card risk but disrupts opponent rhythm.',
    }
  ];

  const defensiveLines = [
    {
      value: 'high_line',
      name: 'High Line',
      description: 'Advanced defensive position. Great for offside trap but vulnerable to pace.',
    },
    {
      value: 'medium_line',
      name: 'Medium Line',
      description: 'Balanced defensive positioning. Adaptable to different game situations.',
    },
    {
      value: 'deep_block',
      name: 'Deep Block',
      description: 'Conservative defensive positioning. Solid but concedes space to opponent.',
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
    },
    { 
      id: 'set_piece_specialist', 
      name: 'Set Piece Specialist', 
      description: 'Master of dead ball situations. Deadly from free kicks and corners.',
      effects: { free_kicks: 60, corners: 45, open_play: -15 },
      resourceCost: { attack: 20, midfield: 10, defense: 0 }
    },
    { 
      id: 'dead_ball_specialist', 
      name: 'Penalty Expert', 
      description: 'Ice-cold from the penalty spot and dangerous from all set pieces.',
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
    
    if (!isProMode) {
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
    const randomStrategy = predefinedStrategies[Math.floor(Math.random() * predefinedStrategies.length)];
    const randomResources = {
      attack: Math.floor(Math.random() * 40) + 60, // 60-100
      midfield: Math.floor(Math.random() * 40) + 60, // 60-100
      defense: Math.floor(Math.random() * 40) + 60, // 60-100
    };
    
    const newConfig = {
      ...config,
      ...randomStrategy.config,
      resources: randomResources
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

  const SimpleDropdown = ({ 
    label, 
    value, 
    options, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    options: any[]; 
    onChange: (value: string) => void;
  }) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">
          {label}
        </label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors h-12">
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{selectedOption?.name}</span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>{option.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-200 px-1">
          <Icon className="w-4 h-4" />
          {label}
        </label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700/80 transition-colors h-14 px-4">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 text-left">
                <div className="font-medium text-white">{selectedOption?.name}</div>
                <div className="text-xs text-gray-400 truncate">{selectedOption?.description}</div>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800/95 border-gray-600 text-white max-h-80 overflow-y-auto z-50">
            <SelectGroup>
              <SelectLabel className="text-gray-300 px-4 py-2 text-sm font-medium">{label} Options</SelectLabel>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-gray-700/80 focus:bg-gray-700/80 cursor-pointer px-4 py-3 data-[state=checked]:bg-gray-700/80"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white mb-1">{option.name}</div>
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                        {option.description}
                      </p>
                    </div>
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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-200 px-1">
          <Star className="w-4 h-4" />
          Specialists ({config.specialists.length}/3)
        </label>
        <Popover open={openDropdown === 'specialists'} onOpenChange={(open) => setOpenDropdown(open ? 'specialists' : null)}>
          <PopoverTrigger asChild>
            <button className="w-full bg-gray-800/80 border border-gray-600 text-white px-4 py-4 rounded-lg hover:bg-gray-700/80 transition-colors flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-blue-400" />
                <span className="font-medium">
                  {config.specialists.length > 0 
                    ? `${config.specialists.length} specialist${config.specialists.length > 1 ? 's' : ''} selected`
                    : 'Select specialists'
                  }
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 bg-gray-800/95 border-gray-600 text-white p-0 max-h-96 overflow-y-auto z-50">
            <div className="p-4 border-b border-gray-600">
              <h3 className="font-medium text-gray-100 text-base">Available Specialists</h3>
              <p className="text-xs text-gray-400 mt-1">Choose up to 3 specialists for your team</p>
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
                        ? 'bg-blue-600/30 border border-blue-500/50' 
                        : canSelect 
                          ? 'hover:bg-gray-700/60' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => canSelect && handleSpecialistToggle(specialist.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-5 h-5 mt-1">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-400 bg-blue-500' : 'border-gray-500'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-white">{specialist.name}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
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
    <div className="space-y-6 p-1">
      {/* Mode Toggle */}
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
            onCheckedChange={setIsProMode}
          />
          <span className={`text-sm ${isProMode ? 'text-white font-medium' : 'text-gray-400'}`}>
            Pro
          </span>
        </div>
      </div>

      {/* Beginner Mode */}
      {!isProMode && (
        <div className="space-y-4">
          {/* AI Button */}
          <Button 
            onClick={handleCreateWithAI}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create with AI
          </Button>

          {/* Predefined Strategies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Team Strategy
            </label>
            <Select value="" onValueChange={handlePredefinedStrategy}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors h-12">
                <div className="flex items-center gap-2 w-full">
                  <span>Choose a strategy...</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
                <SelectGroup>
                  {predefinedStrategies.map((strategy) => (
                    <SelectItem 
                      key={strategy.value} 
                      value={strategy.value}
                      className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer p-3"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-xs text-gray-300">{strategy.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Simple Dropdowns */}
          <SimpleDropdown
            label="Playing Style"
            value={config.style}
            options={playStyles}
            onChange={(value) => handleConfigChange('style', value)}
          />

          <SimpleDropdown
            label="Team Intensity"
            value={config.pressing_intensity}
            options={intensityLevels}
            onChange={(value) => handleConfigChange('pressing_intensity', value)}
          />

          <SimpleDropdown
            label="Team Mentality"
            value={config.mentality}
            options={teamMentalities}
            onChange={(value) => handleConfigChange('mentality', value)}
          />
        </div>
      )}

      {/* Pro Mode */}
      {isProMode && (
        <div className="space-y-5">
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
        </div>
      )}

      {/* Resource Sliders - Show in both modes */}
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
                onValueChange={(value) => handleResourceChange('attack', value)}
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
                onValueChange={(value) => handleResourceChange('midfield', value)}
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
                onValueChange={(value) => handleResourceChange('defense', value)}
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
    </div>
  );
};

export default SoccerConfiguration;

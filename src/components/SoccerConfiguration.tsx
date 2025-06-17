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
    },
    { 
      value: '3-4-3', 
      name: '3-4-3 (Wide Attack)', 
      description: 'Aggressive formation with wide attacking players. Overwhelming in attack, exposed in defense.',
      resourceBonus: { attack: 20, midfield: 5, defense: -15 }
    },
    { 
      value: '4-5-1', 
      name: '4-5-1 (Defensive)', 
      description: 'Ultra-defensive setup with packed midfield. Excellent for soaking pressure and countering.',
      resourceBonus: { attack: -15, midfield: 20, defense: 20 }
    },
    { 
      value: '5-4-1', 
      name: '5-4-1 (Ultra-Defensive)', 
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
    <select
      value="Select a strategy..."
      onChange={() => {}}
      className="w-full bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-lg focus:border-gray-600 appearance-none"
    >
      <option value="">Select a strategy...</option>
      <option value="aggressive">Aggressive Formation</option>
      <option value="defensive">Defensive Setup</option>
      <option value="balanced">Balanced Approach</option>
    </select>
  );
};

export default SoccerConfiguration;

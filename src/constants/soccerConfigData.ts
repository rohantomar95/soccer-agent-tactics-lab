
export const predefinedStrategies = [
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

export const formations = [
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

export const playingStyles = [
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

export const tempos = [
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

export const mentalities = [
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

export const pressingIntensities = [
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

export const riskRewards = [
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

export const foulingStrategies = [
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

export const defensiveLines = [
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

export const specialists = [
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

// Simplified options for beginner mode
export const playStyles = [
  { value: 'possession', name: 'Possession', description: 'Keep the ball and build patiently' },
  { value: 'attacking', name: 'Attacking', description: 'Go forward and score goals' },
  { value: 'defensive', name: 'Defensive', description: 'Stay solid and defend well' },
  { value: 'counter', name: 'Counter', description: 'Quick attacks on the break' }
];

export const intensityLevels = [
  { value: 'passive', name: 'Relaxed', description: 'Save energy, stay calm' },
  { value: 'selective', name: 'Smart', description: 'Press at the right moments' },
  { value: 'swarm', name: 'Intense', description: 'High pressure everywhere' }
];

export const teamMentalities = [
  { value: 'defensive', name: 'Defensive', description: 'Safety first approach' },
  { value: 'balanced', name: 'Balanced', description: 'Equal focus on both ends' },
  { value: 'attacking', name: 'Attacking', description: 'Go for goals aggressively' }
];

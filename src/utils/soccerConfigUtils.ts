
import { 
  formations, 
  playingStyles, 
  tempos, 
  mentalities, 
  specialists,
  predefinedStrategies 
} from '@/constants/soccerConfigData';

export const calculateResourceBonus = (config: any) => {
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
  config.specialists.forEach((specialistId: string) => {
    const specialist = specialists.find(s => s.id === specialistId);
    if (specialist) {
      bonus.attack += specialist.resourceCost.attack;
      bonus.midfield += specialist.resourceCost.midfield;
      bonus.defense += specialist.resourceCost.defense;
    }
  });
  
  return bonus;
};

export const generateRandomStrategy = () => {
  const randomStrategy = predefinedStrategies[Math.floor(Math.random() * predefinedStrategies.length)];
  const randomResources = {
    attack: Math.floor(Math.random() * 40) + 60, // 60-100
    midfield: Math.floor(Math.random() * 40) + 60, // 60-100
    defense: Math.floor(Math.random() * 40) + 60, // 60-100
  };
  
  return {
    ...randomStrategy.config,
    resources: randomResources
  };
};

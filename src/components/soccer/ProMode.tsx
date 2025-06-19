
import React from 'react';
import { Users, Target, Clock, Lightbulb, Zap, AlertTriangle, MapPin } from 'lucide-react';
import { 
  formations, 
  playingStyles, 
  tempos, 
  mentalities, 
  pressingIntensities, 
  riskRewards, 
  foulingStrategies, 
  defensiveLines 
} from '@/constants/soccerConfigData';
import CustomDropdown from './CustomDropdown';
import SpecialistDropdown from './SpecialistDropdown';

interface ProModeProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
  onSpecialistToggle: (specialistId: string) => void;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
}

const ProMode: React.FC<ProModeProps> = ({
  config,
  onConfigChange,
  onSpecialistToggle,
  openDropdown,
  setOpenDropdown
}) => {
  return (
    <div className="space-y-5">
      <CustomDropdown
        label="Formation"
        value={config.formation}
        options={formations}
        onChange={(value) => onConfigChange('formation', value)}
        icon={Users}
      />

      <CustomDropdown
        label="Playing Style"
        value={config.style}
        options={playingStyles}
        onChange={(value) => onConfigChange('style', value)}
        icon={Target}
      />

      <CustomDropdown
        label="Tempo"
        value={config.tempo}
        options={tempos}
        onChange={(value) => onConfigChange('tempo', value)}
        icon={Clock}
      />

      <CustomDropdown
        label="Mentality"
        value={config.mentality}
        options={mentalities}
        onChange={(value) => onConfigChange('mentality', value)}
        icon={Lightbulb}
      />

      <CustomDropdown
        label="Pressing Intensity"
        value={config.pressing_intensity}
        options={pressingIntensities}
        onChange={(value) => onConfigChange('pressing_intensity', value)}
        icon={Zap}
      />

      <CustomDropdown
        label="Risk/Reward Level"
        value={config.risk_reward}
        options={riskRewards}
        onChange={(value) => onConfigChange('risk_reward', value)}
        icon={Target}
      />

      <CustomDropdown
        label="Fouling Strategy"
        value={config.fouling_strategy}
        options={foulingStrategies}
        onChange={(value) => onConfigChange('fouling_strategy', value)}
        icon={AlertTriangle}
      />

      <CustomDropdown
        label="Defensive Line"
        value={config.defensive_line}
        options={defensiveLines}
        onChange={(value) => onConfigChange('defensive_line', value)}
        icon={MapPin}
      />

      <SpecialistDropdown
        config={config}
        onSpecialistToggle={onSpecialistToggle}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
    </div>
  );
};

export default ProMode;

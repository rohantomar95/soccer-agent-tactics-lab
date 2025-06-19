
import React from 'react';
import { ChevronDown, Star } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { specialists } from '@/constants/soccerConfigData';

interface SpecialistDropdownProps {
  config: any;
  onSpecialistToggle: (specialistId: string) => void;
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
}

const SpecialistDropdown: React.FC<SpecialistDropdownProps> = ({
  config,
  onSpecialistToggle,
  openDropdown,
  setOpenDropdown
}) => {
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
                  onClick={() => canSelect && onSpecialistToggle(specialist.id)}
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

export default SpecialistDropdown;

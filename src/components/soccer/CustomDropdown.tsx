
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomDropdownProps {
  label: string;
  value: string;
  options: any[];
  onChange: (value: string) => void;
  icon: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon: Icon 
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

export default CustomDropdown;

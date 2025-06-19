
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimpleDropdownProps {
  label: string;
  value: string;
  options: any[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder
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
            <span className="text-lg">
              {selectedOption?.name || placeholder || `Select ${label.toLowerCase()}...`}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600 text-white z-50">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer p-3"
              >
                <div className="space-y-1">
                  <div className="font-medium">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-gray-300">{option.description}</div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SimpleDropdown;

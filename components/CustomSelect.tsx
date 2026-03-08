import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  badge?: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    onChange(optionId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full text-left flex items-center justify-between
          px-4 py-3 bg-white border border-slate-200 rounded-xl
          transition-all duration-200 shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-slate-300 hover:bg-slate-50/50'}
          ${isOpen ? 'ring-2 ring-blue-500/10 border-blue-400' : ''}
        `}
      >
        <div className="flex flex-col truncate">
          {selectedOption ? (
            <span className="text-xs font-bold text-slate-800 truncate">
              {selectedOption.name}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 truncate">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-slideUp border-t-4 border-t-blue-500">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={`
                  w-full text-left px-4 py-3 text-xs flex items-center justify-between
                  transition-colors hover:bg-slate-50
                  ${value === option.id ? 'bg-blue-50/50' : ''}
                `}
              >
                <div className="flex flex-col">
                  <span className={`font-bold ${value === option.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {option.name}
                  </span>
                  {option.description && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {option.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {option.badge && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase">
                      {option.badge}
                    </span>
                  )}
                  {value === option.id && <Check size={14} className="text-blue-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

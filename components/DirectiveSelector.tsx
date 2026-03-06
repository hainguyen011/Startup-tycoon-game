import React, { useState, useEffect } from 'react';
import { Settings2, Megaphone, ChevronDown, RotateCcw, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface DirectiveSelectorProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    options: string[];
    onChange: (val: string) => void;
    placeholder?: string;
}

export const DirectiveSelector: React.FC<DirectiveSelectorProps> = ({ 
    label, 
    icon, 
    value, 
    options, 
    onChange, 
    placeholder 
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const isActuallyCustom = !options.includes(value) && value !== '';
    const [isCustomMode, setIsCustomMode] = useState(isActuallyCustom);
    const [tempCustomValue, setTempCustomValue] = useState(isActuallyCustom ? value : '');

    // Synchronize custom mode if value changes externally
    useEffect(() => {
        const custom = !options.includes(value) && value !== '';
        setIsCustomMode(custom);
        if (custom) setTempCustomValue(value);
    }, [value, options]);

    const handleSelect = (opt: string) => {
        if (opt === 'CUSTOM_ACTION') {
            setIsCustomMode(true);
            setIsOpen(false);
        } else {
            setIsCustomMode(false);
            onChange(opt);
            setIsOpen(false);
        }
    };

    const handleCustomSubmit = () => {
        if (tempCustomValue.trim()) {
            onChange(tempCustomValue.trim());
        }
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCustomMode(false);
        setTempCustomValue('');
        onChange(options[0]);
    };

    return (
        <div className={`space-y-2 group animate-fadeIn relative ${isOpen ? 'z-[100]' : 'z-10'}`}>
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="p-1 bg-slate-100 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {icon}
                    </span>
                    {label}
                </label>
                {isCustomMode && (
                    <button 
                        onClick={handleReset}
                        className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={10} /> {t('dashboard.directiveSelector.back')}
                    </button>
                )}
            </div>

            <div className="relative">
                {isCustomMode ? (
                    <div className="relative animate-slideUpQuick">
                        <input 
                            type="text"
                            value={tempCustomValue}
                            onChange={(e) => setTempCustomValue(e.target.value)}
                            onBlur={handleCustomSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                            className="w-full text-xs p-3 pr-10 bg-white border-2 border-blue-100 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition-all shadow-sm"
                            placeholder={placeholder || t('dashboard.directiveSelector.placeholder')}
                            autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                            <Check size={16} />
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full text-left text-xs p-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-center justify-between shadow-sm ${isOpen ? 'ring-4 ring-slate-100 border-slate-300' : ''}`}
                        >
                            <span className="truncate">{value}</span>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] py-2 overflow-hidden animate-slideUpQuick border-t-4 border-t-blue-500">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleSelect(opt)}
                                                className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-50 flex items-center justify-between ${value === opt ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}
                                            >
                                                {opt}
                                                {value === opt && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                        <button
                                            onClick={() => handleSelect('CUSTOM_ACTION')}
                                            className="w-full text-left px-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                                        >
                                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <Settings2 size={12} />
                                            </span>
                                            {t('dashboard.directiveSelector.custom')}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

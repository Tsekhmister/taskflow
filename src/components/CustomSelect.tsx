import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  size = 'md',
}: CustomSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(opt => opt.value === value) || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected option when value prop changes
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-sm px-4',
    lg: 'h-12 text-base px-4',
  } as const;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  } as const;

  const placeholderText = selectedOption
    ? ''
    : (placeholder ?? t('common.selectOption'));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${sizeClasses[size]} 
          flex items-center justify-between
          bg-white border border-gray-300 rounded-lg
          text-left text-gray-900
          transition-all duration-200 ease-in-out
          hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <span
          className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}
        >
          {selectedOption ? selectedOption.label : placeholderText}
        </span>
        <ChevronDown
          className={`
            ${iconSizes[size]} text-gray-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
                className={`
                  w-full px-4 py-2 text-left transition-colors duration-150
                  flex items-center justify-between
                  ${
                    option.disabled
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-900 hover:bg-blue-50 hover:text-blue-900'
                  }
                  ${
                    selectedOption?.value === option.value
                      ? 'bg-blue-100 text-blue-900'
                      : ''
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                `}
              >
                <span className="truncate">{option.label}</span>
                {selectedOption?.value === option.value && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

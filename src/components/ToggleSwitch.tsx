import React, { useState } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    position: 'relative' as const,
    display: 'inline-flex',
    height: '24px',
    width: '44px',
    alignItems: 'center',
    borderRadius: '9999px',
    border: '2px solid transparent',
    transition: 'all 0.2s ease-in-out',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    backgroundColor: checked
      ? document.documentElement.classList.contains('dark')
        ? '#3b82f6'
        : '#2563eb'
      : document.documentElement.classList.contains('dark')
        ? '#4b5563'
        : '#e5e7eb',
    transform: isHovered && !disabled ? 'scale(1.05)' : 'scale(1)',
  };

  const thumbStyle = {
    position: 'absolute' as const,
    left: '2px',
    height: '20px',
    width: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow:
      isHovered && !disabled
        ? '0 4px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease-in-out',
    transform: checked ? 'translateX(20px)' : 'translateX(0px)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.boxShadow =
        '0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.1)';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      disabled={disabled}
      style={buttonStyle}
      className={className}
      aria-checked={checked}
      role="switch"
      aria-label={`Toggle switch is ${checked ? 'on' : 'off'}`}
    >
      <span style={thumbStyle} />
    </button>
  );
}

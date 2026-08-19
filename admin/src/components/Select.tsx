import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, placeholder = 'Select an option...', required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    // Helper to normalize strings: remove accents and non-alphanumeric characters
    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, "");      // remove spaces, dots, dashes
    };

    const searchNormalized = normalize(searchTerm);
    return options.filter(opt => normalize(opt.label).includes(searchNormalized));
  }, [options, searchTerm]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden native input for required validation if needed, though usually handled by form state */}
      {required && <input type="hidden" required value={value} />}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.625rem 1rem',
          backgroundColor: 'var(--color-bg-elevated)',
          border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          color: value ? 'var(--color-text-base)' : 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'text',
          transition: 'all 0.2s ease',
        }}
      >
        {!isOpen ? (
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem', userSelect: 'none' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        ) : (
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-text-base)', width: '100%', paddingRight: '1rem',
              fontSize: 'inherit', fontFamily: 'inherit'
            }}
            onClick={e => e.stopPropagation()}
          />
        )}
        <ChevronDown 
          size={16} 
          style={{ 
            color: 'var(--color-text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }} 
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          zIndex: 100,
          maxHeight: '250px',
          overflowY: 'auto',
          animation: 'fadeIn 0.15s ease-out',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.25rem'
        }}>
          {filteredOptions.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
              No options match "{searchTerm}"
            </div>
          ) : (
            filteredOptions.map(option => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  style={{
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-base)',
                    fontWeight: isSelected ? '600' : '400',
                    transition: 'background-color 0.1s ease',
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {option.label}
                  </span>
                  {isSelected && <Check size={16} color="var(--color-primary)" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

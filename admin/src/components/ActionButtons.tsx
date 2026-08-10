import React from 'react';
import { Power, Edit2, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onPower?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onPower, onEdit, onDelete }) => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
      <button 
        onClick={onPower} 
        style={{ 
          padding: '0.25rem', 
          color: '#eab308', // orange/yellow color like in the screenshot
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        title="Toggle Status"
      >
        <Power size={18} />
      </button>

      <button 
        onClick={onEdit} 
        style={{ 
          padding: '0.25rem', 
          color: '#e5e7eb', // light gray/white
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        title="Edit"
      >
        <Edit2 size={18} />
      </button>

      <button 
        onClick={onDelete} 
        style={{ 
          padding: '0.25rem', 
          color: '#ef4444', // red
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

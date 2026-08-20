import React from 'react';
import { Power, Edit2, Trash2, Wallet } from 'lucide-react';

interface ActionButtonsProps {
  onPower?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onManageSeats?: () => void;
  onManageWallet?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onPower, onEdit, onDelete, onManageSeats, onManageWallet }) => {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
      {onPower && (
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
      )}

      {onManageWallet && (
        <button 
          onClick={onManageWallet} 
          style={{ 
            padding: '0.25rem', 
            color: '#10b981', // emerald green
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            marginLeft: '0.25rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          title="Manage Wallet"
        >
          <Wallet size={18} />
        </button>
      )}

      {onEdit && (
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
      )}

      {onDelete && (
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
      )}

      {onManageSeats && (
        <button 
          onClick={onManageSeats} 
          style={{ 
            padding: '0.25rem', 
            color: '#3b82f6', // blue
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            marginLeft: '0.25rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          title="Manage Seats"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </button>
      )}
    </div>
  );
};

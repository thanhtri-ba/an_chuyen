import React from 'react';
import { ChevronLeft, ChevronRight, Search, MoreVertical } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onSearch?: (term: string) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, title, onSearch }) => {
  return (
    <div className="pro-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Table Header / Toolbar */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {title && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-base)' }}>{title}</h3>}
        
        {onSearch && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg-base)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.375rem 0.75rem',
            width: '100%',
            maxWidth: '300px',
          }}>
            <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              onChange={(e) => onSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                color: 'var(--color-text-base)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        )}
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-hover)' }}>
              {columns.map((col) => (
                <th key={col.key} style={{ 
                  padding: '0.75rem 1.5rem', 
                  fontSize: '0.75rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                  fontWeight: '600'
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item, index) => (
              <tr key={item.id || index} className="pro-table-row">
                {columns.map((col) => (
                  <td key={col.key} style={{ 
                    padding: '1rem 1.5rem', 
                    fontSize: '0.875rem', 
                    color: 'var(--color-text-base)',
                  }}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Mock) */}
      <div style={{
        padding: '0.75rem 1.5rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Showing 1 to {Math.min(10, data.length)} of {data.length} results
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button style={{
            padding: '0.375rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} disabled>
            <ChevronLeft size={16} />
          </button>
          <button style={{
            padding: '0.375rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-hover)',
            color: 'var(--color-text-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;

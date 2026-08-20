import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { supabase } from '../lib/supabase';

interface SeatManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripScheduleId: string | null;
  tripName?: string;
}

export const SeatManagerModal: React.FC<SeatManagerModalProps> = ({
  isOpen,
  onClose,
  tripScheduleId,
  tripName
}) => {
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [floors, setFloors] = useState(1);
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(3);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    if (isOpen && tripScheduleId) {
      fetchSeats();
    }
  }, [isOpen, tripScheduleId]);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('tripScheduleId', tripScheduleId)
        .order('seatNumber', { ascending: true });
        
      if (error) throw error;
      setSeats(data || []);
    } catch (err: any) {
      alert('Failed to load seats: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!tripScheduleId) return;
    
    if (!window.confirm('Generating new seats will delete all existing seats for this trip. Continue?')) {
      return;
    }
    
    setGenerating(true);
    try {
      // Find the auth token
      const tokenResult = await supabase.auth.getSession();
      const token = tokenResult.data.session?.access_token;
      
      const res = await fetch(`http://localhost:3000/admin/tripSchedules/${tripScheduleId}/generate-seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ floors, rows, cols })
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate seats');
      }
      
      await fetchSeats();
      alert('Seats generated successfully!');
    } catch (err: any) {
      alert('Error generating seats: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const renderSeats = () => {
    const groupedSeats: any = {};
    const otherSeats: any[] = [];
    
    seats.forEach(seat => {
      const match = seat.seatNumber.match(/^T(\d+)-(\d+)([A-Z])$/);
      if (match) {
        const floor = match[1];
        const row = parseInt(match[2], 10);
        const col = match[3];
        
        if (!groupedSeats[floor]) groupedSeats[floor] = {};
        if (!groupedSeats[floor][row]) groupedSeats[floor][row] = [];
        groupedSeats[floor][row].push({ ...seat, col });
      } else {
        otherSeats.push(seat);
      }
    });

    const SeatBox = ({ seat }: { seat: any }) => (
      <div 
        title={seat.seatNumber}
        style={{ 
          width: '3.5rem',
          height: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.5rem',
          border: '2px solid',
          borderColor: seat.status === 'AVAILABLE' ? 'var(--color-border)' : '#ef4444',
          backgroundColor: seat.status === 'AVAILABLE' ? 'var(--color-bg-base)' : 'rgba(239, 68, 68, 0.1)',
          color: seat.status === 'AVAILABLE' ? 'var(--color-text-base)' : '#ef4444',
          fontSize: '1rem',
          fontWeight: '600',
          position: 'relative',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        {/* Pillow representation */}
        <div style={{ position: 'absolute', top: '4px', width: '2rem', height: '6px', borderRadius: '4px', backgroundColor: seat.status === 'AVAILABLE' ? 'var(--color-border)' : 'rgba(239, 68, 68, 0.3)' }}></div>
        <span style={{ marginTop: '0.5rem' }}>{seat.seatNumber.includes('-') ? seat.seatNumber.split('-').pop() : seat.seatNumber}</span>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {Object.keys(groupedSeats).sort((a,b) => Number(a)-Number(b)).map(floor => (
          <div key={floor} style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '2px dashed var(--color-border)', color: 'var(--color-text-base)', fontSize: '1.125rem', fontWeight: 'bold' }}>
              Tầng {floor}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '300px', height: '30px', border: '2px solid var(--color-border)', borderBottom: 'none', borderRadius: '50% 50% 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>FRONT</div>
              
              {Object.keys(groupedSeats[floor]).sort((a,b) => Number(a)-Number(b)).map(row => {
                const rowSeats = groupedSeats[floor][row];
                rowSeats.sort((a: any, b: any) => a.col.localeCompare(b.col));
                
                const halfIndex = Math.ceil(rowSeats.length / 2);
                
                return (
                  <div key={row} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       {rowSeats.slice(0, halfIndex).map((seat: any) => (
                         <SeatBox key={seat.id} seat={seat} />
                       ))}
                     </div>
                     
                     {/* Aisle */}
                     <div style={{ width: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem', writingMode: 'vertical-rl' }}>Aisle</div>
                     
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       {rowSeats.slice(halfIndex).map((seat: any) => (
                         <SeatBox key={seat.id} seat={seat} />
                       ))}
                     </div>
                  </div>
                );
              })}
              
              <div style={{ width: '100%', maxWidth: '300px', height: '10px', border: '2px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 10px 10px', marginTop: '0.5rem' }}></div>
            </div>
          </div>
        ))}
        
        {otherSeats.length > 0 && (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-text-base)', fontSize: '1.125rem', fontWeight: 'bold' }}>Other Seats</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {otherSeats.map(seat => <SeatBox key={seat.id} seat={seat} />)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Seats ${tripName ? `- ${tripName}` : ''}`}>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-base)' }}>
            Generate Seats
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Floors</label>
              <input type="number" min="1" max="2" value={floors} onChange={e => setFloors(Number(e.target.value))} style={{ width: '80px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rows</label>
              <input type="number" min="1" max="15" value={rows} onChange={e => setRows(Number(e.target.value))} style={{ width: '80px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Columns</label>
              <input type="number" min="1" max="6" value={cols} onChange={e => setCols(Number(e.target.value))} style={{ width: '80px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }} />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={generating}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-base)', fontWeight: '600', cursor: 'pointer', height: '38px' }}
            >
              {generating ? 'Generating...' : 'Generate Layout'}
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-base)' }}>
            Current Seats ({seats.length})
          </h3>
          {loading ? (
            <p>Loading seats...</p>
          ) : seats.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No seats found. Generate a layout above.</p>
          ) : (
            renderSeats()
          )}
        </div>
      </div>
    </Modal>
  );
};

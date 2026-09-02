import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  value: string; // 'yyyy-mm-dd'
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

function toDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtDisplay(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// Custom day-grid calendar — replaces the browser's native <input type="date"> popup
// (unstylable, looks completely off-brand) with one that matches the app's own UI.
export function DatePicker({ value, onChange, min, max, disabled, placeholder = 'dd/mm/yyyy', className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? toDate(value) : null;
  const [viewDate, setViewDate] = useState(selected || (max ? toDate(max) : new Date()));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setViewDate(selected);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const minDate = min ? toDate(min) : null;
  const maxDate = max ? toDate(max) : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isDisabled = (d: Date) => (minDate && d < minDate) || (maxDate && d > maxDate);
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yearRange: number[] = [];
  const loY = minDate ? minDate.getFullYear() : year - 100;
  const hiY = maxDate ? maxDate.getFullYear() : year + 10;
  for (let y = hiY; y >= loY; y--) yearRange.push(y);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 bg-white border border-[#D1D5DB] rounded-lg px-[13px] py-[11px] text-sm text-left outline-none transition-all focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]"
      >
        <CalendarIcon size={16} className="text-[#6B7280] shrink-0" />
        <span className={selected ? 'text-[#1F2937]' : 'text-[#9CA3AF]'}>{selected ? fmtDisplay(selected) : placeholder}</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-[280px] bg-white border border-[#D1D5DB] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 rounded-md flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              <select
                value={month}
                onChange={e => setViewDate(new Date(year, Number(e.target.value), 1))}
                className="text-sm font-semibold text-[#1F2937] bg-transparent outline-none cursor-pointer rounded px-1 py-0.5 hover:bg-[#F3F4F6]"
              >
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select
                value={year}
                onChange={e => setViewDate(new Date(Number(e.target.value), month, 1))}
                className="text-sm font-semibold text-[#1F2937] bg-transparent outline-none cursor-pointer rounded px-1 py-0.5 hover:bg-[#F3F4F6]"
              >
                {yearRange.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 rounded-md flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 mb-1">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-[10px] font-bold text-[#9CA3AF] text-center py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const disabledDay = isDisabled(d);
              const isSelected = selected && isSameDay(d, selected);
              const isToday = isSameDay(d, new Date());
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => { onChange(fmt(d)); setOpen(false); }}
                  className={`h-8 w-8 mx-auto rounded-full text-xs font-medium flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-[#FFC107] text-[#1F2937] font-bold' : disabledDay ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#1F2937] hover:bg-[#FFF6DA]'}
                    ${isToday && !isSelected ? 'ring-1 ring-[#FFC107]' : ''}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from 'react';
import { Phone } from 'lucide-react';

const STEPS = [{ l: 'Tìm chuyến' }, { l: 'Chọn ghế' }, { l: 'Thông tin' }, { l: 'Thanh toán' }];

interface BookingStepperProps {
  /** 1-based index of the active step (1 = Tìm chuyến … 4 = Thanh toán). */
  activeStep: 1 | 2 | 3 | 4;
  isMobile?: boolean;
  /** Optional content rendered before the steps (e.g. a logo/back-link), left-aligned. */
  leftSlot?: ReactNode;
}

// Shared step-progress topbar for the booking flow (seat selection → passenger info → payment)
// so all 3 pages render the exact same header instead of near-duplicate one-off implementations.
export function BookingStepper({ activeStep, isMobile = false, leftSlot }: BookingStepperProps) {
  return (
    <div className="flex-shrink-0 z-50 bg-white border-b border-[#DEE2E6] h-16 flex items-center px-4 lg:px-6">
      {leftSlot}
      <div className="flex-1 flex items-center justify-center gap-2 lg:gap-4">
        {STEPS.map((s, i) => {
          const idx = i + 1;
          const active = idx === activeStep;
          return (
            <div key={s.l} className="flex items-center">
              {i > 0 && <div className="w-5 lg:w-10 h-px mx-1.5 lg:mx-3 bg-[#DEE2E6]" />}
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors ${
                    active ? 'bg-[#FFC107] border-[#FFC107] text-[#212529]' : 'bg-white border-[#DEE2E6] text-[#6C757D]'
                  }`}
                >
                  {idx}
                </div>
                {!isMobile && <span className={`text-xs font-bold ${active ? 'text-[#212529]' : 'text-[#6C757D]'}`}>{s.l}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <a href="tel:19001234" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#212529] shrink-0">
        <Phone size={16} className="text-[#6C757D]" /> 1900 1234
      </a>
    </div>
  );
}

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Uniform page-enter/exit used for every route — AnimatePresence in App.tsx keys on
// location.pathname, so this fires on every navigation, not just first load.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

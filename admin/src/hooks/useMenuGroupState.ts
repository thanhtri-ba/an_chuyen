import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_GROUPS } from '../lib/navigation';

const STORAGE_KEY = 'sidebar:collapsedGroups';

const readStoredState = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const useMenuGroupState = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(readStoredState);

  // Auto-expand the group that contains the active route.
  useEffect(() => {
    const activeGroup = NAV_GROUPS.find(g => g.items.some(i => location.pathname.startsWith(i.href)));
    if (activeGroup && collapsed[activeGroup.id]) {
      setCollapsed(prev => {
        const next = { ...prev, [activeGroup.id]: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isCollapsed = useCallback((groupId: string) => !!collapsed[groupId], [collapsed]);

  const toggleGroup = useCallback((groupId: string) => {
    setCollapsed(prev => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { isCollapsed, toggleGroup };
};

import { useState, useCallback } from 'react';

/**
 * Hook to manage modal/dialog visibility state
 */
export function useModal(initialState = false) {
  const [isVisible, setIsVisible] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const open = useCallback((data = null) => {
    setModalData(data);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Optional: delay clearing data to allow exit animations
    setTimeout(() => setModalData(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    modalData,
    open,
    close,
    toggle,
  };
}

import { useLayoutEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
}

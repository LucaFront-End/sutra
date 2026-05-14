import { useEffect, useRef } from 'react';

/**
 * Hook for IntersectionObserver-based scroll reveal animations.
 * Adds the 'revealed' class to elements with the 'reveal' class when they enter the viewport.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const { threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = options;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const container = ref.current;
    if (container) {
      const elements = container.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

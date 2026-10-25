import { useEffect, useRef } from 'react';

export default function useHorizontalWheel(area, track) {
  const cancelWheel = useRef(() => {});
  useEffect(() => {
    const viewport = track.current;
    const container = area.current;
    let animation = 0;
    let target = viewport.scrollLeft;
    let lastFrame = 0;
    const stop = () => {
      cancelAnimationFrame(animation);
      animation = 0;
      target = viewport.scrollLeft;
    };
    cancelWheel.current = stop;
    const step = time => {
      target = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, target));
      const distance = target - viewport.scrollLeft;
      if (Math.abs(distance) < 1) {
        viewport.scrollLeft = target;
        animation = 0;
        return;
      }
      const elapsed = Math.min(32, Math.max(1, time - lastFrame));
      viewport.scrollLeft += distance * (1 - Math.exp(-elapsed / 70));
      lastFrame = time;
      animation = requestAnimationFrame(step);
    };
    const wheel = event => {
      if (event.ctrlKey || event.defaultPrevented) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * unit;
      if (!delta) return;
      const current = animation ? target : viewport.scrollLeft;
      const next = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, current + delta));
      if (Math.abs(next - current) < .5) {
        // Release page scrolling at either end once the gallery has arrived there.
        if (animation && Math.abs(viewport.scrollLeft - next) >= 1) event.preventDefault();
        return;
      }
      event.preventDefault();
      target = next;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        viewport.scrollLeft = next;
      } else if (!animation) {
        lastFrame = performance.now();
        animation = requestAnimationFrame(step);
      }
    };
    container.addEventListener('wheel', wheel, { passive: false });
    container.addEventListener('pointerdown', stop, { passive: true });
    container.addEventListener('touchstart', stop, { passive: true });
    return () => {
      stop();
      container.removeEventListener('wheel', wheel);
      container.removeEventListener('pointerdown', stop);
      container.removeEventListener('touchstart', stop);
      cancelWheel.current = () => {};
    };
  }, [area, track]);
  return cancelWheel;
}

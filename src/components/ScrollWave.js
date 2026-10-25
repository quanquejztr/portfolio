import { useEffect, useRef } from 'react';

// Keep the original silhouette; pan across its extended curve as the page moves.
const WAVE_PATH = 'M0,27L24,40.5C48,54,96,81,144,76.5C192,72,240,36,288,18C336,0,384,0,432,18C480,36,528,72,576,99C624,126,672,144,720,139.5C768,135,816,108,864,103.5C912,99,960,117,1008,135C1056,153,1104,171,1152,153C1200,135,1248,81,1296,49.5C1344,18,1392,9,1440,18C1488,27,1536,54,1584,81C1632,108,1680,135,1728,144C1776,153,1824,144,1872,153C1920,162,1968,189,2016,207C2064,225,2112,234,2160,225C2208,216,2256,189,2304,171C2352,153,2400,144,2448,130.5C2496,117,2544,99,2592,112.5C2640,126,2688,171,2736,166.5C2784,162,2832,108,2880,76.5C2928,45,2976,36,3024,49.5C3072,63,3120,99,3168,117C3216,135,3264,135,3312,144C3360,153,3408,171,3432,180L3456,189L3456,270L3432,270C3408,270,3360,270,3312,270C3264,270,3216,270,3168,270C3120,270,3072,270,3024,270C2976,270,2928,270,2880,270C2832,270,2784,270,2736,270C2688,270,2640,270,2592,270C2544,270,2496,270,2448,270C2400,270,2352,270,2304,270C2256,270,2208,270,2160,270C2112,270,2064,270,2016,270C1968,270,1920,270,1872,270C1824,270,1776,270,1728,270C1680,270,1632,270,1584,270C1536,270,1488,270,1440,270C1392,270,1344,270,1296,270C1248,270,1200,270,1152,270C1104,270,1056,270,1008,270C960,270,912,270,864,270C816,270,768,270,720,270C672,270,624,270,576,270C528,270,480,270,432,270C384,270,336,270,288,270C240,270,192,270,144,270C96,270,48,270,24,270L0,270Z';

export default function ScrollWave() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    let previousTime = 0;
    let elapsed = 0;
    let position = 0;
    let target = 0;

    const measure = () => {
      const { top, height } = svg.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight - top) / (window.innerHeight + height)
      ));
      target = progress * 720;
    };

    const animate = (time) => {
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      elapsed += delta;
      // Frame-rate independent easing keeps trackpad and wheel movement fluid.
      position += (target - position) * (1 - Math.exp(-delta / 85));
      const drift = 55 + Math.sin(elapsed / 1600) * 55;
      svg.setAttribute('viewBox', `${(position + drift).toFixed(2)} 0 1440 270`);
      frame = requestAnimationFrame(animate);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (preference.matches) {
        svg.setAttribute('viewBox', '0 0 1440 270');
      } else if (visible && !document.hidden) {
        measure();
        frame = requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(svg);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
    };
  }, []);

  return (
    <svg ref={svgRef} className="section-wave live-wave" viewBox="0 0 1440 270"
      aria-hidden="true" focusable="false">
      <path fill="#002233" d={WAVE_PATH} />
    </svg>
  );
}

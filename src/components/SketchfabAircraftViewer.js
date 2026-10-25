import { useEffect, useRef, useState } from 'react';

let sdkPromise;
function loadSketchfab() {
  if (window.Sketchfab) return Promise.resolve(window.Sketchfab);
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${process.env.PUBLIC_URL}/vendor/sketchfab-viewer-1.12.1.js`;
      script.onload = () => resolve(window.Sketchfab);
      script.onerror = () => { script.remove(); reject(new Error('Viewer unavailable')); };
      document.head.appendChild(script);
    }).catch(error => { sdkPromise = undefined; throw error; });
  }
  return sdkPromise;
}

export default function SketchfabAircraftViewer({ aircraft }) {
  const frameRef = useRef(null);
  const apiRef = useRef(null);
  const distanceRef = useRef(1);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let active = true;
    let localApi;
    setLoaded(false);
    setFailed(false);
    apiRef.current = null;
    const timeout = setTimeout(() => { if (active) setFailed(true); }, 30000);
    loadSketchfab().then(Sketchfab => {
      if (!active) return;
      const client = new Sketchfab('1.12.1', frameRef.current);
      client.init(aircraft.id, {
        autostart: 1,
        autospin: reducedMotion ? 0 : .2,
        camera: 0,
        scrollwheel: 1,
        dnt: 1,
        ui_theme: 'dark',
        success: api => {
          localApi = api;
          if (!active) { api.stop(); return; }
          apiRef.current = api;
          api.addEventListener('viewerready', () => {
            if (!active) return;
            clearTimeout(timeout);
            api.setBackground({ color: [0, 34 / 255, 51 / 255] });
            api.getCameraLookAt((error, camera) => {
              if (!active || error) return;
              const delta = camera.position.map((value, i) => value - camera.target[i]);
              // The author framed this for a wide viewer; leave room in our narrow column.
              const framingScale = 1.3;
              distanceRef.current = Math.hypot(...delta) * framingScale;
              api.setCameraLookAt(camera.target.map((value, i) => value + delta[i] * framingScale), camera.target, 0);
            });
            setFailed(false);
            setLoaded(true);
          });
          api.start();
        },
        error: () => { if (active) { clearTimeout(timeout); setFailed(true); } },
      });
    }).catch(() => { if (active) { clearTimeout(timeout); setFailed(true); } });
    return () => {
      active = false;
      clearTimeout(timeout);
      apiRef.current = null;
      localApi?.stop();
    };
  }, [aircraft.id, reducedMotion, retry]);

  const moveCamera = (angle = 0, factor = 1) => {
    const api = apiRef.current;
    if (!api || !loaded) return;
    api.getCameraLookAt((error, camera) => {
      if (error) return;
      const delta = camera.position.map((value, i) => value - camera.target[i]);
      const distance = Math.hypot(...delta);
      const nextDistance = Math.max(distanceRef.current * .12,
        Math.min(distanceRef.current * 3, distance * factor));
      const scale = nextDistance / (distance || 1);
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const position = [
        camera.target[0] + (delta[0] * cos - delta[1] * sin) * scale,
        camera.target[1] + (delta[0] * sin + delta[1] * cos) * scale,
        camera.target[2] + delta[2] * scale,
      ];
      api.setCameraLookAt(position, camera.target, reducedMotion ? 0 : .35);
    });
  };

  return (
    <div className="aircraft-object">
      <div className="aircraft-model-stage">
        <iframe ref={frameRef} title={`Interactive ${aircraft.airline} ${aircraft.name}`}
          allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen
          className="aircraft-sketchfab-frame" />
        {!loaded && !failed && <p className="aircraft-model-status" role="status">Loading {aircraft.name}…</p>}
        {failed && <div className="aircraft-model-error" role="alert">
          <p>This aircraft is taking longer to load.</p>
          <button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button>
          <a href={aircraft.url} target="_blank" rel="noreferrer">View on Sketchfab ↗</a>
        </div>}
      </div>
      <div className="aircraft-model-controls">
        <button type="button" aria-label="Rotate aircraft left" disabled={!loaded || failed} onClick={() => moveCamera(-Math.PI / 4)}>←</button>
        <span>360°</span>
        <button type="button" aria-label="Rotate aircraft right" disabled={!loaded || failed} onClick={() => moveCamera(Math.PI / 4)}>→</button>
        <button type="button" aria-label="Zoom out" disabled={!loaded || failed} onClick={() => moveCamera(0, 1.25)}>−</button>
        <button type="button" aria-label="Zoom in" disabled={!loaded || failed} onClick={() => moveCamera(0, .8)}>+</button>
      </div>
      <p className="aircraft-gesture-hint">Drag to rotate · Scroll or pinch to zoom</p>
    </div>
  );
}

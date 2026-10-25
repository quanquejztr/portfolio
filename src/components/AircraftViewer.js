import { useEffect, useRef, useState } from 'react';
import SketchfabAircraftViewer from './SketchfabAircraftViewer';

function LocalAircraftViewer({ aircraft }) {
  const viewerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(preference.matches);
    const onLoad = () => setLoaded(true);
    const onError = () => setFailed(true);
    let active = true;
    syncMotion();
    viewer.addEventListener('load', onLoad);
    viewer.addEventListener('error', onError);
    preference.addEventListener('change', syncMotion);
    // Keep the 3D library out of the initial page bundle.
    import('@google/model-viewer').catch(() => { if (active) setFailed(true); });
    return () => {
      active = false;
      viewer.removeEventListener('load', onLoad);
      viewer.removeEventListener('error', onError);
      preference.removeEventListener('change', syncMotion);
    };
  }, []);

  const rotate = direction => {
    const viewer = viewerRef.current;
    if (!viewer?.getCameraOrbit) return;
    const orbit = viewer.getCameraOrbit();
    viewer.cameraOrbit = `${orbit.theta + direction * Math.PI / 4}rad ${orbit.phi}rad ${orbit.radius}m`;
  };

  return (
    <div className="aircraft-object">
      <div className="aircraft-model-stage">
        <model-viewer ref={viewerRef}
          src={`${process.env.PUBLIC_URL}${aircraft.src}`}
          alt={`Interactive ${aircraft.name}. Drag to rotate 360 degrees. Scroll or pinch to zoom.`}
          camera-controls="" disable-pan=""
          auto-rotate={reducedMotion ? undefined : ''}
          rotation-per-second="18deg" auto-rotate-delay="1800"
          camera-orbit="35deg 65deg 105%"
          min-camera-orbit="auto 5deg 25%" max-camera-orbit="auto 175deg 180%"
          environment-image="neutral" exposure="1.1" shadow-intensity="0"
          touch-action="pan-y" interaction-prompt="none" loading="eager"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }} />
        {!loaded && !failed && <p className="aircraft-model-status" role="status">Loading aircraft…</p>}
        {failed && <p className="aircraft-model-status" role="alert">The 3D aircraft could not load. Try refreshing this page in a browser with WebGL enabled.</p>}
      </div>
      <div className="aircraft-model-controls">
        <button type="button" aria-label="Rotate aircraft left" disabled={!loaded || failed} onClick={() => rotate(-1)}>←</button>
        <span>360°</span>
        <button type="button" aria-label="Rotate aircraft right" disabled={!loaded || failed} onClick={() => rotate(1)}>→</button>
        <button type="button" aria-label="Zoom out" disabled={!loaded || failed} onClick={() => viewerRef.current?.zoom(-2)}>−</button>
        <button type="button" aria-label="Zoom in" disabled={!loaded || failed} onClick={() => viewerRef.current?.zoom(2)}>+</button>
      </div>
      <p className="aircraft-gesture-hint">Drag to rotate · Scroll or pinch to zoom</p>
    </div>
  );
}

export default function AircraftViewer({ aircraft }) {
  return aircraft.provider === 'sketchfab'
    ? <SketchfabAircraftViewer aircraft={aircraft} />
    : <LocalAircraftViewer aircraft={aircraft} />;
}

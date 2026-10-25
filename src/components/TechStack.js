import { useEffect, useRef, useState } from 'react';
import useHorizontalWheel from './useHorizontalWheel';
import Python from '../img/tech-logos/python.svg';
import Java from '../img/tech-logos/java.svg';
import JavaScript from '../img/tech-logos/javascript.svg';
import TypeScript from '../img/tech-logos/typescript.svg';
import C from '../img/tech-logos/c.svg';
import Cpp from '../img/tech-logos/cplusplus.svg';
import CSharp from '../img/tech-logos/csharp.svg';
import ReactLogo from '../img/tech-logos/react.svg';
import Vue from '../img/tech-logos/vuejs.svg';
import Marko from '../img/tech-logos/marko.svg';
import Vanilla from '../img/tech-logos/vanillajs.svg';
import Flask from '../img/tech-logos/flask.svg';
import Django from '../img/tech-logos/django.svg';
import Express from '../img/tech-logos/express.svg';
import Sql from '../img/tech-logos/sql.svg';
import NoSql from '../img/tech-logos/nosql.svg';
import Redis from '../img/tech-logos/redis.svg';
import Docker from '../img/tech-logos/docker.svg';
import Kubernetes from '../img/tech-logos/kubernetes.svg';
import Aws from '../img/tech-logos/amazonwebservices.svg';

const groups = [
  { name: 'Languages', items: [
    { name: 'Python', logo: Python }, { name: 'Java', logo: Java },
    { name: 'JavaScript', logo: JavaScript }, { name: 'TypeScript', logo: TypeScript },
    { name: 'C', logo: C }, { name: 'C++', logo: Cpp }, { name: 'C#', logo: CSharp },
  ] },
  { name: 'Frontend', items: [
    { name: 'React', logo: ReactLogo }, { name: 'Vue', logo: Vue },
    { name: 'MarkoJS', logo: Marko }, { name: 'VanillaJS', logo: Vanilla },
  ] },
  { name: 'Backend', items: [
    { name: 'Flask', logo: Flask, monochrome: true }, { name: 'Django', logo: Django, monochrome: true },
    { name: 'Express', logo: Express, monochrome: true },
  ] },
  { name: 'Data', items: [
    { name: 'SQL', logo: Sql }, { name: 'NoSQL', logo: NoSql }, { name: 'Redis', logo: Redis },
  ] },
  { name: 'Cloud & containers', items: [
    { name: 'Docker', logo: Docker }, { name: 'Kubernetes', logo: Kubernetes },
    { name: 'AWS', logo: Aws, monochrome: true },
  ] },
];

export default function TechStack() {
  const wheelArea = useRef(null);
  const track = useRef(null);
  const cancelWheel = useHorizontalWheel(wheelArea, track);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = () => {
    const viewport = track.current;
    const start = viewport.scrollLeft <= 2;
    const end = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    setEdges(previous => previous.start === start && previous.end === end ? previous : { start, end });
  };
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track.current);
    observer.observe(track.current.firstElementChild);
    updateEdges();
    return () => observer.disconnect();
  }, []);
  const move = (direction, absolute) => {
    cancelWheel.current();
    const viewport = track.current;
    viewport.scrollTo({ left: absolute ?? viewport.scrollLeft + direction * viewport.clientWidth * .7,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <section id="tech-stack" className="tech-stack-section" aria-labelledby="tech-stack-heading">
      <h2 id="tech-stack-heading" className="tech-stack-heading font-archivo">TECH STACK</h2>
      <div ref={wheelArea} className="gallery-wheel-area tech-stack-wheel-area">
        <div ref={track} className="tech-stack-scroll" role="region" aria-label="Technology logo gallery"
          tabIndex={0} onScroll={updateEdges} onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
            } else if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault(); move(0, event.key === 'Home' ? 0 : track.current.scrollWidth);
            }
          }}>
          <div className="tech-stack-track">
            {groups.map(group => <div className="tech-stack-group" key={group.name}>
              <h3>{group.name}</h3>
              <ul aria-label={group.name} className="tech-stack-logos">
                {group.items.map(item => <li key={item.name} className="tech-stack-logo" title={item.name}>
                  <img src={item.logo} alt={item.name} width="96" height="96" loading="lazy"
                    className={item.monochrome ? 'tech-logo-monochrome' : undefined} />
                </li>)}
              </ul>
            </div>)}
          </div>
        </div>
      </div>
      <div className="tech-stack-footer">
        <div className="timeline-gallery-controls">
          <button type="button" aria-label="Scroll tech stack left" disabled={edges.start} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label="Scroll tech stack right" disabled={edges.end} onClick={() => move(1)}>→</button>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HoaLuLogo from '../img/school-logos/hoa-lu.png';
import ThuDucLogo from '../img/school-logos/thu-duc.png';
import UsfSeal from '../img/school-logos/usf-seal.png';
import FptLogo from '../img/company-logos/fpt.png';
import OpswatLogo from '../img/company-logos/opswat.svg';
import AppleLogo from '../img/company-logos/apple.svg';
import useHorizontalWheel from './useHorizontalWheel';

const milestones = [
  { date: '2004', title: 'Born', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2006–2010', title: 'Kindergarten', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2010–2015', title: 'Elementary school', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2015–2019', title: 'Hoa Lư Secondary School', note: 'Ho Chi Minh City, Vietnam', schoolLogo: HoaLuLogo },
  { date: '2019–2022', title: 'Thủ Đức High School', note: 'Ho Chi Minh City, Vietnam', schoolLogo: ThuDucLogo },
  { date: '2022–2026', title: 'University of South Florida', note: 'Undergraduate · Computer Science', undergraduate: true, schoolLogo: UsfSeal },
  { date: 'Jun–Sep 2025', fullDate: 'June 2025 – September 2025', title: 'FPT Software', note: 'Internship', undergraduate: true, company: true, companyLogo: FptLogo },
  { date: 'Sep–Dec 2025', fullDate: 'September 2025 – December 2025', title: 'OPSWAT Inc', note: 'Internship', undergraduate: true, company: true, companyLogo: OpswatLogo },
  { date: 'May–Aug 2026', fullDate: 'May 2026 – August 2026', title: 'Apple Inc', note: 'Internship', undergraduate: true, company: true, companyLogo: AppleLogo },
];

export default function Timeline() {
  const [selected, setSelected] = useState(5);
  const track = useRef(null);
  const wheelArea = useRef(null);
  const cancelWheel = useHorizontalWheel(wheelArea, track);
  const stops = useRef([]);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = () => {
    const viewport = track.current;
    if (!viewport) return;
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
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useLayoutEffect(() => {
    const viewport = track.current;
    const frame = viewport.getBoundingClientRect();
    const item = stops.current[5].getBoundingClientRect();
    viewport.scrollLeft += item.left - frame.left;
  }, []);
  const reveal = index => {
    cancelWheel.current();
    const viewport = track.current;
    const item = stops.current[index];
    const frame = viewport.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    if (rect.left < frame.left || rect.right > frame.right) {
      viewport.scrollTo({ left: viewport.scrollLeft + rect.left - frame.left - (frame.width - rect.width) / 2,
        behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  };
  const scrollGallery = direction => {
    cancelWheel.current();
    const viewport = track.current;
    viewport.scrollTo({ left: viewport.scrollLeft + direction * viewport.clientWidth * .7,
      behavior: reducedMotion() ? 'auto' : 'smooth' });
  };
  const navigate = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = Math.min(milestones.length - 1, index + 1);
    if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = milestones.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setSelected(next);
      stops.current[next].focus({ preventScroll: true });
      reveal(next);
    }
  };
  return (
    <section id="timeline" className="timeline-section" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="timeline-heading font-archivo">EDUCATION &amp; EXPERIENCES</h2>
      <div ref={wheelArea} className="gallery-wheel-area timeline-wheel-area">
        <div className="timeline-intro">
          <span>2004 — 2026</span>
        </div>
        <div data-ui="interactive-timeline" ref={track} className="timeline-scroll" onScroll={updateEdges} role="region" aria-label="Horizontal life timeline">
          <ol className="timeline-track">
            {milestones.map((item, index) => (
              <li key={item.title} className={`${item.undergraduate ? 'timeline-undergraduate' : ''} ${item.schoolLogo ? 'timeline-school' : ''}`}>
                <button ref={node => { stops.current[index] = node; }} type="button"
                  className={`timeline-stop ${index === selected ? 'is-selected' : ''}`}
                  aria-pressed={selected === index} aria-label={`${item.fullDate || item.date}: ${item.title}. ${item.note}`}
                  onClick={() => { setSelected(index); reveal(index); }} onKeyDown={event => navigate(event, index)}>
                  <span className="timeline-years" title={item.fullDate}>{item.date}</span>
                  <span className={`timeline-node ${item.company ? 'timeline-company-node' : ''} ${item.schoolLogo ? 'timeline-school-node' : ''} ${item.companyLogo === AppleLogo ? 'timeline-apple-node' : ''}`} aria-hidden="true">
                    {item.schoolLogo || item.companyLogo ? <img src={item.schoolLogo || item.companyLogo} alt="" loading="lazy" /> : <span />}
                  </span>
                  <span className="timeline-label">{item.title}</span>
                  <span className="timeline-note">{item.note}</span>
                </button>
              </li>
            ))}
            <li className="timeline-continuation" aria-hidden="true" />
          </ol>
        </div>
      </div>
      <div className="timeline-gallery-footer">
        <div className="timeline-gallery-controls">
          <button type="button" aria-label="Scroll timeline left" disabled={edges.start} onClick={() => scrollGallery(-1)}>←</button>
          <button type="button" aria-label="Scroll timeline right" disabled={edges.end} onClick={() => scrollGallery(1)}>→</button>
        </div>
      </div>
    </section>
  );
}

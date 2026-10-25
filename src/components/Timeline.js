import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HoaLuLogo from '../img/school-logos/hoa-lu.png';
import ThuDucLogo from '../img/school-logos/thu-duc.png';
import UsfSeal from '../img/school-logos/usf-seal.png';
import FptLogo from '../img/company-logos/fpt.png';
import OpswatLogo from '../img/company-logos/opswat.svg';
import AppleLogo from '../img/company-logos/apple.svg';
import useHorizontalWheel from './useHorizontalWheel';
import ExperienceTechStack from './ExperienceTechStack';
import GpaHonor from './GpaHonor';

const milestones = [
  { date: '2004', title: 'Born', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2006–2010', title: 'Kindergarten', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2010–2015', title: 'Elementary school', note: 'Ho Chi Minh City, Vietnam' },
  { date: '2015–2019', title: 'Hoa Lư Secondary School', note: 'Ho Chi Minh City, Vietnam', schoolLogo: HoaLuLogo },
  { date: '2019–2022', title: 'Thủ Đức High School', note: 'Ho Chi Minh City, Vietnam', schoolLogo: ThuDucLogo },
  { date: '2022–2026', title: 'University of South Florida', note: "Bachelor's of Science in Computer Science", undergraduate: true, schoolLogo: UsfSeal },
  { date: 'Jun–Sep 2025', fullDate: 'June 2025 – September 2025', title: 'FPT Software', note: 'Internship', undergraduate: true, company: true, companyLogo: FptLogo },
  { date: 'Sep–Dec 2025', fullDate: 'September 2025 – December 2025', title: 'OPSWAT Inc', note: 'Internship', undergraduate: true, company: true, companyLogo: OpswatLogo },
  { date: 'May–Aug 2026', fullDate: 'May 2026 – August 2026', title: 'Apple Inc', note: 'Internship', undergraduate: true, company: true, companyLogo: AppleLogo },
];

const experienceDetails = {
  'Thủ Đức High School': {
    role: 'High school',
    description: 'N/A',
  },
  'University of South Florida': {
    role: "Bachelor's of Science in Computer Science",
    gpa: '3.7',
    honor: 'Magna Cum Laude',
    coursework: 'Operating Systems, Analysis of Algorithms, Data Structures & Algorithms, Software System Development, Discrete Structures, Computer Architecture, Computer Logic & Design, Probability & Statistics, Linear Systems, Computer Networks.',
  },
  'FPT Software': {
    role: 'Internship',
    team: 'Patient Insights Analysis',
    partner: 'In partnership with NRC Health',
    description: 'During my internship at FPT Software, I worked on Patient Insights Analysis in partnership with NRC Health.',
  },
  'OPSWAT Inc': {
    role: 'Internship',
    team: 'MetaDefender Endpoint SDK',
    description: 'I built an automated security-compliance data platform that normalizes fragmented threat feeds into an event-driven DuckDB data lakehouse, enabling real-time natural language querying across vulnerabilities and patches. The system features a background Java file watcher for zero-downtime hot-swapping of incoming datasets and an AI-powered dashboard for security analysts.',
    technologies: 'Next.js, TypeScript, Python (FastAPI, LangChain), DuckDB, Apache Parquet, Java (WatchService), PostgreSQL, Zstandard.',
  },
  'Apple Inc': {
    role: 'Software Engineering Intern',
    team: 'Streaming Media Ecosystem Tech',
    description: 'At Apple, I built an agentic root-cause analysis system that diagnoses failed PR checks and proposes fixes automatically, saving engineers from manually digging through logs and code with a coworker. I also built a repository-agnostic FastMCP server that brings live merge-gate status into coding agents, including a custom OAuth proxy with dual PKCE flows that keeps each developer’s credentials and data isolated.',
    technologies: 'Python, Airflow, FastMCP, Pydantic AI, Kubernetes, Bitbucket API.',
  },
};

export default function Timeline() {
  const [selected, setSelected] = useState(5);
  const [experienceIndex, setExperienceIndex] = useState(6);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailPanel = useRef(null);
  const wasDetailsOpen = useRef(false);
  const company = milestones[experienceIndex];
  const experience = experienceDetails[company.title];
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
  const closeDetails = () => {
    setDetailsOpen(false);
  };
  const selectMilestone = index => {
    setSelected(index);
    reveal(index);
    if (experienceDetails[milestones[index].title]) {
      setExperienceIndex(index);
      setDetailsOpen(open => !(open && experienceIndex === index));
    } else setDetailsOpen(false);
  };
  useEffect(() => {
    if (detailsOpen) {
      detailPanel.current?.querySelector('button')?.focus({ preventScroll: true });
      detailPanel.current?.scrollIntoView?.({ block: 'nearest', behavior: reducedMotion() ? 'instant' : 'smooth' });
    } else if (wasDetailsOpen.current) {
      stops.current[experienceIndex]?.focus({ preventScroll: true });
    }
    wasDetailsOpen.current = detailsOpen;
  }, [detailsOpen, experienceIndex]);
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
    <section id="timeline" className={`timeline-section${detailsOpen ? ' has-experience-details' : ''}`} aria-labelledby="timeline-heading"
      onKeyDown={event => { if (event.key === 'Escape' && detailsOpen) { event.stopPropagation(); closeDetails(); } }}>
      <header className="timeline-section-heading">
        <h2 id="timeline-heading" className="timeline-heading font-archivo">EDUCATION &amp; EXPERIENCES</h2>
        <span className="timeline-explore-hint" aria-hidden="true">Click to explore</span>
      </header>
      <div className={`timeline-experience-reveal${detailsOpen ? ' is-open' : ''}`} aria-hidden={!detailsOpen} inert={!detailsOpen}>
        <div className="timeline-experience-clip">
          <article ref={detailPanel} id="timeline-experience-details" className="timeline-experience-panel" aria-labelledby="timeline-experience-company">
            <button type="button" className="timeline-experience-close" aria-label="Back to timeline" onClick={closeDetails}>Back</button>
            <div className="timeline-experience-identity">
              <img className={`timeline-experience-logo${company.companyLogo === AppleLogo ? ' is-apple' : ''}${company.schoolLogo ? ' is-school' : ''}`} src={company.companyLogo || company.schoolLogo} alt={`${company.title} logo`} />
              <h3 id="timeline-experience-company">{company.title}</h3>
              <p className="timeline-experience-role">{experience.role}</p>
              <p className="timeline-experience-date">{company.fullDate || company.date}</p>
              {experience.team && <p className="timeline-experience-team">{experience.team}</p>}
              {experience.partner && <p className="timeline-experience-team">{experience.partner}</p>}
            </div>
            <div className="timeline-experience-description">
              <h4>Description</h4>
              {experience.gpa && <p className="timeline-experience-gpa"><strong>GPA:</strong>{' '}<GpaHonor gpa={experience.gpa} honor={experience.honor} /></p>}
              {experience.description && <p>{experience.description}</p>}
              {experience.coursework && <p className="timeline-experience-stack"><strong>Coursework:</strong> {experience.coursework}</p>}
              {experience.technologies && <ExperienceTechStack company={company.title} />}
            </div>
          </article>
        </div>
      </div>
      <div className={`timeline-gallery-reveal${detailsOpen ? ' is-hidden' : ''}`} aria-hidden={detailsOpen} inert={detailsOpen}>
        <div className="timeline-gallery-clip">
      <div ref={wheelArea} className="gallery-wheel-area timeline-wheel-area">
        <div data-ui="interactive-timeline" ref={track} className="timeline-scroll" onScroll={updateEdges} role="region" aria-label="Horizontal life timeline">
          <ol className="timeline-track">
            {milestones.map((item, index) => (
              <li key={item.title} className={`${item.undergraduate ? 'timeline-undergraduate' : ''} ${item.schoolLogo ? 'timeline-school' : ''}`}>
                <button ref={node => { stops.current[index] = node; }} type="button"
                  className={`timeline-stop ${index === selected ? 'is-selected' : ''}`}
                  aria-pressed={selected === index} aria-expanded={experienceDetails[item.title] ? detailsOpen && experienceIndex === index : undefined}
                  aria-controls={experienceDetails[item.title] ? 'timeline-experience-details' : undefined} aria-label={`${item.fullDate || item.date}: ${item.title}. ${item.note}`}
                  onClick={() => selectMilestone(index)} onKeyDown={event => navigate(event, index)}>
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
        </div>
      </div>
    </section>
  );
}

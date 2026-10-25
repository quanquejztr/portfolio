import { useEffect, useRef, useState } from 'react';
import BullsLogo from '../img/usf-bulls.png';
import AppleLogo from '../img/company-logos/apple.svg';
import AircraftViewer from '../components/AircraftViewer';
import FutureCompany from '../components/FutureCompany';
import { aircraftModels } from '../components/aircraftModels';
import { useDisplayName } from '../components/DisplayName';

const teamPhotos = [
  { src: '/photos/apple-team/01.jpg', caption: 'Summer with the team', alt: 'A group photo with fellow Apple interns and colleagues outdoors' },
  { src: '/photos/apple-team/02.jpg', caption: 'A day by the coast', alt: 'A group of friends on a coastal hike overlooking the ocean' },
  { src: '/photos/apple-team/03.jpg', caption: 'Today at Apple', alt: 'A group photo after a Today at Apple workshop' },
  { src: '/photos/apple-team/04.jpg', caption: 'Summer in San Diego', alt: 'Apple interns posing together at the San Diego summer event' },
  { src: '/photos/apple-team/05.jpg', caption: 'Lunch with the team', alt: 'The team sharing a meal together at a restaurant' },
];

function WordSwap({ children, label, className = '' }) {
  const [active, setActive] = useState(false);
  return (
    <button type="button" className={`word-swap ${className} ${active ? 'is-swapped' : ''}`}
      aria-label={label} aria-pressed={active} onClick={() => setActive(value => !value)}>
      <span className="word-swap-label">{label}</span>
      <span className="word-swap-image" aria-hidden="true">{children}</span>
    </button>
  );
}

const AboutMe = () => {
  const { firstName } = useDisplayName();
  const [showingPreview, setShowingPreview] = useState(false);
  const [previewKind, setPreviewKind] = useState('aircraft');
  const [photoIndex, setPhotoIndex] = useState(0);
  const teamTrigger = useRef(null);
  const [renderAircraft, setRenderAircraft] = useState(false);
  const [aircraftIndex, setAircraftIndex] = useState(0);
  const aircraftTriggers = useRef([]);
  const lastTrigger = useRef(0);
  const aircraft = aircraftModels[aircraftIndex];
  const changeAircraft = direction => setAircraftIndex(index => (index + direction + aircraftModels.length) % aircraftModels.length);
  useEffect(() => {
    if (showingPreview && previewKind === 'aircraft') {
      setRenderAircraft(true);
      return undefined;
    }
    // Let the panel finish fading before releasing the 3D viewer.
    const timeout = setTimeout(() => setRenderAircraft(false), 750);
    return () => clearTimeout(timeout);
  }, [showingPreview, previewKind]);
  const closePreview = () => {
    if (lastTrigger.current === 'team') teamTrigger.current?.focus();
    else aircraftTriggers.current[lastTrigger.current]?.focus();
    setShowingPreview(false);
  };
  const changePhoto = direction => setPhotoIndex(index => (index + direction + teamPhotos.length) % teamPhotos.length);
  const aircraftTrigger = index => (
    <span className="aircraft-trigger-wrap">
      <button ref={node => { aircraftTriggers.current[index] = node; }} type="button" className="aircraft-trigger"
        aria-expanded={showingPreview && previewKind === 'aircraft' && aircraftIndex === index} aria-controls="about-preview"
        aria-describedby={`aircraft-click-hint-${index}`}
        onClick={() => {
          lastTrigger.current = index;
          setShowingPreview(showing => !(showing && previewKind === 'aircraft' && aircraftIndex === index));
          setPreviewKind('aircraft');
          setAircraftIndex(index);
        }}>
        {aircraftModels[index].label}
      </button>
      <span id={`aircraft-click-hint-${index}`} className="aircraft-click-hint" role="tooltip">
        {showingPreview && previewKind === 'aircraft' && aircraftIndex === index ? 'Click to close' : 'Click to explore'}
      </span>
    </span>
  );

  return (
    <div className={`about-section${showingPreview ? ' has-preview' : ''}`} onKeyDown={event => {
      if (event.key === 'Escape' && showingPreview) closePreview();
    }}>
      <h2 className="about-heading">
        <span className="font-archivo">ABOUT ME</span>
      </h2>
      <div className={`about-content ${showingPreview ? 'has-aircraft' : ''}`}>
        <div className="about-copy font-dm-sans">
          <p>
            Hi there, I am {firstName} and almost a software engineer @ <FutureCompany />. I spend time coding, playing flight simulator (RFS, my fav aircraft is the{' '}
            {aircraftTrigger(0)}
            ), worrying about my future, and traveling whenever I have money. I am currently pursuing my bachelor’s degree in Computer Science at the{' '}
            <WordSwap label="University of South Florida" className="usf-swap">
              <span className="bulls-cheer">Go Bulls</span>
              <img src={BullsLogo} alt="" title="USF Athletics · CC BY-SA 4.0 · via Wikimedia Commons" width="1280" height="1025" />
            </WordSwap>
            . For the past two months, I have been working on Airside Machine, a real-time airline management simulation where you grow a carrier from a single hub, competing for airport gates, runway slots, and passengers against AI airlines on a live world map. It’s built from scratch in Python and JavaScript, with an economic model driven by real-world air traffic data.
          </p>
          <p>
            I would say my academic journey has been chaotic—yes, that’s so true—and peaceful as well. This past summer, I interned as a software engineer at <WordSwap label="Apple" className="apple-swap"><img src={AppleLogo} alt="" /></WordSwap> in the{' '}
            <span className="aircraft-trigger-wrap team-trigger-wrap">
              <button ref={teamTrigger} type="button" className="aircraft-trigger team-trigger"
                aria-expanded={showingPreview && previewKind === 'team'} aria-controls="about-preview" aria-describedby="team-click-hint"
                onClick={() => {
                  lastTrigger.current = 'team';
                  setShowingPreview(showing => !(showing && previewKind === 'team'));
                  setPreviewKind('team');
                }}>Streaming Media Ecosystem Tech</button>
              <span id="team-click-hint" className="aircraft-click-hint" role="tooltip">{showingPreview && previewKind === 'team' ? 'Click to close' : 'Click to see photos'}</span>
            </span> team, where I worked on building a root-cause analysis system that tells engineers why their code checks failed, alongside developing an MCP server for an internal tool used by engineers in the MGC organization.
          </p>
          <p>
            I was born, raised, and went from kindergarten through high school in Ho Chi Minh City,{' '}
            <WordSwap label="Vietnam" className="vietnam-swap">
              <svg viewBox="0 0 30 20" focusable="false">
                <path fill="#da251d" d="M0 0h30v20H0z" />
                <path fill="#ff0" d="m15 4 1.35 4.15h4.36l-3.53 2.57 1.35 4.15L15 12.3l-3.53 2.57 1.35-4.15-3.53-2.57h4.36z" />
              </svg>
            </WordSwap>
            , and moved to the United States for college. Having access to computers from a young age gave me room to explore, figure things out independently, and develop a love for building things with technology.
          </p>
          <p className="about-job-search">I am graduating soon and is actively looking for my first full-time role as a software engineer! If you know any new grad or entry-level opportunities, I'd love to hear from you. Always happy to connect and chat!</p>
          <p>Lastly - Stay hungry, stay foolish</p>
        </div>
        <aside id="about-preview" className="aircraft-preview" aria-hidden={!showingPreview} inert={!showingPreview}
          aria-label={previewKind === 'team' ? 'Apple team photo gallery' : 'Favorite aircraft gallery'}
          onKeyDown={event => {
            if (previewKind !== 'team') return;
            if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); }
          }}>
          <div className="aircraft-preview-header">
            <span>{previewKind === 'team' ? 'SUMMER AT APPLE' : 'MY FAVORITE AIRCRAFT'}</span>
            <div className="aircraft-gallery-nav" aria-label={previewKind === 'team' ? 'Team photo gallery controls' : 'Aircraft gallery controls'}>
              <button type="button" aria-label={previewKind === 'team' ? 'Previous team photo' : 'Previous aircraft'} onClick={() => previewKind === 'team' ? changePhoto(-1) : changeAircraft(-1)}>‹</button>
              <span aria-live="polite" aria-atomic="true">{previewKind === 'team' ? `${photoIndex + 1} / ${teamPhotos.length}` : `${aircraftIndex + 1} / ${aircraftModels.length}`}</span>
              <button type="button" aria-label={previewKind === 'team' ? 'Next team photo' : 'Next aircraft'} onClick={() => previewKind === 'team' ? changePhoto(1) : changeAircraft(1)}>›</button>
            </div>
            <button type="button" aria-label={previewKind === 'team' ? 'Close team photo preview' : 'Close aircraft preview'} onClick={closePreview}>×</button>
          </div>
          {previewKind === 'team' ? <div className="team-photo-gallery">
            <figure>
              <img className="team-photo-main" src={teamPhotos[photoIndex].src} alt={teamPhotos[photoIndex].alt} width="1024" height="768" />
              <figcaption aria-live="polite"><strong>{teamPhotos[photoIndex].caption}</strong><span>Streaming Media Ecosystem Tech</span></figcaption>
            </figure>
            <div className="team-photo-thumbnails" aria-label="Choose a team photo">
              {teamPhotos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Show team photo ${index + 1}: ${photo.caption}`} aria-pressed={photoIndex === index} onClick={() => setPhotoIndex(index)}><img src={photo.src} alt="" loading="lazy" width="1024" height="768" /></button>)}
            </div>
          </div> : <figure>
            {renderAircraft && <AircraftViewer key={aircraft.id} aircraft={aircraft} />}
            <figcaption>
              <strong>{aircraft.name}</strong>
              <span>{aircraft.airline}</span>
              <small>3D model: <a href={aircraft.url} target="_blank" rel="noreferrer">{aircraft.credit}</a> {aircraft.licenseUrl && <>· <a href={aircraft.licenseUrl} target="_blank" rel="noreferrer">{aircraft.licenseLabel}</a></>}</small>
            </figcaption>
          </figure>}
        </aside>
      </div>
      <div className="wish-altar-slot" />
    </div>
  );
};

export default AboutMe;

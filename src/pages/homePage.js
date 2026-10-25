import { useState } from 'react';
import ScrollWave from '../components/ScrollWave';
import NameWordmark from '../components/NameWordmark';
import { useDisplayName } from '../components/DisplayName';
function HomePage() {
  const { fullName } = useDisplayName();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        }
    };
    return (
      <>
        <div className="hero-screen bg-cover bg-center flex flex-col items-top">
          <header className="hero-header">
            <nav id="portfolio-navigation" className={`hero-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
              <div className="hero-nav-group hero-nav-left">
                {[
                  ['about', 'About'],
                  ['timeline', 'Education & Experiences'],
                  ['tech-stack', 'Tech Stack'],
                ].map(([id, label], index) => <button key={id} type="button" className="hero-nav-link" onClick={() => { setMenuOpen(false); scrollToSection(id); }}><span className="hero-nav-label">{label}</span><span aria-hidden="true" className={`hero-nav-fill${index % 2 ? ' from-top' : ''}`} /></button>)}
              </div>
              <div className="hero-nav-group hero-nav-right">
                {[
                  ['projects', 'Projects'],
                  ['boarding-passes', 'Travelling'],
                  ['contact', 'Contact'],
                ].map(([id, label], index) => <button key={id} type="button" className="hero-nav-link" onClick={() => { setMenuOpen(false); scrollToSection(id); }}><span className="hero-nav-label">{label}</span><span aria-hidden="true" className={`hero-nav-fill${index % 2 ? ' from-top' : ''}`} /></button>)}
              </div>
            </nav>
            <NameWordmark />
            <button type="button" className="hero-menu-toggle" aria-controls="portfolio-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
          </header>
          <div className="hero-intro flex flex-col items-center justify-center">
            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-dm-sans text-black">
              Hi there, I am
            </h1>
            <span className="intro-rotator">
              <ul className="intro-rotator-list text-center font-archivo text-black">
                <li><span className="intro-portrait"><img src="/photos/intro-portrait.png" alt={`${fullName} in the mountains`} width="2048" height="1536" /></span></li>
                <li>{fullName}</li>
                <li>an alumni at University of South Florida</li>
                <li>a software engineer</li>
                <li>a backend engineer</li>
                <li aria-hidden="true"><span className="intro-portrait"><img src="/photos/intro-portrait.png" alt="" width="2048" height="1536" /></span></li>
              </ul>
            </span>
          </div>
        </div>
        <ScrollWave />
      </>
    );
  }

export default HomePage

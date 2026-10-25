import './App.css';
import HomePage from './pages/homePage.js';
import AboutMe from './pages/aboutMe.js';
import Timeline from './components/Timeline';
import TechStack from './components/TechStack';
import BoardingPasses from './components/BoardingPasses';
import MyProjects from './pages/myProjects.js';
import ContactMe from './pages/contactMe.js';
import UpWave from './img/wave-haikei-3.svg';
import usePortfolioMotion from './components/usePortfolioMotion';
import './redesign.css';

function App() {
  usePortfolioMotion();
  return (
    <>
      <HomePage />

      <main className="portfolio-body bg-darkBlue">
        <div id="about">
          <AboutMe />
        </div>
        <Timeline />
        <TechStack />
        <div id="projects">
          <MyProjects />
        </div>
        <BoardingPasses />
      </main>
      <div className="portfolio-contact">
        <img src={UpWave} alt="" aria-hidden="true" className="section-wave" />
        <ContactMe />
      </div>
      <footer className="portfolio-footer">
        <span>Cuong Luong</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}

export default App;

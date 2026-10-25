import ScrollWave from '../components/ScrollWave';
function homePage() {
  const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        }
    };
    return (
      <>
        <div className="hero-screen bg-cover bg-center flex flex-col items-top">
          <nav className="hero-nav flex flex-row items-center justify-center mt-8" aria-label="Main navigation">
            {[
              ['about', 'About'],
              ['timeline', 'Education & Experiences'],
              ['tech-stack', 'Tech Stack'],
              ['projects', 'Projects'],
              ['boarding-passes', 'Travelling'],
              ['contact', 'Contact'],
            ].map(([id, label], index) => (
              <button key={id} type="button" className="relative overflow-hidden group py-1 text-base sm:text-lg md:text-xl font-dm-sans transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300" onClick={() => scrollToSection(id)}>
                <span className="relative z-10 text-black group-hover:text-white duration-300">{label}</span>
                <span aria-hidden="true" className={`absolute inset-0 bg-darkBlue transform ${index % 2 ? '-translate-y-full' : 'translate-y-full'} group-hover:translate-y-0 transition-transform duration-300 ease-in-out`}></span>
              </button>
            ))}
          </nav>
          <div className="hero-intro flex flex-col items-center justify-center">
            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-dm-sans text-black">
              Hi there, I am
            </h1>
            <span className="intro-rotator">
              <ul className="intro-rotator-list text-center font-archivo text-black">
                <li>Cuong Luong</li>
                <li>an alumni at University of South Florida</li>
                <li>a software engineer</li>
                <li>a backend engineer</li>
                <li aria-hidden="true">Cuong Luong</li>
              </ul>
            </span>
          </div>
        </div>
        <ScrollWave />
      </>
    );
  }

export default homePage

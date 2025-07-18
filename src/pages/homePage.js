import BottomWave from '../img/background-1.svg'
function homePage() {
  const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    return (
      <>
        <div className="h-screen w-screen bg-cover bg-center flex flex-col items-top">
          <div className="flex flex-row items-center justify-center gap-[10rem] mt-8">
            <button className="relative overflow-hidden group px-11 py-1 text-xl font-dm-sans transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300" onClick={() => scrollToSection('about')}>
              <span className="relative z-10 text-black group-hover:text-white duration-300">
                <span className="block w-full h-full">About</span>
              </span>
              <span className="absolute inset-0 bg-darkBlue transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
            </button>
            <button className="relative overflow-hidden group px-11 py-1 text-xl font-dm-sans transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300" onClick={() => scrollToSection('projects')}>
              <span className="relative z-10 text-black group-hover:text-white duration-300">
                <span className="block w-full h-full">Projects</span>
              </span>
              <span className="absolute inset-0 bg-darkBlue transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
            </button>
            <button className="relative overflow-hidden group px-11 py-1 text-xl font-dm-sans transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
              <span className="relative z-10 text-black group-hover:text-white duration-300">
                <a href="https://drive.google.com/file/d/1GTdpH7w1NIimn6nN4JMZoOXB3Q_sOBJ6/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="block w-full h-full">Resumes</a>
              </span>
              <span className="absolute inset-0 bg-darkBlue transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
            </button>
            <button className="relative overflow-hidden group px-11 py-1 text-xl font-dm-sans transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300" onClick={() => scrollToSection('contact')}>
              <span className="relative z-10 text-black group-hover:text-white duration-300">
                <span className="block w-full h-full">Contact</span>
              </span>
              <span className="absolute inset-0 bg-darkBlue transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-dm-sans text-black">
              Hi there, I am
            </h1>
            <span className="inline-flex flex-col h-[calc(theme(fontSize.6xl)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.6xl)*theme(lineHeight.tight))] overflow-hidden mt-4">
              <ul className="block animate-scroll-text text-center leading-tight [&_li]:block text-6xl font-archivo text-black">
                <li>Cuong Luong</li>
                <li>a senior at University of South Florida</li>
                <li>a software engineer</li>
                <li>a full-stack developer</li>
                <li aria-hidden="true">a front-end developer</li>
              </ul>
            </span>
          </div>
        </div>
        <img src={BottomWave} alt="Bottom Wave" className="relative bottom-0 left-0 w-full h-full" />
      </>
    );
  }

export default homePage
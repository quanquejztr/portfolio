import './App.css';
import HomePage from './pages/homePage.js';
import AboutMe from './pages/aboutMe.js';
import Timeline from './components/Timeline';
import TechStack from './components/TechStack';
import BoardingPasses from './components/BoardingPasses';
import MyProjects from './pages/myProjects.js';
import ContactMe from './pages/contactMe.js';
import UpWave from './img/wave-haikei-3.svg';

function App() {
  return (
    <>
      <HomePage />

      <div className="bg-darkBlue">
        <div id="about">
          <AboutMe />
        </div>
        <Timeline />
        <TechStack />
        <div id="projects">
          <MyProjects />
        </div>
        <BoardingPasses />
      </div>

      <div className="contact-section">
        <img
          src={UpWave}
          alt="" aria-hidden="true"
          className="section-wave"
        />

        <div id="contact" className="contact-form-column">
          <ContactMe />
        </div>

        <div className="contact-details">
          <div>
            <div className="border border-[1px] border-[#111] border-opacity-50 w-full"></div>
            <div className="font-roboto">MY SOCIALS</div>
            <div className="flex flex-col leading-[3.5rem] md:leading-[2.5rem] lg:leading-[3.5rem] tracking-tighter">
              <a href="https://www.linkedin.com/in/stephenluong04/" target="_blank" rel="noopener noreferrer"
                className="flex items-center rounded relative overflow-hidden transition-all duration-500 
                  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-transparent 
                  before:transition-all before:duration-500 hover:text-white hover:before:left-0 
                  hover:before:w-full hover:before:bg-black hover:transform hover:skew-x-[15deg]"
              >
                <span className="relative z-10 text-[1.5rem] md:text-[2.5rem] lg:text-[2.5rem] tracking-tighter font-roboto">
                  LINKEDIN
                </span>
              </a>
              <a
                href="https://www.instagram.com/ltcunnn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded relative overflow-hidden transition-all duration-500 
                  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-transparent 
                  before:transition-all before:duration-500 hover:text-white hover:before:left-0 
                  hover:before:w-full hover:before:bg-black hover:transform hover:skew-x-[15deg]"
              >
                <span className="relative z-10 text-[1.5rem] md:text-[2.5rem] lg:text-[2.5rem] tracking-tighter">
                  INSTAGRAM
                </span>
              </a>
              <a
                href="https://www.facebook.com/ltcunnn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded relative overflow-hidden transition-all duration-500 
                  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-transparent 
                  before:transition-all before:duration-500 hover:text-white hover:before:left-0 
                  hover:before:w-full hover:before:bg-black hover:transform hover:skew-x-[15deg]"
              >
                <span className="relative z-10 text-[1.5rem] md:text-[2.5rem] lg:text-[2.5rem] tracking-tighter">
                  FACEBOOK
                </span>
              </a>

            </div>
          </div>
          <div>
            <div className="border border-[1px] border-[#111] border-opacity-50 w-full mt-5"></div>
            <div className="font-roboto">MY CONTACT INFO</div>
            <div className="flex flex-col leading-[3.5rem] md:leading-[2.5rem] lg:leading-[3.5rem] tracking-tighter">
              <a
                href="tel:+18135530268"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded relative overflow-hidden transition-all duration-500 
                  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-transparent 
                  before:transition-all before:duration-500 hover:text-white hover:before:left-0 
                  hover:before:w-full hover:before:bg-black hover:transform hover:skew-x-[15deg]"
              >
                <span className="relative z-10 text-[1.5rem] md:text-[1.5rem] lg:text-[2.5rem] tracking-tighter font-roboto">
                  (+1) 813-553-0268
                </span>
              </a>
              <a
                href="mailto:stephenluong24@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded relative overflow-hidden transition-all duration-500 
                  before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-transparent 
                  before:transition-all before:duration-500 hover:text-white hover:before:left-0 
                  hover:before:w-full hover:before:bg-black hover:transform hover:skew-x-[15deg]"
              >
                <span className="relative z-10 text-[1.5rem] md:text-[1.5rem] lg:text-[2.5rem] tracking-tighter">
                  stephenluong24@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <footer className=" text-black font-roboto py-4 text-center">
        <p>Copyright &copy; {new Date().getFullYear()} Cuong Luong. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;

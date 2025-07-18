import './App.css';
import HomePage from './pages/homePage.js';
import AboutMe from './pages/aboutMe.js';
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
        <div id="projects">
          <MyProjects />
        </div>
      </div>

      <div className="relative w-full h-[90vh] overflow-hidden">
        <img
          src={UpWave}
          alt="Wave Background"
          className="w-full h-auto block"
        />

        <div id="contact" className="absolute top-[10%] h-96 left-1/3 -translate-x-1/2 w-full md:w-3/5 p-4">
          <ContactMe />
        </div>

        <div className="ml-[2rem] sm:ml-[2rem] flex flex-col items-start w-[80vw] left-2/3 md:w-[25vw] md:absolute md:top-[20%] xl:top-[30%] md:right-[-40%] z-50 mt-[4rem] md:mt-[0rem] mb-[2rem]">
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
              <a target="_blank" rel="noopener noreferrer"
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

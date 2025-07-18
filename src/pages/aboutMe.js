import MeImage from '../img/me.png';

const AboutMe = () => {
  return (
    <>
    <div className="h-auto w-auto flex flex-col items-center">
      <span className="text-white font-dm-sans text-xl hover:bg-white hover:text-black"> &#40;A little bit&#41;
        <span className="text-white hover:text-black text-6xl font-archivo translate-x-full transition-colors duration-300">
          &#32; ABOUT ME 
        </span>
      </span>
      <div className="flex flex-row m-8 w-3/5 justify-between items-center">
        <div className="w-3/5 inline grid grid-rows-2 gap-0 mr-7">
          <span className="text-white text-xl font-dm-sans">Hi there, I am Stephen &#40;or Cuong if you're Viet&#41;, a rising senior in CompSci at USF.</span>
          <span className="text-white text-xl font-dm-sans">At the moment, I am an intern at FPT Software x NRC Health, focusing on <span className="hover:bg-white/40 transition-all duration-200 -translate-x-full">Software and AI development</span>.</span>
          <span className="text-white text-xl font-dm-sans mt-4">After school, you might catch me at USF Catering, sipping on Boba tea, or trying to solve Leetcode. If not, I&#39;m probably engrossed in Flight Sim at home.</span>
        </div>
        <div className="w-2/5 flex justify-between items-center ml-10">
          <img src={MeImage} alt="Me in my recent trip" width="300" className="rounded-lg transition-transform duration-300 ease-in-out hover:scale-150" />
        </div>
      </div>
    </div>
    </>
  )
}

export default AboutMe;
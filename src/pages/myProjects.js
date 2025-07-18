import nextleg from '../img/nextleg.png';
import jobtracker from '../img/jobtracker.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode'; // If you need free mode



const MyProjects = () => {
  return (
    <>
    <div className="h-auto w-full flex flex-col items-center mt-10">
      <span className="text-white font-dm-sans text-xl">
        <span className="text-white hover:text-black text-6xl hover:bg-white font-archivo translate-x-full transition-colors duration-300">
          PROJECTS
          <span className="text-white font-dm-sans hover:text-black text-xl">swipe to see more</span>
        </span>
      </span>
      
    </div>
      <div className="w-4/5 mt-5 p-4 mx-auto">
        {/* Swiper component for the carousel */}
        {/* Removed the manual Swiper classes from this div, as the <Swiper> component handles them */}
        <Swiper
          // Swiper configuration props
          slidesPerView={2} // Default to 1 slide per view on very small screens
          spaceBetween={20} // Space between slides
          freeMode={false} // Enables free mode for continuous scrolling
          // Responsive breakpoints for number of slides per view
          breakpoints={{
            // when window width is >= 640px (sm breakpoint)
            640: {
              slidesPerView: 1, // Still 1 on small mobile to ensure cards fit
            },
            // when window width is >= 768px (md breakpoint)
            768: {
              slidesPerView: 2, // Show 2 slides per view on medium screens and up
            },
          }}
          className="mySwiper" // Custom class for potential additional styling
        >

          {/* Product Card 1 - Wrapped in SwiperSlide */}
          <SwiperSlide>
            <div className="relative flex flex-col text-white bg-transparent shadow-xl bg-clip-border rounded-xl w-7xl mx-auto h-96">
              <div className="relative mx-4 mt-4 overflow-hidden text-white bg-white bg-clip-border rounded-xl h-40">
                <img
                  src={nextleg} // Using the imported image
                  alt="Nextleg Project Image"
                  className="object-cover w-full h-full rounded-lg" // Added object-cover for image scaling
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="block font-sans text-base antialiased text-2xl font-bold leading-relaxed text-white">
                    NextLeg
                  </p>
                  <p className="block font-sans text-base antialiased font-medium leading-relaxed text-white">
                    <span><a href="https://www.github.com/quanquejztr">Github</a></span>
                  </p>
                </div>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-white opacity-75">
                  Developed a full-stack website to assist travelers during hurricane season when flights are disrupted and 
                  airports close. The project aims to help minimize stranded time at the airport, avoiding long waits to deal 
                  with airline customer service.                
                </p>
              </div>
              
            </div>
          </SwiperSlide>

          {/* Product Card 2 - Wrapped in SwiperSlide */}
          <SwiperSlide>
            <div className="relative flex flex-col text-white bg-transparent shadow-xl bg-clip-border rounded-xl w-7xl mx-auto h-96">
              <div className="relative mx-4 mt-4 overflow-hidden text-white bg-white bg-clip-border rounded-xl h-40">
                <img
                  src={jobtracker} // Using the imported image
                  alt="Job Tracker Project Image"
                  className="object-cover w-full h-full rounded-lg" // Added object-cover for image scaling
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="block font-sans text-base antialiased text-2xl font-bold leading-relaxed text-blue-gray-900">
                    JobTracker
                  </p>
                  <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                    <span><a href="https://www.github.com/quanquejztr">Github</a></span>
                  </p>
                </div>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-white opacity-75">
                  Tired of manually tracking your job applications from Gmail? That’s why I developed this ultimate job applications tracker. This project will only 
                  run on your local machine, meaning your Gmail data will be stored on the local machine database.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* Product Card 3 - Wrapped in SwiperSlide */}
          <SwiperSlide>
            <div className="relative flex flex-col text-white bg-transparent shadow-xl bg-clip-border rounded-xl w-7xl mx-auto h-96">
              <div className="relative mx-4 mt-4 overflow-hidden text-white bg-white bg-clip-border rounded-xl h-40">
                <img
                  src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp=w=927&q=80"
                  alt="Smart Watch Image"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="block font-sans text-base antialiased text-2xl font-bold leading-relaxed text-blue-gray-900">
                    DevShield
                  </p>
                  <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                    <span><a href="https://www.github.com/quanquejztr">Github</a></span>
                  </p>
                </div>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-white opacity-75">
                  Secure CI/CD pipelines integrate security early, unlike traditional late checks. This approach prevents vulnerabilities from reaching production and safeguards sensitive data, reducing expenses, delays, and breach risks.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* Product Card 4 - Wrapped in SwiperSlide */}
          <SwiperSlide>
            <div className="relative flex flex-col text-white bg-transparent shadow-xl bg-clip-border rounded-xl w-7xl mx-auto h-96">
              <div className="relative mx-4 mt-4 overflow-hidden text-white bg-white bg-clip-border rounded-xl h-40">
                <img
                  src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp=w=927&q=80"
                  alt="Smart Watch Image"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="block font-sans text-base antialiased text-2xl font-bold leading-relaxed text-blue-gray-900">
                    Diminished JavaCompiler
                  </p>
                  <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                    <span><a href="https://www.github.com/quanquejztr">Github</a></span>
                  </p>
                </div>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-white opacity-75">
                  Built from ground up, a complete disminished Java compiler.
                </p>
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </div>
    </>
  );
};

export default MyProjects;

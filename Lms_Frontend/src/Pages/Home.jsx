import Hero from "../Components/Hero";
import Feature from "../Components/Feature";
import CategoryShowcase from "../Components/CategoryShowcase";
import Course from "../Components/Courses";
import Counter from "../Components/Counter";
import Testimonial from "../Components/Testimonials";
import BecomeInstructor from "../Components/BecomeInstructor";
import FAQ from "../Components/FAQ";
import CTABanner from "../Components/CTABanner";
import Newsletter from "../Components/Newsletter";
import Contact from "../Components/Contact";
import About from "../Components/About";
const Home = () => {
    return (
 <>
      <Hero />
      <Feature />
      <CategoryShowcase />
      <Course />
      <Counter />
      <About />
      <Testimonial />
      <BecomeInstructor />
      <FAQ />
      <CTABanner />
      <Newsletter />
      <Contact />
    </>
    );
}



export default Home;
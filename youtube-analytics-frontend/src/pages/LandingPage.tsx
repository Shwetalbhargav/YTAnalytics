import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}

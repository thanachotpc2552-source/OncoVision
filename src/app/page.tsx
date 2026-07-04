import Navbar            from '@/components/Navbar';
import HeroSection       from '@/components/HeroSection';
import MethodologySection from '@/components/MethodologySection';
import DashboardSection  from '@/components/DashboardSection';
import AboutSection      from '@/components/AboutSection';
import Footer            from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <HeroSection />
        <MethodologySection />
        <DashboardSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}

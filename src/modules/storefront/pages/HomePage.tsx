import Footer from '@/components/common/Footer';
import BenefitStack from '../components/Benefitstack';
import ClosingSection from '../components/ClosingSection';
import Hero from '../components/Hero';
import SectionProducts from '../components/SectionProducts';
import FloatingNav from '../components/FloatingNav';

export default function HomePage() {
  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #f7f4ef; }
      `}</style>
      <div className="min-h-screen overflow-x-hidden bg-[#f7f4ef] text-[#17120f]">
        <FloatingNav />
        <main>
          <Hero />
          <SectionProducts />
          {/* <FeatureShowcase /> */}
          <BenefitStack></BenefitStack>
          <ClosingSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
//

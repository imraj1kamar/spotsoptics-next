import Hero from "@/components/sections/Hero";
import ProductsSection from "@/components/sections/ProductsSection";
import ApplicationSection from "@/components/sections/ApplicationsSection";
import StatsSection from "@/components/common/StatsSection";
import WhySpotOpticsSection from "@/components/sections/WhySpotOpticsSection";
import SensoftSection from "@/components/sections/SensoftSection";
import ResourcesSection from "@/components/sections/ResourcesSection";


export default function Home() {
  return (
    <>
    <Hero />
    <div className="container">
      
      <ProductsSection />
      <ApplicationSection />
      <StatsSection />
      <WhySpotOpticsSection />
    <SensoftSection />
      <ResourcesSection />
    </div>
    </>
  );
}
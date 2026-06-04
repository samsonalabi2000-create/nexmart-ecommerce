import HeroSection from "@/components/home/HeroSection";
import {
  FeaturedCategories,
  BestSellers,
  FlashSales,
  NewArrivals,
  Testimonials,
  MarqueeBrands,
  NewsletterSection,
} from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeBrands />
      <FeaturedCategories />
      <BestSellers />
      <FlashSales />
      <NewArrivals />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}

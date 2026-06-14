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
import RecentlyViewed from "@/components/shared/RecentlyViewed";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeBrands />
      <FeaturedCategories />
      <BestSellers />
      <FlashSales />
      <NewArrivals />
      <RecentlyViewed />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
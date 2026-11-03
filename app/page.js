import HeroBanner from "@/app/components/HeroBanner";
import FeaturesSection from "@/app/components/FeaturesSection";
import RecentEventsSection from "@/app/components/RecentEventsSection";
import GallerySection from "@/app/components/GallerySection";
import NewsletterSection from "@/app/components/NewsletterSection";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturesSection />
      <RecentEventsSection />
      <GallerySection />
      <NewsletterSection />
    </div>
  );
}

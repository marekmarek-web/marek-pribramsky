import { HomePageClient } from "@/components/home/HomePageClient";
import { HomeRestSections } from "@/components/home/HomeRestSections";
import { homeMetadata } from "@/lib/seo/page-meta";

export const metadata = homeMetadata();

export default function HomePage() {
  return (
    <main className="main-with-header" id="home-main">
      <HomePageClient />
      <HomeRestSections />
    </main>
  );
}

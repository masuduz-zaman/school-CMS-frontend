
import AboutSection from "@/components/home/about";
import ContactSection from "@/components/home/contact";
import GallerySection from "@/components/home/gellary";
import HeadTeacherSection from "@/components/home/head-teacher";
import HeroSection from "@/components/home/hero";
import NoticeSection from "@/components/home/notice";
import StatsSection from "@/components/home/stats";
import SiteFooter from "@/components/layout/footer";
import SiteHeader from "@/components/layout/header";
import { getNotices } from "@/lib/api";
import {
  SchoolStats,
  HeadTeacherMessage,
} from "@/types/content";

import { GalleryAlbum } from "@/types/gallery";

export default async function HomePage() {
  const notices = await getNotices();


  //Use Api endpoints to fetch data for the following sections
  const galleryImages: GalleryAlbum[] = [];
  const schoolStats: SchoolStats | null = null;
  const headTeacherMessage: HeadTeacherMessage | null = null;

  return (
    <main id="home">
      <SiteHeader />

      <HeroSection />

      <AboutSection />

      <StatsSection stats={schoolStats} />

      <NoticeSection notices={notices} />

      <GallerySection />

      <HeadTeacherSection />

      <ContactSection />

      <SiteFooter />
    </main>
  );
}
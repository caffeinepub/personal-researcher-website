import { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ResearchInterestsSection from '@/components/ResearchInterestsSection';
import PublicationsSection from '@/components/PublicationsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useProfile, useResearchInterests, usePublications, useContactInfo } from '@/hooks/useQueries';

export default function HomePage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: interests, isLoading: interestsLoading } = useResearchInterests();
  const { data: publications, isLoading: publicationsLoading } = usePublications();
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection profile={profile} isLoading={profileLoading} />
        <ResearchInterestsSection interests={interests} isLoading={interestsLoading} />
        <PublicationsSection publications={publications} isLoading={publicationsLoading} />
        <ContactSection contactInfo={contactInfo} isLoading={contactLoading} />
      </main>
      <Footer />
    </div>
  );
}

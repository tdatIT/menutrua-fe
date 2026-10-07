import {VStack} from '@astryxdesign/core/Stack';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {CategoryStrip} from './components/CategoryStrip';
import {FeaturedDishes} from './components/FeaturedDishes';
import {HeroSection} from './components/HeroSection';
import {TeamPollSection} from './components/TeamPollSection';

export default function LandingPage() {
  useDocumentTitle();
  return (
    <VStack gap={0}>
      <HeroSection />
      <CategoryStrip />
      <FeaturedDishes />
      <TeamPollSection />
    </VStack>
  );
}

import {Avatar} from '@astryxdesign/core/Avatar';
import {AvatarGroup} from '@astryxdesign/core/AvatarGroup';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Award, Sparkles} from 'lucide-react';
import {paths} from '@/app/router/paths';
import {PageSection} from '@/components/layout/PageSection';
import {useDailySuggestion} from '../api';
import {LiveClock} from './LiveClock';

const NEARBY_SEARCH_URL =
  'https://www.google.com/maps/search/qu%C3%A1n+%C4%83n+tr%C6%B0a+g%E1%BA%A7n+%C4%91%C3%A2y';

const FRIENDS = ['Linh', 'Minh', 'Hà'];

function SuggestionWidget() {
  const suggestion = useDailySuggestion();

  return (
    <VStack className="soft-panel" padding={6}>
      <Card padding={6} elevation="low">
        <VStack gap={5}>
          <VStack align="center">
            <LiveClock />
          </VStack>
          <Text weight="semibold">Hôm nay bro đã thử ăn món này chưa</Text>
          <Card variant="orange" padding={3}>
            <HStack gap={3} align="center">
              <Icon icon={Award} color="accent" />
              <VStack gap={0.5}>
                <Text type="supporting">Gợi ý ngẫu nhiên:</Text>
                {suggestion.data ? (
                  <Text weight="bold" color="accent">
                    {suggestion.data.dishName}
                  </Text>
                ) : (
                  <Skeleton width={160} height={18} />
                )}
              </VStack>
            </HStack>
          </Card>
        </VStack>
      </Card>
    </VStack>
  );
}

export function HeroSection() {
  return (
    <PageSection paddingBlock={10} label="Giới thiệu">
      <Grid columns={{minWidth: 340, max: 2}} gap={10} align="center">
        <VStack gap={6}>
          <Heading level={1} type="display-1" weight="bold" textWrap="balance">
            Trưa nay ăn gì đây bro
          </Heading>
          <Text type="large" color="secondary">
            Trưa rồi không biết phải ăn gì thì để mình chọn giúp cậu nhé
          </Text>
          <HStack gap={3} wrap="wrap">
            <Button
              label="Bắt đầu chọn món"
              variant="primary"
              size="lg"
              href={paths.app.pick}
              endContent={<Icon icon={Sparkles} />}
            />
            <Button
              label="Tìm quán gần đây"
              size="lg"
              className="button-outline-accent"
              href={NEARBY_SEARCH_URL}
              target="_blank"
            />
          </HStack>
          <HStack gap={3} align="center">
            <AvatarGroup size="sm">
              {FRIENDS.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
            <Text type="supporting">
              Ai rồi cũng phải "bí ý tưởng" ăn gì trưa nay. Bro hãy để tôi chọn giúp nhé!
            </Text>
          </HStack>
        </VStack>
        <SuggestionWidget />
      </Grid>
    </PageSection>
  );
}

import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Card} from '@astryxdesign/core/Card';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Circle, Heart, Slash} from 'lucide-react';
import authHero from '@/assets/images/auth-hero.webp';
import {FoodImage} from '@/components/media/FoodImage';

/** Peach brand story shown beside (desktop) or below (mobile) the form. */
export function AuthStoryPanel() {
  return (
    <VStack className="soft-panel" padding={8} gap={6} height="100%">
      <HStack gap={1.5} align="center">
        <Icon icon={Slash} color="accent" size="sm" />
        <Text type="label" weight="bold" color="secondary">
          BỮA TRƯA, BỚT ĐẮN ĐO.
        </Text>
      </HStack>

      <VStack gap={3}>
        <Heading level={2} type="display-2" weight="bold">
          Hôm nay ăn gì?
          <br />
          Để MenuTrua lo.
        </Heading>
        <Text color="secondary">
          Khám phá món ngon, lưu lựa chọn yêu thích và cùng cả nhóm chốt bữa trưa.
        </Text>
      </VStack>

      <VStack gap={0} style={{position: 'relative'}}>
        <FoodImage
          src={authHero}
          alt="Đĩa cơm tấm sườn nướng"
          ratio={1.4}
          radius="container"
          isPriority
        />
        <Card
          padding={2}
          elevation="low"
          style={{
            position: 'absolute',
            insetInlineStart: 'var(--spacing-4)',
            insetBlockEnd: 'var(--spacing-4)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <HStack gap={1.5} align="center" paddingInline={1}>
            <Icon icon={Heart} color="accent" size="sm" />
            <Text type="label" weight="semibold">
              Gợi ý nhỏ, bữa trưa vui.
            </Text>
          </HStack>
        </Card>
      </VStack>

      <HStack gap={3} align="start">
        <Icon icon={Circle} color="secondary" size="sm" />
        <VStack gap={0.5}>
          <Text weight="semibold">Ăn ngon hơn, cùng nhau.</Text>
          <Text type="supporting">Gợi ý món ngon · Bình chọn cùng nhóm</Text>
        </VStack>
      </HStack>
    </VStack>
  );
}

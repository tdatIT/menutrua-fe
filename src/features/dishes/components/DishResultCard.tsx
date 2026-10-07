import {useState} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Center} from '@astryxdesign/core/Center';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Item} from '@astryxdesign/core/Item';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {MapPin, NotebookText, QrCode, Store, type LucideIcon} from 'lucide-react';
import {FoodImage} from '@/components/media/FoodImage';
import {Eyebrow} from '@/components/typography/Eyebrow';
import type {Dish} from '../types';

function DetailLine({icon, children}: {icon: LucideIcon; children: string}) {
  return (
    <HStack gap={2} align="start">
      <Icon icon={icon} color="secondary" size="sm" />
      <Text color="secondary">{children}</Text>
    </HStack>
  );
}

/** "Món ăn hôm nay của bro" — the winning dish with details and QR. */
export function DishResultCard({dish}: {dish: Dish}) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const qrUrl = dish.qrImageUrl ?? dish.menuImageUrl;

  return (
    <Card padding={6} elevation="med" className="accent-ring" width="100%" maxWidth={720}>
      <Grid columns={{minWidth: 220, max: 2}} gap={6} align="center">
        <FoodImage src={dish.imageUrl} alt={dish.name} radius="container" isPriority />
        <VStack gap={3}>
          <Eyebrow>Món ăn hôm nay của bro</Eyebrow>
          <Heading level={2}>{dish.name}</Heading>
          <VStack gap={1.5}>
            {dish.restaurant && <DetailLine icon={Store}>{`Quán: ${dish.restaurant}`}</DetailLine>}
            {dish.location && <DetailLine icon={MapPin}>{`Vị trí: ${dish.location}`}</DetailLine>}
            {dish.description && <DetailLine icon={NotebookText}>{dish.description}</DetailLine>}
          </VStack>
          <Divider />
          <Item
            density="compact"
            label="Quét mã QR chuyển khoản"
            description={qrUrl ? 'Xem mã QR nhận tiền nhóm' : 'Món này chưa có mã QR'}
            isDisabled={!qrUrl}
            onClick={qrUrl ? () => setIsQrOpen(true) : undefined}
            startContent={
              <Center className="brand-mark" width={36} height={36}>
                <Icon icon={QrCode} size="sm" />
              </Center>
            }
          />
        </VStack>
      </Grid>

      {qrUrl && (
        <Dialog isOpen={isQrOpen} onOpenChange={setIsQrOpen} width={420}>
          <DialogHeader title="Mã QR chuyển khoản" onOpenChange={setIsQrOpen} />
          <VStack padding={5}>
            <FoodImage src={qrUrl} alt={`Mã QR của ${dish.name}`} radius="container" />
          </VStack>
        </Dialog>
      )}
    </Card>
  );
}

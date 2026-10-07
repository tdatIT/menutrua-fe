import {Center} from '@astryxdesign/core/Center';
import {Layout, LayoutContent, LayoutPanel} from '@astryxdesign/core/Layout';
import {VStack} from '@astryxdesign/core/Stack';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {useIsCompact} from '@/hooks/useIsCompact';
import {DishBox} from '../components/DishBox';
import {DishPicker} from '../components/DishPicker';

/**
 * "Tự chọn món". Desktop: dish box in a 420px side panel, roulette fills the
 * rest. Phone: one scrolling column, roulette first.
 */
export default function PickDishPage() {
  useDocumentTitle('Tự chọn món');
  const isCompact = useIsCompact();

  if (isCompact) {
    return (
      <VStack gap={8} padding={4} paddingBlockEnd={10}>
        <DishPicker isCompact />
        <DishBox isCompact />
      </VStack>
    );
  }

  return (
    <Layout
      start={
        <LayoutPanel width={420} padding={6} hasDivider label="Hộp món ăn">
          <DishBox isCompact={false} />
        </LayoutPanel>
      }
      content={
        <LayoutContent padding={8} label="Chọn món ngẫu nhiên">
          <Center minHeight="100%">
            <DishPicker isCompact={false} />
          </Center>
        </LayoutContent>
      }
    />
  );
}

import {Button} from '@astryxdesign/core/Button';
import {Grid} from '@astryxdesign/core/Grid';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {ListItem} from '@astryxdesign/core/List';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Pencil, Trash2} from 'lucide-react';
import {FoodImage} from '@/components/media/FoodImage';

type MediaRowProps = {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  /** Mobile layout: labelled action buttons below the text. */
  isCompact?: boolean;
  isBusy?: boolean;
};

/**
 * Thumbnail + title + subtitle row with edit/delete actions. Used for the
 * personal dish box and the group member list. Render inside <MediaList>.
 */
export function MediaRow({
  title,
  subtitle,
  imageUrl,
  onEdit,
  onDelete,
  isCompact = false,
  isBusy = false,
}: MediaRowProps) {
  const thumbnail = <FoodImage src={imageUrl} alt={title} width={56} radius="element" />;

  if (isCompact) {
    return (
      <ListItem
        className="media-row"
        label={title}
        startContent={thumbnail}
        description={
          <VStack gap={3}>
            {subtitle && <Text type="supporting">{subtitle}</Text>}
            <Grid columns={2} gap={2}>
              {onEdit && (
                <Button
                  label="Sửa món"
                  variant="ghost"
                  width="100%"
                  icon={<Icon icon={Pencil} />}
                  onClick={onEdit}
                />
              )}
              {onDelete && (
                <Button
                  label="Xóa"
                  variant="destructive"
                  width="100%"
                  isLoading={isBusy}
                  icon={<Icon icon={Trash2} />}
                  onClick={onDelete}
                />
              )}
            </Grid>
          </VStack>
        }
      />
    );
  }

  return (
    <ListItem
      className="media-row"
      label={title}
      description={subtitle ?? undefined}
      startContent={thumbnail}
      endContent={
        <HStack gap={1.5}>
          {onEdit && (
            <IconButton
              label={`Sửa ${title}`}
              tooltip="Sửa món"
              size="sm"
              icon={<Icon icon={Pencil} />}
              onClick={onEdit}
            />
          )}
          {onDelete && (
            <IconButton
              label={`Xóa ${title}`}
              tooltip="Xóa"
              size="sm"
              variant="destructive"
              isLoading={isBusy}
              icon={<Icon icon={Trash2} />}
              onClick={onDelete}
            />
          )}
        </HStack>
      }
    />
  );
}

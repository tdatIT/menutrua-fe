import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {FacebookIcon, GoogleIcon} from '@/components/icons/BrandIcons';

/** OAuth entry points. Wired to a toast until the backend ships OAuth. */
export function SocialLoginButtons() {
  const toast = useToast();
  const comingSoon = (provider: string) =>
    toast({body: `Đăng nhập bằng ${provider} sắp ra mắt nhé!`, uniqueID: 'oauth-soon'});

  return (
    <VStack gap={4}>
      <Divider label={<Text type="supporting">hoặc tiếp tục với</Text>} />
      <Grid columns={2} gap={3}>
        <Button
          label="Google"
          size="lg"
          width="100%"
          icon={<Icon icon={GoogleIcon} />}
          onClick={() => comingSoon('Google')}
        />
        <Button
          label="Facebook"
          size="lg"
          width="100%"
          icon={<Icon icon={FacebookIcon} color="secondary" />}
          onClick={() => comingSoon('Facebook')}
        />
      </Grid>
    </VStack>
  );
}

import {HStack} from '@astryxdesign/core/Stack';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {env} from '@/config/env';
import {paths} from '@/app/router/paths';
import {LogoMark} from './LogoMark';

type BrandLogoProps = {
  /** Wrap in a link to the landing page. */
  isLinked?: boolean;
  tone?: 'default' | 'inverse';
};

export function BrandLogo({isLinked = true, tone = 'default'}: BrandLogoProps) {
  const content = (
    <HStack gap={2} align="center">
      <LogoMark />
      <Text type="large" weight="bold" color={tone === 'inverse' ? 'inherit' : 'primary'}>
        {env.appName}
      </Text>
    </HStack>
  );

  if (!isLinked) return content;
  return (
    <Link href={paths.home} color="inherit" label={`${env.appName} — trang chủ`}>
      {content}
    </Link>
  );
}

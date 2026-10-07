import type {ReactNode} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {ArrowLeft} from 'lucide-react';
import {paths} from '@/app/router/paths';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {AuthModeSwitch} from './AuthModeSwitch';
import {AuthStoryPanel} from './AuthStoryPanel';
import {SocialLoginButtons} from './SocialLoginButtons';

const CURRENT_YEAR = new Date().getFullYear();

type AuthLayoutProps = {
  mode: 'login' | 'register';
  title: string;
  subtitle: string;
  /** The form itself. */
  children: ReactNode;
  /** "Chưa có tài khoản? Đăng ký ngay" line. */
  footer: ReactNode;
};

/** Shared frame for login and register: header, story panel, form card. */
export function AuthLayout({mode, title, subtitle, children, footer}: AuthLayoutProps) {
  const isWide = useMediaQuery('(min-width: 960px)');

  const form = (
    <VStack gap={5} justify="center" width="100%" maxWidth={420} style={{marginInline: 'auto'}}>
      <VStack gap={2}>
        <Heading level={1}>{title}</Heading>
        <Text color="secondary">{subtitle}</Text>
      </VStack>
      <AuthModeSwitch mode={mode} />
      {children}
      <SocialLoginButtons />
      <Text justify="center" color="secondary" display="block">
        {footer}
      </Text>
    </VStack>
  );

  return (
    <VStack
      minHeight="100dvh"
      width="100%"
      maxWidth={1280}
      gap={6}
      padding={4}
      style={{marginInline: 'auto'}}
    >
      <HStack as="header" justify="between" align="center" paddingBlock={2}>
        <BrandLogo />
        <Link href={paths.home} color="secondary">
          <HStack gap={1.5} align="center">
            <Icon icon={ArrowLeft} size="sm" />
            Về trang chủ
          </HStack>
        </Link>
      </HStack>

      <VStack as="main" gap={4}>
        {isWide ? (
          <Card padding={4} elevation="low">
            <Grid columns={2} gap={10} align="center">
              <AuthStoryPanel />
              {form}
            </Grid>
          </Card>
        ) : (
          <>
            <Card padding={5} elevation="low">
              {form}
            </Card>
            <AuthStoryPanel />
          </>
        )}
      </VStack>

      <HStack as="footer" justify="between" align="center" wrap="wrap" gap={3} paddingBlock={4}>
        <Text type="supporting">© {CURRENT_YEAR} MenuTrua. Mỗi bữa trưa, một niềm vui.</Text>
        <HStack gap={5}>
          <Link href="#" color="secondary" size="sm">
            Chính sách bảo mật
          </Link>
          <Link href="mailto:tdat.it2k2@gmail.com" color="secondary" size="sm">
            Cần hỗ trợ?
          </Link>
        </HStack>
      </HStack>
    </VStack>
  );
}

import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import type {ComponentType, SVGProps} from 'react';
import {paths} from '@/app/router/paths';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {FacebookIcon, InstagramIcon, TwitterIcon} from '@/components/icons/BrandIcons';

const CURRENT_YEAR = new Date().getFullYear();

type FooterLink = {label: string; href: string};

const SERVICES: FooterLink[] = [
  {label: 'Chọn món nhanh', href: paths.app.pick},
  {label: 'Bình chọn nhóm', href: paths.app.polls},
  {label: 'Quán ngon đề xuất', href: paths.app.bot},
];

const CONTACT: FooterLink[] = [
  {label: 'tdat.it2k2@gmail.com', href: 'mailto:tdat.it2k2@gmail.com'},
  {label: 'Việt Nam', href: '#'},
];

const SOCIALS: Array<{label: string; href: string; icon: ComponentType<SVGProps<SVGSVGElement>>}> =
  [
    {label: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon},
    {label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon},
    {label: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon},
  ];

function LinkColumn({title, links}: {title: string; links: FooterLink[]}) {
  return (
    <VStack gap={2}>
      <Text weight="semibold" color="inherit">
        {title}
      </Text>
      {links.map((link) => (
        <Link key={link.label} href={link.href} color="inherit" size="sm">
          {link.label}
        </Link>
      ))}
    </VStack>
  );
}

export function SiteFooter() {
  return (
    <VStack as="footer" className="site-footer" paddingBlock={10} paddingInline={4}>
      <VStack gap={8} width="100%" maxWidth={1280} style={{marginInline: 'auto'}}>
        <HStack justify="between" align="start" wrap="wrap" gap={8}>
          <VStack gap={3}>
            <BrandLogo tone="inverse" />
            <Text size="sm" color="inherit">
              Dịch vụ hỗ trợ đề xuất bữa trưa cho mọi người.
            </Text>
          </VStack>
          <HStack gap={10} wrap="wrap">
            <LinkColumn title="Dịch vụ" links={SERVICES} />
            <LinkColumn title="Liên hệ" links={CONTACT} />
          </HStack>
        </HStack>
        <Divider />
        <HStack justify="between" align="center" wrap="wrap" gap={3}>
          <Text size="sm" color="inherit">
            © {CURRENT_YEAR} MenuTrua
          </Text>
          <HStack gap={4}>
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                label={social.label}
                color="inherit"
              >
                <Icon icon={social.icon} size="sm" />
              </Link>
            ))}
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
}

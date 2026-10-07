import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {TopNav, TopNavItem} from '@astryxdesign/core/TopNav';
import {Bot, UsersRound, WandSparkles, type LucideIcon} from 'lucide-react';
import {useLocation} from 'react-router';
import {paths} from '@/app/router/paths';
import {BrandLogo} from '@/components/brand/BrandLogo';
import {useIsAuthenticated, useLogout} from '@/features/auth/hooks';

type NavEntry = {label: string; href: string; icon: LucideIcon};

const NAV_ITEMS: NavEntry[] = [
  {label: 'Tự chọn món', href: paths.app.pick, icon: WandSparkles},
  {label: 'Tạo bình chọn nhóm', href: paths.app.polls, icon: UsersRound},
  {label: 'Thêm BOT gợi ý', href: paths.app.bot, icon: Bot},
];

function HeaderAction() {
  const isAuthenticated = useIsAuthenticated();
  const logout = useLogout();

  if (isAuthenticated) {
    return (
      <Button
        label="Đăng xuất"
        className="button-outline-accent"
        isLoading={logout.isPending}
        onClick={() => logout.mutate()}
      />
    );
  }
  return <Button label="Thử ngay thôi" className="button-outline-accent" href={paths.login} />;
}

/** Top navigation shared by the landing page and the app. */
export function SiteHeader() {
  const {pathname} = useLocation();

  return (
    <TopNav
      label="Điều hướng chính"
      heading={<BrandLogo />}
      centerContent={NAV_ITEMS.map((item) => (
        <TopNavItem
          key={item.href}
          label={item.label}
          href={item.href}
          icon={<Icon icon={item.icon} size="sm" />}
          isSelected={pathname.startsWith(item.href)}
        />
      ))}
      endContent={<HeaderAction />}
    />
  );
}

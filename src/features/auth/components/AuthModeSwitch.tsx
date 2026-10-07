import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {useNavigate, useSearchParams} from 'react-router';
import {paths} from '@/app/router/paths';

/** "Đăng nhập | Đăng ký" toggle; keeps ?redirect= when switching. */
export function AuthModeSwitch({mode}: {mode: 'login' | 'register'}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <SegmentedControl
      label="Chọn đăng nhập hoặc đăng ký"
      value={mode}
      layout="fill"
      size="lg"
      onChange={(next) => {
        const target = next === 'login' ? paths.login : paths.register;
        const query = params.toString();
        navigate(query ? `${target}?${query}` : target, {replace: true});
      }}
    >
      <SegmentedControlItem value="login" label="Đăng nhập" />
      <SegmentedControlItem value="register" label="Đăng ký" />
    </SegmentedControl>
  );
}

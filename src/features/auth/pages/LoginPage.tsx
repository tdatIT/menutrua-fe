import {Link} from '@astryxdesign/core/Link';
import {useLocation} from 'react-router';
import {paths} from '@/app/router/paths';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {AuthLayout} from '../components/AuthLayout';
import {LoginForm} from '../components/LoginForm';

export default function LoginPage() {
  useDocumentTitle('Đăng nhập');
  const {search} = useLocation();

  return (
    <AuthLayout
      mode="login"
      title="Chào bạn trở lại!"
      subtitle="Đăng nhập để tiếp tục tìm món ngon cho bữa trưa."
      footer={
        <>
          Chưa có tài khoản? <Link href={paths.register + search}>Đăng ký ngay</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}

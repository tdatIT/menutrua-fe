import {Link} from '@astryxdesign/core/Link';
import {useLocation} from 'react-router';
import {paths} from '@/app/router/paths';
import {useDocumentTitle} from '@/hooks/useDocumentTitle';
import {AuthLayout} from '../components/AuthLayout';
import {RegisterForm} from '../components/RegisterForm';

export default function RegisterPage() {
  useDocumentTitle('Đăng ký');
  const {search} = useLocation();

  return (
    <AuthLayout
      mode="register"
      title="Chào bạn mới!"
      subtitle="Tạo tài khoản để lưu món yêu thích và ăn cùng nhóm."
      footer={
        <>
          Đã có tài khoản? <Link href={paths.login + search}>Đăng nhập</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}

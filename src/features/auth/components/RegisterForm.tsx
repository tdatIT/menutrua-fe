import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {zodResolver} from '@hookform/resolvers/zod';
import {ArrowRight, Lock, User} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {FormTextInput} from '@/components/form/FormTextInput';
import {applyServerErrors} from '@/components/form/server-errors';
import {useRegister} from '../hooks';
import {registerSchema, type RegisterValues} from '../schemas';

export function RegisterForm() {
  const register = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const {control, handleSubmit, setError} = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {username: '', password: '', confirmPassword: ''},
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    register.mutate(values, {
      onError: (error) =>
        setFormError(applyServerErrors(error, setError, ['username', 'password'])),
    });
  });

  return (
    <VStack as="form" gap={4} onSubmit={onSubmit}>
      {formError && <Banner status="error" title={formError} collapsible={false} />}
      <FormTextInput
        control={control}
        name="username"
        label="Tên đăng nhập"
        placeholder="Chọn tên đăng nhập của bạn"
        startIcon={User}
        size="lg"
        autoComplete="username"
        hasAutoFocus
      />
      <FormTextInput
        control={control}
        name="password"
        type="password"
        label="Mật khẩu"
        placeholder="Tạo mật khẩu"
        description="Sử dụng ít nhất 8 ký tự để bảo vệ tài khoản."
        startIcon={Lock}
        size="lg"
        autoComplete="new-password"
      />
      <FormTextInput
        control={control}
        name="confirmPassword"
        type="password"
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        startIcon={Lock}
        size="lg"
        autoComplete="new-password"
      />
      <Text type="supporting">
        Bằng việc đăng ký, bạn đồng ý với <Link href="#">Điều khoản sử dụng</Link> và{' '}
        <Link href="#">Chính sách bảo mật</Link> của MenuTrua.
      </Text>
      <Button
        type="submit"
        label="Tạo tài khoản"
        variant="primary"
        size="lg"
        width="100%"
        isLoading={register.isPending}
        endContent={<Icon icon={ArrowRight} />}
      />
    </VStack>
  );
}

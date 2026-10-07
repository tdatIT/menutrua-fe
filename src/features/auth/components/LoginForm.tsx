import {useState} from 'react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {HStack, VStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {zodResolver} from '@hookform/resolvers/zod';
import {ArrowRight, Lock, User} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {FormCheckbox} from '@/components/form/FormCheckbox';
import {FormTextInput} from '@/components/form/FormTextInput';
import {applyServerErrors} from '@/components/form/server-errors';
import {useLogin} from '../hooks';
import {loginSchema, type LoginValues} from '../schemas';

export function LoginForm() {
  const toast = useToast();
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const {control, handleSubmit, setError} = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {username: '', password: '', remember: true},
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    login.mutate(values, {
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
        placeholder="Nhập tên đăng nhập"
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
        placeholder="Nhập mật khẩu"
        startIcon={Lock}
        size="lg"
        autoComplete="current-password"
      />
      <HStack justify="between" align="center" gap={2} wrap="wrap">
        <FormCheckbox control={control} name="remember" label="Ghi nhớ đăng nhập" size="sm" />
        <Link
          href="#"
          size="sm"
          weight="semibold"
          onClick={(event) => {
            event.preventDefault();
            toast({body: 'Tính năng khôi phục mật khẩu sắp có nhé!', uniqueID: 'forgot'});
          }}
        >
          Quên mật khẩu?
        </Link>
      </HStack>
      <Button
        type="submit"
        label="Đăng nhập"
        variant="primary"
        size="lg"
        width="100%"
        isLoading={login.isPending}
        endContent={<Icon icon={ArrowRight} />}
      />
      {import.meta.env.DEV && (
        <Text type="supporting">Tài khoản demo (mock): demo / menutrua123</Text>
      )}
    </VStack>
  );
}

import type {ComponentProps} from 'react';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {useController, type Control, type FieldPath, type FieldValues} from 'react-hook-form';

type CheckboxProps = ComponentProps<typeof CheckboxInput>;

type FormCheckboxProps<T extends FieldValues> = Omit<
  CheckboxProps,
  'value' | 'onChange' | 'status' | 'htmlName'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  ...props
}: FormCheckboxProps<T>) {
  const {field} = useController({control, name});
  return (
    <CheckboxInput
      {...props}
      htmlName={field.name}
      value={Boolean(field.value)}
      onChange={(checked) => field.onChange(checked)}
      onBlur={field.onBlur}
    />
  );
}

import type {ComponentProps} from 'react';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useController, type Control, type FieldPath, type FieldValues} from 'react-hook-form';

type TextInputProps = ComponentProps<typeof TextInput>;

type FormTextInputProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChange' | 'status' | 'htmlName'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

/** Astryx TextInput bound to react-hook-form, with inline error status. */
export function FormTextInput<T extends FieldValues>({
  control,
  name,
  ...props
}: FormTextInputProps<T>) {
  const {field, fieldState} = useController({control, name});
  return (
    <TextInput
      {...props}
      htmlName={field.name}
      value={field.value ?? ''}
      onChange={(value) => field.onChange(value)}
      status={
        fieldState.error?.message ? {type: 'error', message: fieldState.error.message} : undefined
      }
      statusVariant="detached"
      width="100%"
    />
  );
}

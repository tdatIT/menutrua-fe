import type {ComponentProps} from 'react';
import {TextArea} from '@astryxdesign/core/TextArea';
import {useController, type Control, type FieldPath, type FieldValues} from 'react-hook-form';

type TextAreaProps = ComponentProps<typeof TextArea>;

type FormTextAreaProps<T extends FieldValues> = Omit<
  TextAreaProps,
  'value' | 'onChange' | 'status' | 'htmlName'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormTextArea<T extends FieldValues>({
  control,
  name,
  ...props
}: FormTextAreaProps<T>) {
  const {field, fieldState} = useController({control, name});
  return (
    <TextArea
      {...props}
      htmlName={field.name}
      value={field.value ?? ''}
      onChange={(value) => field.onChange(value)}
      onBlur={field.onBlur}
      status={
        fieldState.error?.message ? {type: 'error', message: fieldState.error.message} : undefined
      }
      statusVariant="detached"
      width="100%"
    />
  );
}

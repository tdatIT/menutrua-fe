import type {ComponentProps} from 'react';
import {FileInput} from '@astryxdesign/core/FileInput';
import {useController, type Control, type FieldPath, type FieldValues} from 'react-hook-form';

type FileInputProps = ComponentProps<typeof FileInput>;

type FormFileInputProps<T extends FieldValues> = Omit<
  FileInputProps,
  'value' | 'onChange' | 'status' | 'isMultiple'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

/** Single-file upload bound to react-hook-form. */
export function FormFileInput<T extends FieldValues>({
  control,
  name,
  ...props
}: FormFileInputProps<T>) {
  const {field, fieldState} = useController({control, name});
  return (
    <FileInput
      {...props}
      value={field.value ?? null}
      onChange={(files) => field.onChange(Array.isArray(files) ? (files[0] ?? null) : files)}
      status={
        fieldState.error?.message ? {type: 'error', message: fieldState.error.message} : undefined
      }
      statusVariant="detached"
      width="100%"
    />
  );
}


'use client';

import React from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';

type AntInputProps = React.ComponentPropsWithoutRef<typeof Input>;

type CustomInputProps = Omit<
  AntInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'onClick'
  | 'type'
  | 'status'
  | 'id'
  | 'name'
  | 'prefix'
  | 'suffix'
> & {
  value?: string;
  defaultValue?: string;
  label?: string;
  id?: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  status?: '' | 'error' | 'warning';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  autoComplete?: string;

  // Сумісність із наявними формами, де використовується autocomplete.
  autocomplete?: string;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const CustomInput = React.forwardRef<InputRef, CustomInputProps>(
  (
    {
      value,
      defaultValue,
      label,
      id,
      name,
      type = 'text',
      placeholder,
      onChange,
      onBlur,
      onClick,
      status,
      autoComplete,
      autocomplete,
      prefix,
      suffix,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? name;
    const resolvedAutoComplete = autoComplete ?? autocomplete;

    const commonProps = {
      id: inputId,
      name,
      placeholder,
      onChange,
      onBlur,
      onClick,
      status: status || undefined,
      autoComplete: resolvedAutoComplete,
      prefix,
      suffix,
      ...rest,
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {type === 'password' ? (
          <Input.Password
            {...commonProps}
            value={value}
            defaultValue={defaultValue}
            ref={ref}
          />
        ) : (
          <Input
            {...commonProps}
            type={type}
            value={value}
            defaultValue={defaultValue}
            ref={ref}
          />
        )}
      </div>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;

import { useState } from 'react';
import { TextInput } from '@mantine/core';
import classes from '../scss/InputBox.module.scss';

interface InputBoxProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function InputBoxAmount({ value: controlledValue, onChange }: InputBoxProps) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const floating = value.trim().length !== 0 || focused || undefined;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TextInput
      label="Amount (uint256)"
      placeholder="The value of the transaction"
      required
      classNames={classes}
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}

export function InputBoxDescription({ value: controlledValue, onChange }: InputBoxProps) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const floating = value.trim().length !== 0 || focused || undefined;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TextInput
      label="Description (string)"
      placeholder="Short text description"
      required
      classNames={classes}
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}

export function InputBoxRecipientName({ value: controlledValue, onChange }: InputBoxProps) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const floating = value.trim().length !== 0 || focused || undefined;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TextInput
      label="Recipient Name (string)"
      placeholder="Name of the person / company / entity receiving the funds"
      required
      classNames={classes}
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}

export function InputBoxRecipientAddress({ value: controlledValue, onChange }: InputBoxProps) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const floating = value.trim().length !== 0 || focused || undefined;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TextInput
      label="Recipient Address (address)"
      placeholder="Ethereum address of who the money was sent to"
      required
      classNames={classes}
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
}
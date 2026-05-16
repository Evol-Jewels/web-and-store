"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
}

export function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
  autoComplete,
  maxLength,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-13px font-inter">
        {label} {required && <span className="text-evolRed">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`px-3 py-2 text-13px border border-evol-grey rounded text-evol-dark-grey ${error ? "border-red-500" : ""}`}
      />
      {error && (
        <motion.p
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -4, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-12px font-dmsans text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormSelect({
  label,
  options,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-13px font-inter">
        {label} {required && <span className="text-evolRed">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={`px-3 py-2 text-13px border border-evol-grey rounded text-evol-dark-grey ${error ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <motion.p
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -4, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-12px font-dmsans text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function FormCheckbox({
  label,
  checked,
  onChange,
  disabled,
}: FormCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <Label htmlFor={label} className="text-13px font-inter cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  rows?: number;
}

export function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 200,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-13px font-inter">{label}</Label>
        <span className="text-11px font-dmsans text-evol-grey">
          {value.length}/{maxLength}
        </span>
      </div>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        rows={rows}
        className="text-13px resize-none border border-[#E5E5E5] rounded text-evol-dark-grey focus-visible:ring-black/5"
      />
    </div>
  );
}

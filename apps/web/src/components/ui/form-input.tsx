import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
  type?: string;
};

export function FormInput<T extends FieldValues>({
  label,
  name,
  register,
  error,
  placeholder,
  type = 'text',
}: Props<T>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

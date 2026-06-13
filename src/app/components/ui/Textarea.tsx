import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import Label from './Label';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, required, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = id || defaultId;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <Label htmlFor={textareaId} required={required}>{label}</Label>}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex w-full rounded-md border border-(--border) bg-transparent px-3 py-2 text-sm shadow-sm font-medium placeholder:text-(--fg-subtle) transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-(--accent-ring) focus:border-(--accent-fg)',
            'disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-15',
            error && 'border-(--error) focus:ring-(--error)/30 focus:border-(--error)',
            className
          )}
          rows={3}
          {...props}
        />
        {error && <p className="text-xs text-(--error) tracking-tight">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
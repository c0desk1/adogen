import { forwardRef } from 'react';
import { cn } from '@/app/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-(--fg-strong) leading-none select-none',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-(--error) ml-0.5 select-none">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
export default Label;
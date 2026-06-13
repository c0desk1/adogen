import { cn } from '@/app/lib/utils';
import Icon from './Icon';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
    xl: 'h-10 w-10',
  };

  return (
    <Icon name='spinner' className={cn('animate-spin text-(--fg-muted) shrink-0', sizeClasses[size], className)} />
  );
};

export default Spinner;
// src/app/beta/components/ui/Skeleton.tsx
import { cn } from '@/app/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-md bg-(--bg-muted)', className)}
      {...props}
    />
  );
}
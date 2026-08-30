import * as React from 'react';
import { cn } from '../../shared/utils/cn';

const Skeleton = React.memo(({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse bg-muted', className)} {...props} />
));

Skeleton.displayName = 'Skeleton';

export { Skeleton };

import * as React from 'react';
import { cn } from '@/lib/utils';

export const Avatar = ({ src, fallback, className }: { src?: string; fallback: string; className?: string }) => {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}>
      {src ? (
        <img src={src} className="aspect-square h-full w-full" alt="Avatar" crossOrigin="anonymous" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
          {fallback}
        </div>
      )}
    </div>
  );
};

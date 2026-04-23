import * as React from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return null;
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as any, { onClick: () => setOpen(!open) });
        }
        if (child.type === DropdownMenuContent) {
          return open ? React.cloneElement(child as any, { onClick: () => setOpen(false) }) : null;
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>(({ asChild, children, onClick, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick, ref, ...props });
  }
  return <button onClick={onClick} ref={ref} {...props}>{children}</button>;
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = ({ children, className, align = 'center', onClick }: any) => {
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95",
      align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2',
      "top-full mt-2",
      className
    )}
    onClick={onClick}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, className, onClick, ...props }: any) => {
  return (
    <div
      className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

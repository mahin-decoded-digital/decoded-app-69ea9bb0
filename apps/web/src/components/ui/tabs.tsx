import * as React from 'react';
import { cn } from '@/lib/utils';

export const Tabs = ({ defaultValue, onValueChange, children, className }: any) => {
  const [active, setActive] = React.useState(defaultValue);
  
  // To handle controlled or uncontrolled
  const activeValue = onValueChange ? defaultValue : active;
  const onChange = onValueChange || setActive;

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { activeValue, onChange } as any);
      })}
    </div>
  );
};

export const TabsList = ({ children, className, ...props }: any) => {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className, activeValue, onChange, ...props }: any) => {
  const isActive = activeValue === value;
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-muted-foreground/10",
        className
      )}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className, activeValue, ...props }: any) => {
  if (activeValue !== value) return null;
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props}>
      {children}
    </div>
  );
};

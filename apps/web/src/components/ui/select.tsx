import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = ({ value, onValueChange, children }: any) => {
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full h-10 px-3 py-2 text-sm bg-background border rounded-md border-input ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
      >
        {children}
      </select>
      <div className="absolute right-3 top-3 pointer-events-none opacity-50">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export const SelectItem = ({ value, children }: any) => {
  return <option value={value}>{children}</option>;
};

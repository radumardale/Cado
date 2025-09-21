'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer data-[state=checked]:bg-green data-[state=unchecked]:bg-lightgray dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 w-full items-center rounded-full shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'w-full bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-all data-[state=checked]:ml-[calc(100%-2.6rem)] data-[state=unchecked]:ml-0.75'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

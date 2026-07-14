'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { m } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';

// Utility function to detect OS and return appropriate modifier key
const getModifierKey = () => {
  if (typeof navigator === 'undefined') return { key: 'Ctrl', symbol: 'Ctrl' };

  const isMac =
    navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
    navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

  return isMac ? { key: 'cmd', symbol: '⌘' } : { key: 'ctrl', symbol: 'Ctrl' };
};

// Context for sharing state between components
interface CommandMenuContextType {
  value: string;
  setValue: (value: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  scrollType?: 'auto' | 'always' | 'scroll' | 'hover';
  scrollHideDelay?: number;
}

const CommandMenuContext = React.createContext<
  CommandMenuContextType | undefined
>(undefined);

const CommandMenuProvider: React.FC<{
  children: React.ReactNode;
  value: string;
  setValue: (value: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  scrollType?: 'auto' | 'always' | 'scroll' | 'hover';
  scrollHideDelay?: number;
}> = ({
  children,
  value,
  setValue,
  selectedIndex,
  setSelectedIndex,
  scrollType,
  scrollHideDelay,
}) => (
  <CommandMenuContext.Provider
    value={{
      value,
      setValue,
      selectedIndex,
      setSelectedIndex,
      scrollType,
      scrollHideDelay,
    }}
  >
    {children}
  </CommandMenuContext.Provider>
);

const useCommandMenu = () => {
  const context = React.useContext(CommandMenuContext);
  if (!context) {
    throw new Error('useCommandMenu must be used within CommandMenuProvider');
  }
  return context;
};

// Core CommandMenu component using Dialog
const CommandMenu = DialogPrimitive.Root;
const CommandMenuTrigger = DialogPrimitive.Trigger;
const CommandMenuPortal = DialogPrimitive.Portal;
const CommandMenuClose = DialogPrimitive.Close;

// Title components for accessibility
const CommandMenuTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-foreground',
      className,
    )}
    {...props}
  />
));
CommandMenuTitle.displayName = 'CommandMenuTitle';

const CommandMenuDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CommandMenuDescription.displayName = 'CommandMenuDescription';

// Overlay with backdrop blur
const CommandMenuOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
CommandMenuOverlay.displayName = 'CommandMenuOverlay';

// Main content container with keyboard navigation
const CommandMenuContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showShortcut?: boolean;
    scrollType?: 'auto' | 'always' | 'scroll' | 'hover';
    scrollHideDelay?: number;
  }
>(
  (
    {
      className,
      children,
      showShortcut = true,
      scrollType = 'hover',
      scrollHideDelay = 600,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    // Keyboard navigation
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          // Logic will be handled by CommandMenuList
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          // Logic will be handled by CommandMenuList
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Logic will be handled by CommandMenuItem
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
      <CommandMenuPortal>
        <CommandMenuOverlay />
        <DialogPrimitive.Content asChild ref={ref} {...props}>
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed left-[50%] top-[50%] z-50 w-[95%] max-w-2xl translate-x-[-50%] translate-y-[-50%]',
              // GLASS EFFECT UPDATE: Heavy blur, translucent black, subtle border
              'bg-[#09090b]/80 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-2xl ring-1 ring-white/5',
              'overflow-hidden max-h-[85vh] flex flex-col',
              className,
            )}
          >
            {' '}
            <CommandMenuProvider
              value={value}
              setValue={setValue}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              scrollType={scrollType}
              scrollHideDelay={scrollHideDelay}
            >
              <VisuallyHidden.Root>
                <CommandMenuTitle>Command Menu</CommandMenuTitle>
              </VisuallyHidden.Root>

              {children}

              <CommandMenuClose className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 focus-visible:outline-none transition-colors">
                <X size={14} />
                <span className="sr-only">Close</span>
              </CommandMenuClose>

              {showShortcut && (
                <div className="absolute right-12 top-3 flex items-center justify-center gap-1 h-6.5">
                  <Kbd
                    size="xs"
                    className="bg-white/5 border-white/10 text-zinc-400"
                  >
                    {getModifierKey().symbol}
                  </Kbd>
                  <Kbd
                    size="xs"
                    className="bg-white/5 border-white/10 text-zinc-400"
                  >
                    K
                  </Kbd>
                </div>
              )}
            </CommandMenuProvider>
          </m.div>
        </DialogPrimitive.Content>
      </CommandMenuPortal>
    );
  },
);
CommandMenuContent.displayName = 'CommandMenuContent';

// Input component for search
const CommandMenuInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    placeholder?: string;
  }
>(
  (
    { className, placeholder = 'Type a command or search...', ...props },
    ref,
  ) => {
    const { value, setValue } = useCommandMenu();

    return (
      <div className="flex items-center border-b border-white/5 px-4 py-2 shrink-0">
        <Search className="mr-3 h-4 w-4 shrink-0 text-zinc-500" />
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn(
            'flex h-10 w-full rounded-none border-0 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600 text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 font-medium',
            className,
          )}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  },
);
CommandMenuInput.displayName = 'CommandMenuInput';

// List container for command items with scroll area
const CommandMenuList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    maxHeight?: string;
  }
>(({ className, children, maxHeight, ...props }, ref) => {
  const {
    selectedIndex,
    setSelectedIndex,
    scrollType = 'hover',
    scrollHideDelay = 600,
  } = useCommandMenu();

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const items = document.querySelectorAll('[data-command-item]');
      const maxIndex = items.length - 1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = Math.min(selectedIndex + 1, maxIndex);
        setSelectedIndex(newIndex);

        // Scroll selected item into view
        const selectedItem = items[newIndex] as HTMLElement;
        if (selectedItem) {
          selectedItem.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(selectedIndex - 1, 0);
        setSelectedIndex(newIndex);

        // Scroll selected item into view
        const selectedItem = items[newIndex] as HTMLElement;
        if (selectedItem) {
          selectedItem.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, setSelectedIndex]);

  return (
    <div ref={ref} className={cn('p-2 overflow-hidden', className)} {...props}>
      <ScrollArea
        className="w-full [&_[data-radix-scroll-area-viewport]]:overscroll-contain [&_[data-radix-scroll-area-scrollbar]]:opacity-0 [&_[data-radix-scroll-area-scrollbar]]:w-0 [&_[data-radix-scroll-area-scrollbar]]:bg-transparent"
        style={{ height: maxHeight || 'auto' }}
        type="always"
      >
        <div className="space-y-1 p-1">{children}</div>
      </ScrollArea>
    </div>
  );
});
CommandMenuList.displayName = 'CommandMenuList';

// Command group with optional heading
const CommandMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    heading?: string;
  }
>(({ className, children, heading, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>
    {heading && (
      <div className="px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none">
        {heading}
      </div>
    )}
    {children}
  </div>
));
CommandMenuGroup.displayName = 'CommandMenuGroup';

// Individual command item
const CommandMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onSelect?: () => void;
    disabled?: boolean;
    shortcut?: string;
    icon?: React.ReactNode;
    index?: number;
    keywords?: string[];
    label?: string;
  }
>(
  (
    {
      className,
      children,
      onSelect,
      disabled = false,
      shortcut,
      icon,
      index = 0,
      keywords,
      label,
      ...props
    },
    ref,
  ) => {
    const {
      selectedIndex,
      setSelectedIndex,
      value: searchValue,
    } = useCommandMenu();
    const isSelected = selectedIndex === index;

    // Filter logic
    const matches =
      !searchValue ||
      (label || (typeof children === 'string' ? children : ''))
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      keywords?.some((k) =>
        k.toLowerCase().includes(searchValue.toLowerCase()),
      );

    // Handle click and enter key
    const handleSelect = React.useCallback(() => {
      if (!disabled && onSelect) {
        onSelect();
      }
    }, [disabled, onSelect]);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isSelected) {
          e.preventDefault();
          handleSelect();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSelected, handleSelect]);

    if (!matches) return null;

    return (
      <m.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        ref={ref}
        data-command-item
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-all duration-200 gap-3',
          // Default state
          'text-zinc-400',
          // Selected / Hover state -- SUBTLE & SLEEK
          isSelected
            ? 'bg-white/[0.08] text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
            : 'hover:bg-white/[0.04] hover:text-zinc-300',

          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={handleSelect}
        onMouseEnter={() => setSelectedIndex(index)}
        {...(props as unknown as React.ComponentPropsWithoutRef<typeof m.div>)}
      >
        {icon && (
          <div
            className={cn(
              'h-4 w-4 flex items-center justify-center transition-colors',
              isSelected ? 'text-zinc-100' : 'text-zinc-500',
            )}
          >
            {/* Clone icon to enforce size if needed, but styling parent is usually enough */}
            {icon}
          </div>
        )}

        <div className="flex-1 truncate font-medium">{children}</div>

        {shortcut && (
          <div className="ml-auto flex items-center gap-1">
            {shortcut.split('+').map((key, i) => (
              <React.Fragment key={key}>
                {i > 0 && <span className="text-zinc-600 text-xs">+</span>}
                <Kbd
                  size="xs"
                  className="bg-transparent border-white/10 text-zinc-500 group-hover:text-zinc-400"
                >
                  {key === 'cmd' || key === '⌘'
                    ? getModifierKey().symbol
                    : key === 'shift'
                      ? '⇧'
                      : key === 'alt'
                        ? '⌥'
                        : key === 'ctrl'
                          ? getModifierKey().key === 'cmd'
                            ? '⌃'
                            : 'Ctrl'
                          : key}
                </Kbd>
              </React.Fragment>
            ))}
          </div>
        )}
      </m.div>
    );
  },
);
CommandMenuItem.displayName = 'CommandMenuItem';

// Separator between groups
const CommandMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-2 h-px bg-white/5', className)}
    {...props}
  />
));
CommandMenuSeparator.displayName = 'CommandMenuSeparator';

// Empty state
const CommandMenuEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children = 'No results found.', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm text-muted-foreground', className)}
    {...props}
  >
    {children}
  </div>
));
CommandMenuEmpty.displayName = 'CommandMenuEmpty';

// Hook for global keyboard shortcut
export const useCommandMenuShortcut = (callback: () => void) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
};

export {
  CommandMenu,
  CommandMenuTrigger,
  CommandMenuContent,
  CommandMenuTitle,
  CommandMenuDescription,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuSeparator,
  CommandMenuClose,
  useCommandMenu,
};

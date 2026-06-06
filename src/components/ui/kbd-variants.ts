import { cva } from "class-variance-authority";

export const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono font-medium text-xs bg-muted text-muted-foreground border border-border rounded-md border-b-3 transition-all duration-75 cursor-pointer select-none active:translate-y-[1px] active:border-b-[1px]  hover:bg-muted/80 shadow-sm/2",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-border",
        outline: "bg-transparent border-border text-foreground hover:bg-accent",
        solid:
          "bg-foreground text-background border-foreground hover:bg-foreground/90",
        secondary:
          "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
      },
      size: {
        xs: "h-5 px-1.5 text-[10px] min-w-[1.25rem]",
        sm: "h-6 px-2 text-xs min-w-[1.5rem]",
        md: "h-7 px-2.5 text-sm min-w-[1.75rem]",
        lg: "h-8 px-3 text-sm min-w-[2rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

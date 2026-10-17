// Tailwind classes for Loam buttons, shared by Button, IconButton and anything that just needs to look like one.
// Each group sets different properties, so combining them never relies on class order.

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-body font-bold leading-none no-underline cursor-pointer ' +
  'transition-[translate,box-shadow,background-color] duration-120 ease-out focus-visible:outline-offset-4 ' +
  'disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none disabled:translate-none';

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm border-2',
  md: 'h-11.5 px-5 text-base border-3',
  lg: 'h-14.5 px-7 text-lg border-3',
};

const iconSizes: Record<ButtonSize, string> = {
  sm: 'size-9 border-2',
  md: 'size-11.5 border-3',
  lg: 'size-14.5 border-3',
};

/** Offset shadow that lifts on hover and presses flat on click (primary + secondary) */
export const buttonRaised: Record<ButtonSize, string> = {
  sm: 'shadow-sm hover:-translate-px hover:shadow-[3px_3px_0_0_var(--color-line)] active:translate-0.5 active:shadow-none',
  md: 'shadow-md hover:-translate-0.5 hover:shadow-lg active:translate-1 active:shadow-none',
  lg: 'shadow-md hover:-translate-0.5 hover:shadow-lg active:translate-1 active:shadow-none',
};

const variants: Record<ButtonVariant, string> = {
  primary: 'border-line bg-sage-500 text-on-fill hover:bg-sage-300',
  secondary: 'border-line bg-surface text-fg-1 hover:bg-mist-100',
  dark: 'border-line bg-inverse text-fg-inverse hover:bg-inverse-hover active:translate-px',
  ghost: 'border-transparent bg-transparent text-fg-1 hover:bg-sunken active:translate-px',
};

export function buttonClass({ variant = 'primary', size = 'md', icon = false }: { variant?: ButtonVariant; size?: ButtonSize; icon?: boolean } = {}) {
  const raised = variant === 'primary' || variant === 'secondary';
  return [buttonBase, icon ? iconSizes[size] : sizes[size], variants[variant], raised && buttonRaised[size]].filter(Boolean).join(' ');
}

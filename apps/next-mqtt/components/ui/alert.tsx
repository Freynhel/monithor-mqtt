import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useState } from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


const Icons = {
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  x: "M18 6L6 18M6 6l12 12",
};

const Icon = ({ d, size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

export default function AlertDefault({ props: { title, description, variant } }) {
  const [notification, setNotification] = useState(true);
  const variantStyles = {
    error: "border-red-500/30 text-red-300",
    alert: "border-amber-500/30 text-amber-300",
    default: "bg-card text-card-foreground",
  };
  if (!notification) return null;
  if (variant === "alert") {

  };
  return (
    <div className="relative rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3 animate-fade-in">
      <Icon d={Icons.bell} size={16} className={`mt-0.5 shrink-0 ${variantStyles[variant]}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${variantStyles[variant]}`}>{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button onClick={() => setNotification(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
        <Icon className="" d={Icons.x} size={14} />
      </button>
    </div>
  )
}

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }

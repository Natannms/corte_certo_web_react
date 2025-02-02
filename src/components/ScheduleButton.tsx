import { ButtonHTMLAttributes, ReactNode } from 'react'
const variantStyles = {
  primary: "bg-emerald-600 hover:bg-emerald-700",
  danger: "bg-red-600 hover:bg-red-700",
  secondary: "bg-blue-600 hover:bg-blue-700"
}
type ScheduleStatus = 'confirmed' | 'in-progress' | 'canceled'

interface ScheduleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  scheduleId: number
  newStatus: ScheduleStatus
  variant?: 'primary' | 'danger'
  onUpdateStatus: (scheduleId: number, status: ScheduleStatus) => void
  children: ReactNode
}

export function ScheduleButton({
  scheduleId,
  newStatus,
  variant = 'primary',
  onUpdateStatus,
  children,
  ...props
}: ScheduleButtonProps) {
  const baseStyles = "w-full flex items-center justify-center gap-2 text-white py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 hover:shadow-lg"

  return (
    <button
      onClick={() => onUpdateStatus(scheduleId, newStatus)}
      className={`${baseStyles} ${variantStyles[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface ScheduleGenericButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: ReactNode
  htmlFor?: string
}

export function ScheduleGenericButton({
  htmlFor,
  className,
  children,
}: ScheduleGenericButtonProps) {
  const baseStyles = "w-full flex items-center justify-center gap-2 text-white py-2.5 px-4 rounded-lg transition-all duration-300 active:scale-95 hover:shadow-lg"

  return (
    <label
      className={`${baseStyles} ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
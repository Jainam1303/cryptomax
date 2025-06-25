import React from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className
}) => {
  const variantStyles = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300",
    success: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300",
    danger: "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300",
    warning: "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300",
    info: "bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };
  
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1"
  };
  
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
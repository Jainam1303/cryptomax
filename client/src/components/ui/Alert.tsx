import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  onClose,
  className
}) => {
  const variantStyles = {
    success: "bg-success-50 text-success-800 dark:bg-success-900/30 dark:text-success-200",
    danger: "bg-danger-50 text-danger-800 dark:bg-danger-900/30 dark:text-danger-200",
    warning: "bg-warning-50 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200",
    info: "bg-info-50 text-info-800 dark:bg-info-900/30 dark:text-info-200"
  };
  
  const iconStyles = {
    success: "text-success-500",
    danger: "text-danger-500",
    warning: "text-warning-500",
    info: "text-info-500"
  };
  
  const Icon = {
    success: CheckCircle,
    danger: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }[variant];
  
  return (
    <div className={clsx(
      "rounded-md p-4",
      variantStyles[variant],
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx("h-5 w-5", iconStyles[variant])} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={clsx("text-sm", title && "mt-2")}>
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  "inline-flex rounded-md p-1.5",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  {
                    success: "bg-success-50 text-success-500 hover:bg-success-100 focus:ring-success-600 focus:ring-offset-success-50 dark:bg-success-900/20 dark:hover:bg-success-900/30",
                    danger: "bg-danger-50 text-danger-500 hover:bg-danger-100 focus:ring-danger-600 focus:ring-offset-danger-50 dark:bg-danger-900/20 dark:hover:bg-danger-900/30",
                    warning: "bg-warning-50 text-warning-500 hover:bg-warning-100 focus:ring-warning-600 focus:ring-offset-warning-50 dark:bg-warning-900/20 dark:hover:bg-warning-900/30",
                    info: "bg-info-50 text-info-500 hover:bg-info-100 focus:ring-info-600 focus:ring-offset-info-50 dark:bg-info-900/20 dark:hover:bg-info-900/30"
                  }[variant]
                )}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
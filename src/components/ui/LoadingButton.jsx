// components/ui/LoadingButton.js

import { cn } from "@/lib/utils";

const LoadingButton = ({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  type = "button",
  onClick,
  className = "",
  variant = "primary", // primary, secondary, destructive, outline
  icon,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white";
      case "destructive":
        return "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white";
      case "outline":
        return "border border-blue-300 text-blue-700 hover:bg-blue-50";
      case "success":
        return "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white";
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        `px-8 py-2.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClass()} ${className}`,
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;

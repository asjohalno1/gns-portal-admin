import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext();

// Enhanced Toast icons with better styling
const SuccessIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 11l3 3l8-8" />
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const WarnIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <path d="m12 17.02.01 0" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Progress bar component
const ProgressBar = ({ duration, type }) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-current opacity-40"
      initial={{ width: "100%" }}
      animate={{ width: "0%" }}
      transition={{ duration: duration / 1000, ease: "linear" }}
    />
  );
};

export const CustomToaster = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", options = {}) => {
    const id = Date.now() + Math.random();
    const duration =
      options.autoClose !== false ? options.autoClose || 5000 : null;

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
        pauseOnHover: options.pauseOnHover !== false,
        position: options.position || "top-right",
      },
    ]);

    // Auto dismiss
    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type) => {
    const baseStyles = "bg-white shadow-2xl border rounded-lg backdrop-blur-sm";

    switch (type) {
      case "success":
        return `${baseStyles} border-green-200 shadow-green-100`;
      case "error":
        return `${baseStyles} border-red-200 shadow-red-100`;
      case "warn":
        return `${baseStyles} border-yellow-200 shadow-yellow-100`;
      case "info":
      default:
        return `${baseStyles} border-blue-200 shadow-blue-100`;
    }
  };

  const getIconStyles = (type) => {
    switch (type) {
      case "success":
        return "text-green-500 bg-green-50 border-green-200";
      case "error":
        return "text-red-500 bg-red-50 border-red-200";
      case "warn":
        return "text-amber-500 bg-amber-50 border-amber-200";
      case "info":
      default:
        return "text-blue-500 bg-blue-50 border-blue-200";
    }
  };

  const getProgressColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warn":
        return "text-amber-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      case "warn":
        return <WarnIcon />;
      case "info":
      default:
        return <InfoIcon />;
    }
  };

  // Demo functions for testing
  const showSuccess = () =>
    addToast("Success! Operation completed successfully.", "success");
  const showError = () =>
    addToast("Error! Something went wrong. Please try again.", "error");
  const showWarning = () =>
    addToast("Warning! Please check your input data.", "warn");
  const showInfo = () =>
    addToast("Info! Here's some helpful information for you.", "info");
  const showPersistent = () =>
    addToast("This toast won't auto-dismiss!", "info", { autoClose: false });

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
        <AnimatePresence mode="popLayout">
          {toasts.map(({ id, message, type, duration, pauseOnHover }) => (
            <motion.div
              key={id}
              layout
              initial={{
                opacity: 0,
                x: 400,
                scale: 0.3,
                rotateX: -90,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                x: 400,
                scale: 0.5,
                transition: { duration: 0.2 },
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.4,
              }}
              whileHover={pauseOnHover ? { scale: 1.02, y: -2 } : {}}
              className={`
                relative overflow-hidden min-w-[350px] p-4 flex items-start gap-3
                ${getToastStyles(type)}
                cursor-pointer transform-gpu
              `}
              style={{
                boxShadow:
                  "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Icon container */}
              <div
                className={`
                flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center
                ${getIconStyles(type)}
              `}
              >
                {getIcon(type)}
              </div>

              {/* Message */}
              <div className="flex-1 pt-0.5">
                <div className="text-gray-800 text-sm font-medium leading-5 break-words">
                  {message}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 -m-1 rounded-full hover:bg-gray-100"
              >
                <CloseIcon />
              </button>

              {/* Progress bar */}
              {duration && (
                <div className={`${getProgressColor(type)}`}>
                  <ProgressBar duration={duration} type={type} />
                </div>
              )}

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within CustomToaster");
  return context;
};

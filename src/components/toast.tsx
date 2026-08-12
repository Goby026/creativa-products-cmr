import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 3400);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed bottom-7 left-1/2 z-[999] -translate-x-1/2 rounded-xl border bg-popover px-6 py-3.5 text-sm font-medium text-popover-foreground shadow-lifted transition-all duration-300",
          message
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0",
        )}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}

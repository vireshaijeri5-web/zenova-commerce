import { createContext, useCallback, useContext, useState } from "react";
import { Check, X } from "lucide-react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const notify = useCallback((nextMessage) => {
    setMessage(nextMessage);
    window.clearTimeout(window.novaToastTimer);
    window.novaToastTimer = window.setTimeout(() => setMessage(""), 2600);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {message && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={17} /> <span>{message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setMessage("")}><X size={16} /></button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

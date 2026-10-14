import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [toast, setToast] = useState("");

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), []);
  const stopLoading = useCallback(() => setLoadingCount((count) => Math.max(0, count - 1)), []);
  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }, []);

  const value = useMemo(() => ({
    loading: loadingCount > 0,
    startLoading,
    stopLoading,
    notify
  }), [loadingCount, startLoading, stopLoading, notify]);

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <div className="toast"><span className="toast-dot" />{toast}</div>}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}

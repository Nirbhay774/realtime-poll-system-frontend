"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "16px",
          background: "#082f49",
          color: "#ecfeff",
          border: "1px solid #67e8f9",
        },
      }}
    />
  );
}

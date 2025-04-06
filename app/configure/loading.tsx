"use client";
import React, { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
    </div>
  );
};

export default Loading;
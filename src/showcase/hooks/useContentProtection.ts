import { useEffect } from "react";

/**
 * Hook to implement content protection features:
 * - Disables right-click context menu
 * - Blocks common developer tools keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
 * - Displays a warning message in the console
 */
export const useContentProtection = () => {
  useEffect(() => {
    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Block Keyboard Shortcuts (DevTools & View Source)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I (Inspect) or Ctrl+Shift+J (Console) or Ctrl+Shift+C (Inspect Element)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "J" || e.key === "C")
      ) {
        e.preventDefault();
      }

      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
      }

      // Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };

    // 3. Console Warning Message
    const showConsoleWarning = () => {
      console.clear();
      console.log(
        "%cSTOP!",
        "color: white; font-size: 50px; font-weight: bold; text-shadow: 3px 3px 0 rgb(0,0,0); background-color: #ff3e3e; padding: 10px 20px; border: 4px solid black; margin: 10px 0;"
      );
      console.log(
        "%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a feature, it is a scam and will give them access to your account/data.",
        "font-size: 16px; font-weight: bold; color: black; line-height: 1.5;"
      );
      console.log(
        "%cContent on this site is protected. Please respect the author's work.",
        "font-size: 14px; font-style: italic; color: #666;"
      );
    };

    // Add event listeners
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    
    // Show warning on mount
    showConsoleWarning();

    // Cleanup
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

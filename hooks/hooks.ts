import { useEffect } from "react";

export function useKeyPress(
  callback: () => void,
  key: string,
  ctrl: boolean = false,
  keep: boolean = false
): void {
  function onPress(event: KeyboardEvent): any {
    if (key == event.key) {
      if (ctrl && event.ctrlKey) {
        event.preventDefault();
        callback();
      }

      if (!ctrl) {
        event.preventDefault();
        callback();
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onPress);

    return () => {
      window.removeEventListener("keydown", onPress); // this event listener is removed after the new route loads
    };
  }, []);
}

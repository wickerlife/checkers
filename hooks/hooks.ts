import { useEffect, useState } from "react";

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

export interface Size {
  width: number;
  height: number;
}

const getWidth = () => {
  if (typeof window !== "undefined") {
    return (
      window.innerWidth ||
      document.documentElement?.clientWidth ||
      document.body.clientWidth
    );
  }
  return 0;
};

const getHeight = () => {
  if (typeof window !== "undefined") {
    return (
      window.innerHeight ||
      document.documentElement?.clientHeight ||
      document.body.clientHeight
    );
  }
  return 0;
};

export function useCurrentSize() {
  // save current window width in the state object
  const [width, setWidth] = useState(getWidth());
  const [height, setHeight] = useState(getHeight());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: any = null;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => {
        setWidth(getWidth());
        setHeight(getHeight());
      }, 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return { width, height } as Size;
}

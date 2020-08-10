import { useEffect, useRef } from "react";

/**
 * usePeriodic runs the provided cb at a specific interval
 *
 * @param cb - The callback to run at the specified interval
 * @param interval - Override the default interval
 */
const usePeriodic = (cb: () => void, interval = 20000) => {
  const cbRef = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  // Set up the interval.
  useEffect(() => {
    if (cbRef.current) {
      const tick = () => cbRef.current && cbRef.current();
      const id = setInterval(tick, interval);
      cbRef.current();
      return () => clearInterval(id);
    }
  }, [interval]);
};

export { usePeriodic };

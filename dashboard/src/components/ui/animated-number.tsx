import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number; // in ms
};

export function AnimatedNumber({
  value,
  duration = 1000,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(progress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span className="tabular-nums font-semibold text-2xl sm:text-3xl">
      {displayValue}
    </span>
  );
}

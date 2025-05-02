import { cn } from "@/lib/utils";
interface SpinnerProps {
  /**
   * The size of the spinner in pixels
   * @default 24
   */
  size?: number;
  /**
   * Custom className to override default styles
   */
  className?: string;
  /**
   * The color of the spinner
   * @default "primary-500"
   */
  color?: string;
  /**
   * The thickness of the spinner border
   * @default 2
   */
  thickness?: number;
}

export default function Spinner({
  size = 24,
  className,
  color = "primary",
  thickness = 2,
}: Readonly<SpinnerProps>) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        `border-${color} border-t-transparent`,
        className
      )}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
    />
  );
}

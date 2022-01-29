import { ComponentProps } from "solid-js";
import { JSX } from "solid-js";
interface HTMLContainerProps extends ComponentProps<"div"> {
  centered?: boolean;
  opacity?: number;
  children: JSX.Element;
}

export const HTMLContainer = function HTMLContainer({
  children,
  opacity,
  centered,
  ref,
  className = "",
  ...rest
}: HTMLContainerProps): JSX.Element {
  return (
    <div
      ref={ref}
      className={`tl-positioned-div ${className}`}
      style={opacity ? { opacity } : undefined}
    >
      <div className={`tl-positioned-inner ${centered ? "tl-centered" : ""}`} {...rest}>
        {children}
      </div>
    </div>
  );
};

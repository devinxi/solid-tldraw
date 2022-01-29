import { ComponentProps, splitProps } from "solid-js";
import { JSX } from "solid-js";
interface SvgContainerProps extends ComponentProps<"svg"> {
  children: JSX.Element;
  className?: string;
}

export const SVGContainer = function SVGContainer(props: SvgContainerProps): JSX.Element {
  return (
    <svg ref={props.ref} class={`tl-positioned-svg ${props.class ?? ""}`}>
      <g id={props.id} class="tl-centered-g" {...splitProps(props, ["class"])[1]}>
        {props.children}
      </g>
    </svg>
  );
};

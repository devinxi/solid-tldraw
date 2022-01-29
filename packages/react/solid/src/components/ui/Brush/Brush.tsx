import { Container, SVGContainer } from "~/options/solid/src/components";
import type { TLBrushProps } from "~/options/solid/src/types/component-props";

export const Brush = function Brush({ bounds }: TLBrushProps) {
  return (
    <Container bounds={bounds} zIndex={10001}>
      <SVGContainer>
        <rect className="tl-brush" x={0} y={0} width={bounds.width} height={bounds.height} />
      </SVGContainer>
    </Container>
  );
};

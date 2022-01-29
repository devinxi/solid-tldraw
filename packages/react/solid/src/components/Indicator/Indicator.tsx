/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container, SVGContainer } from "~/options/solid/src/components";
import type { TLSolidShape } from "~/options/solid/src/lib";

interface IndicatorProps {
  shape: TLSolidShape;
  isHovered?: boolean;
  isSelected?: boolean;
  isBinding?: boolean;
  isEditing?: boolean;
  meta?: any;
}

export const Indicator = function Shape({
  shape,
  isHovered = false,
  isSelected = false,
  isBinding = false,
  isEditing = false,
  meta
}: IndicatorProps) {
  const {
    bounds,
    props: { rotation = 0 },
    SolidIndicator: ReactIndicator
  } = shape;

  return (
    <Container bounds={bounds} rotation={rotation} zIndex={10000}>
      <SVGContainer>
        <g className={`tl-indicator-container ${isSelected ? "tl-selected" : "tl-hovered"}`}>
          <ReactIndicator
            isEditing={isEditing}
            isBinding={isBinding}
            isHovered={isHovered}
            isSelected={isSelected}
            isErasing={false}
            meta={meta}
          />
        </g>
      </SVGContainer>
    </Container>
  );
};

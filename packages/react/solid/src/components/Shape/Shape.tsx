/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from "~/options/solid/src/components";
import type { TLSolidShape } from "~/options/solid/src/lib";
import { useShapeEvents } from "~/options/solid/src/hooks/useShapeEvents";
import type { TLAsset } from "@tldraw/core";

interface ShapeProps {
  shape: TLSolidShape;
  asset?: TLAsset;
  zIndex: number;
  isHovered?: boolean;
  isSelected?: boolean;
  isBinding?: boolean;
  isErasing?: boolean;
  isEditing?: boolean;
  meta: any;
}

export const Shape = function Shape({
  shape,
  zIndex,
  isHovered = false,
  isSelected = false,
  isBinding = false,
  isErasing = false,
  isEditing = false,
  asset,
  meta
}: ShapeProps) {
  const {
    bounds,
    props: { rotation },
    SolidComponent: ReactComponent
  } = shape;

  const events = useShapeEvents(shape);

  return (
    <Container bounds={bounds} rotation={rotation} zIndex={zIndex}>
      <ReactComponent
        meta={meta}
        isEditing={isEditing}
        isBinding={isBinding}
        isHovered={isHovered}
        isSelected={isSelected}
        isErasing={isErasing}
        events={events}
        asset={asset}
      />
    </Container>
  );
};

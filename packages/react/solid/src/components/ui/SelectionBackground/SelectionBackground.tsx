import { useBoundsEvents } from "~/options/solid/src/hooks/useBoundsEvents";
import { SVGContainer } from "~/options/solid/src/components";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSelectionComponentProps } from "~/options/solid/src/types/component-props";

export const SelectionBackground = function SelectionBackground<S extends TLSolidShape>({
  bounds
}: TLSelectionComponentProps<S>) {
  const events = useBoundsEvents("background");

  return (
    <SVGContainer {...events}>
      <rect
        className="tl-bounds-bg"
        width={Math.max(1, bounds.width)}
        height={Math.max(1, bounds.height)}
        pointerEvents="all"
      />
    </SVGContainer>
  );
};

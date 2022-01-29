import { useRendererContext } from "~/options/solid/src/hooks";
import { TLTargetType } from "@tldraw/core";
import type { TLSolidCustomEvents } from "~/options/solid/src/types";
import { useMemo } from "solid-react-compat";
export function useCanvasEvents() {
  const renderer = useRendererContext();

  const events = useMemo(() => {
    const onPointerMove: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      renderer().callbacks.onPointerMove?.({ type: TLTargetType.Canvas, order }, e);
    };

    const onPointerDown: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.setPointerCapture(e.pointerId);
      renderer().callbacks.onPointerDown?.({ type: TLTargetType.Canvas, order }, e);
    };

    const onPointerUp: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.releasePointerCapture(e.pointerId);
      renderer().callbacks.onPointerUp?.({ type: TLTargetType.Canvas, order }, e);
    };

    const onPointerEnter: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      renderer().callbacks.onPointerEnter?.({ type: TLTargetType.Canvas, order }, e);
    };

    const onPointerLeave: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      renderer().callbacks.onPointerLeave?.({ type: TLTargetType.Canvas, order }, e);
    };

    const onKeyDown: TLSolidCustomEvents["keyboard"] = e => {
      renderer().callbacks.onKeyDown?.({ type: TLTargetType.Canvas, order: -1 }, e);
    };

    const onKeyUp: TLSolidCustomEvents["keyboard"] = e => {
      renderer().callbacks.onKeyUp?.({ type: TLTargetType.Canvas, order: -1 }, e);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown,
      onKeyUp,
      onPointerEnter,
      onPointerLeave
    };
  });

  return events;
}

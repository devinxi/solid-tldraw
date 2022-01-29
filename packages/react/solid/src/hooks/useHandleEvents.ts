/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TLTargetType } from "@tldraw/core";
import { useRendererContext } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSolidCustomEvents } from "~/options/solid/src/types";

export function useHandleEvents<S extends TLSolidShape = TLSolidShape>(shape: S, index: number) {
  const { inputs, callbacks } = useRendererContext();

  const events = useMemo(() => {
    const onPointerMove: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      const handle = shape.props.handles![index];
      callbacks.onPointerMove?.({ type: TLTargetType.Handle, shape, handle, index, order }, e);
      e.order = order + 1;
    };

    const onPointerDown: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.setPointerCapture(e.pointerId);
      const handle = shape.props.handles![index];
      callbacks.onPointerDown?.({ type: TLTargetType.Handle, shape, handle, index, order }, e);
      e.order = order + 1;
    };

    const onPointerUp: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.releasePointerCapture(e.pointerId);
      const handle = shape.props.handles![index];
      callbacks.onPointerUp?.({ type: TLTargetType.Handle, shape, handle, index, order }, e);
      e.order = order + 1;
    };

    const onPointerEnter: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      const handle = shape.props.handles![index];
      callbacks.onPointerEnter?.({ type: TLTargetType.Handle, shape, handle, index, order }, e);
      e.order = order + 1;
    };

    const onPointerLeave: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      const handle = shape.props.handles![index];
      callbacks.onPointerLeave?.({ type: TLTargetType.Handle, shape, handle, index, order }, e);
      e.order = order + 1;
    };

    const onKeyDown: TLSolidCustomEvents["keyboard"] = e => {
      const handle = shape.props.handles![index];
      callbacks.onKeyDown?.({ type: TLTargetType.Handle, shape, handle, index, order: -1 }, e);
    };

    const onKeyUp: TLSolidCustomEvents["keyboard"] = e => {
      const handle = shape.props.handles![index];
      callbacks.onKeyUp?.({ type: TLTargetType.Handle, shape, handle, index, order: -1 }, e);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onKeyUp,
      onKeyDown
    };
  }, [shape.id, inputs, callbacks]);

  return events;
}

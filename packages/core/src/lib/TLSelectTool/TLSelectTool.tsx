import type { TLApp, TLShape } from '~lib'
import type { TLEventInfo, TLEventMap, TLHandle } from '~types'
import { TLTool } from '../TLTool'
import {
  IdleState,
  BrushingState,
  PointingCanvasState,
  PointingShapeState,
  PointingShapeBehindBoundsState,
  PointingBoundsBackgroundState,
  PointingSelectedShapeState,
  PointingResizeHandleState,
  PointingRotateHandleState,
  PointingHandleState,
  TranslatingHandleState,
  TranslatingState,
  ResizingState,
  RotatingState,
  PinchingState,
  HoveringResizeHandleState,
  EditingShapeState,
} from './states'

export class TLSelectTool<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap,
  R extends TLApp<S, K> = TLApp<S, K>
> extends TLTool<S, K, R> {
  static id = 'select'

  static initial = 'idle'

  static shortcut = ['v']

  static states = [
    IdleState,
    BrushingState,
    PointingCanvasState,
    PointingShapeState,
    PointingShapeBehindBoundsState,
    PointingSelectedShapeState,
    PointingBoundsBackgroundState,
    HoveringResizeHandleState,
    PointingResizeHandleState,
    PointingRotateHandleState,
    PointingHandleState,
    TranslatingHandleState,
    TranslatingState,
    ResizingState,
    RotatingState,
    RotatingState,
    PinchingState,
    EditingShapeState,
  ]
}

import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLSelectTool, TLToolState } from '~lib'
import {
  TLBounds,
  TLResizeCorner,
  TLResizeEdge,
  TLCursor,
  TLEventMap,
  TLEvents,
  TLShapeModel,
} from '~types'
import { BoundsUtils } from '~utils'

export class ResizingState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'resizing'

  isSingle = false
  isAspectRatioLocked = false
  handle: TLResizeCorner | TLResizeEdge = TLResizeCorner.BottomRight
  snapshots: Record<
    string,
    {
      shape: TLShapeModel
      bounds: TLBounds
      transformOrigin: number[]
    }
  > = {}
  initialRotation = 0
  initialInnerBounds = {} as TLBounds
  initialCommonBounds = {} as TLBounds
  initialCommonCenter = {} as number[]
  transformOrigins: Record<string, number[]> = {}
  selectionRotation = 0

  static CURSORS: Record<TLResizeCorner | TLResizeEdge, TLCursor> = {
    [TLResizeEdge.Bottom]: TLCursor.NsResize,
    [TLResizeEdge.Top]: TLCursor.NsResize,
    [TLResizeEdge.Left]: TLCursor.EwResize,
    [TLResizeEdge.Right]: TLCursor.EwResize,
    [TLResizeCorner.BottomLeft]: TLCursor.NeswResize,
    [TLResizeCorner.BottomRight]: TLCursor.NwseResize,
    [TLResizeCorner.TopLeft]: TLCursor.NwseResize,
    [TLResizeCorner.TopRight]: TLCursor.NeswResize,
  }

  onEnter = (info: { handle: TLResizeCorner | TLResizeEdge }) => {
    const { history, selectedShapesArray, selectionBounds } = this.app
    if (!selectionBounds) throw Error('Expected a selected bounds.')

    this.handle = info.handle
    this.app.cursors.setCursor(
      ResizingState.CURSORS[info.handle],
      this.app.selectionBounds?.rotation
    )
    history.pause()

    const initialInnerBounds = BoundsUtils.getBoundsFromPoints(
      selectedShapesArray.map(shape => BoundsUtils.getBoundsCenter(shape.bounds))
    )

    this.isSingle = selectedShapesArray.length === 1
    this.isAspectRatioLocked = this.isSingle && !!selectedShapesArray[0].props.isAspectRatioLocked
    this.selectionRotation = this.isSingle ? selectedShapesArray[0].props.rotation ?? 0 : 0
    this.initialCommonBounds = { ...selectionBounds }
    this.initialCommonCenter = BoundsUtils.getBoundsCenter(this.initialCommonBounds)

    this.snapshots = Object.fromEntries(
      selectedShapesArray.map(shape => {
        const { bounds } = shape
        const ic = BoundsUtils.getBoundsCenter(bounds)

        const ix = (ic[0] - initialInnerBounds.minX) / initialInnerBounds.width
        const iy = (ic[1] - initialInnerBounds.minY) / initialInnerBounds.height

        return [
          shape.id,
          {
            shape: shape.serialized,
            bounds: shape.bounds,
            transformOrigin: [ix, iy],
          },
        ]
      })
    )

    selectedShapesArray.forEach(shape => shape.onResizeStart?.())
  }

  onExit = () => {
    this.app.cursors.reset()
    this.snapshots = {}
    this.initialCommonBounds = {} as TLBounds
    this.selectionRotation = 0
    this.app.history.resume()
  }

  onWheel: TLEvents<S>['wheel'] = (info, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLEvents<S>['pointer'] = () => {
    const {
      inputs: { shiftKey, originPoint, currentPoint },
    } = this.app

    const { handle, snapshots, initialCommonBounds } = this

    const delta = Vec.sub(currentPoint, originPoint)

    const nextBounds = BoundsUtils.getTransformedBoundingBox(
      initialCommonBounds,
      handle,
      delta,
      this.selectionRotation,
      shiftKey || this.isAspectRatioLocked
    )

    const { scaleX, scaleY } = nextBounds

    const isFlippedX = scaleX < 0 && scaleY >= 0
    const isFlippedY = scaleY < 0 && scaleX >= 0

    switch (handle) {
      case TLResizeCorner.TopLeft:
      case TLResizeCorner.BottomRight: {
        if (isFlippedX || isFlippedY) {
          if (this.app.cursors.cursor === TLCursor.NwseResize) {
            this.app.cursors.setCursor(TLCursor.NeswResize, this.app.selectionBounds?.rotation)
          }
        } else {
          if (this.app.cursors.cursor === TLCursor.NeswResize) {
            this.app.cursors.setCursor(TLCursor.NwseResize, this.app.selectionBounds?.rotation)
          }
        }
        break
      }
      case TLResizeCorner.TopRight:
      case TLResizeCorner.BottomLeft: {
        if (isFlippedX || isFlippedY) {
          if (this.app.cursors.cursor === TLCursor.NeswResize) {
            this.app.cursors.setCursor(TLCursor.NwseResize, this.app.selectionBounds?.rotation)
          }
        } else {
          if (this.app.cursors.cursor === TLCursor.NwseResize) {
            this.app.cursors.setCursor(TLCursor.NeswResize, this.app.selectionBounds?.rotation)
          }
        }
        break
      }
    }

    this.app.selectedShapes.forEach(shape => {
      const { shape: initialShape, bounds: initialBounds, transformOrigin } = snapshots[shape.id]

      const relativeBounds = BoundsUtils.getRelativeTransformedBoundingBox(
        nextBounds,
        initialCommonBounds,
        initialBounds,
        scaleX < 0,
        scaleY < 0
      )

      shape.onResize(relativeBounds, {
        type: handle,
        initialShape,
        scale: [scaleX, scaleY],
        transformOrigin,
      })
    })
  }

  onPointerUp: TLEvents<S>['pointer'] = () => {
    this.app.history.resume()
    this.app.persist()
    this.tool.transition('idle')
  }

  onKeyDown: TLEvents<S>['keyboard'] = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.selectedShapes.forEach(shape => {
          shape.update({ ...this.snapshots[shape.id].shape })
        })
        this.tool.transition('idle')
        break
      }
    }
  }
}

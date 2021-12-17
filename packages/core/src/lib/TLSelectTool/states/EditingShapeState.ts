import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~lib'
import { TLEventInfo, TLEventMap, TLEvents, TLHandle, TLTargetType } from '~types'

export class EditingShapeState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'editingShape'

  editingShape = {} as S

  onEnter = (info: { type: TLTargetType.Shape; target: S; order?: number }) => {
    this.editingShape = info.target
    this.app.setEditingShape(info.target)
  }

  onExit = () => {
    this.app.setEditingShape(undefined)
  }

  onPointerDown = (info: TLEventInfo<S>) => {
    switch (info.type) {
      case TLTargetType.Shape: {
        if (info.target === this.editingShape) return
        this.tool.transition('idle', info)
        break
      }
      case TLTargetType.Bounds: {
        break
      }
      case TLTargetType.Handle: {
        break
      }
      case TLTargetType.Canvas: {
        if (!info.order) {
          this.tool.transition('idle', info)
        }
        break
      }
    }
  }

  // onWheel: TLEvents<S>['wheel'] = (info, e) => {
  //   this.onPointerMove(info, e)
  // }

  // onPointerMove: TLEvents<S>['pointer'] = () => {
  //   const { currentPoint, originPoint } = this.app.inputs
  //   if (Vec.dist(currentPoint, originPoint) > 5) {
  //     this.tool.transition('translating')
  //   }
  // }

  // onPointerUp: TLEvents<S>['pointer'] = () => {
  //   this.app.setSelectedShapes([])
  //   this.tool.transition('idle')
  // }

  // onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
  //   this.tool.transition('pinching', { info, event })
  // }
}

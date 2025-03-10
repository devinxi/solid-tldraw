import { TLShape, TLApp, TLSelectTool, TLToolState } from '~lib'
import { TLEventMap, TLEvents, TLShortcut, TLTargetType } from '~types'
import { PointUtils } from '~utils'

export class IdleState<
  S extends TLShape,
  K extends TLEventMap,
  R extends TLApp<S, K>,
  P extends TLSelectTool<S, K, R>
> extends TLToolState<S, K, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLEventMap, TLApp>[] = [
    {
      keys: ['delete', 'backspace'],
      fn: app => app.api.deleteShapes(),
    },
  ]

  onEnter = (info: { fromId: string } & any) => {
    if (info.fromId === 'editing') {
      this.onPointerDown(info as any, {} as any)
    }
  }

  onExit = () => {
    this.app.setHoveredShape(undefined)
  }

  onPointerEnter: TLEvents<S>['pointer'] = info => {
    if (info.order) return

    switch (info.type) {
      case TLTargetType.Shape: {
        this.app.setHoveredShape(info.shape.id)
        break
      }
      case TLTargetType.Selection: {
        if (!(info.handle === 'background' || info.handle === 'center')) {
          this.tool.transition('hoveringSelectionHandle', info)
        }
        break
      }
    }
  }

  onPointerDown: TLEvents<S>['pointer'] = (info, event) => {
    const {
      selectedShapes,
      inputs: { ctrlKey },
    } = this.app

    // Holding ctrlKey should ignore shapes
    if (ctrlKey) {
      this.tool.transition('pointingCanvas')
      return
    }

    switch (info.type) {
      case TLTargetType.Selection: {
        switch (info.handle) {
          case 'center': {
            break
          }
          case 'background': {
            this.tool.transition('pointingBoundsBackground')
            break
          }
          case 'rotate': {
            this.tool.transition('pointingRotateHandle')
            break
          }
          default: {
            this.tool.transition('pointingResizeHandle', info)
          }
        }
        break
      }
      case TLTargetType.Shape: {
        if (selectedShapes.has(info.shape)) {
          this.tool.transition('pointingSelectedShape', info)
        } else {
          const { selectionBounds, inputs } = this.app
          if (selectionBounds && PointUtils.pointInBounds(inputs.currentPoint, selectionBounds)) {
            this.tool.transition('pointingShapeBehindBounds', info)
          } else {
            this.tool.transition('pointingShape', info)
          }
        }
        break
      }
      case TLTargetType.Handle: {
        this.tool.transition('pointingHandle', info)
        break
      }
      case TLTargetType.Canvas: {
        this.tool.transition('pointingCanvas')
        break
      }
    }
  }

  onPointerLeave: TLEvents<S>['pointer'] = info => {
    if (info.order) return

    if (info.type === TLTargetType.Shape) {
      if (this.app.hoveredId) {
        this.app.setHoveredShape(undefined)
      }
    }
  }

  onPinchStart: TLEvents<S>['pinch'] = (info, event) => {
    this.tool.transition('pinching', { info, event })
  }

  onDoubleClick: TLEvents<S>['pointer'] = info => {
    if (info.order) return

    if (this.app.selectedShapesArray.length !== 1) return
    const selectedShape = this.app.selectedShapesArray[0]
    if (!selectedShape.isEditable) return

    switch (info.type) {
      case TLTargetType.Shape: {
        this.tool.transition('editingShape', info)
        break
      }
      case TLTargetType.Selection: {
        if (this.app.selectedShapesArray.length === 1) {
          this.tool.transition('editingShape', {
            type: TLTargetType.Shape,
            target: selectedShape,
          })
        }
        break
      }
    }
  }

  onKeyDown: TLEvents<S>['keyboard'] = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        if (this.app.selectedIds.size) {
          this.app.setSelectedShapes([])
        }
        break
      }
    }
  }
}

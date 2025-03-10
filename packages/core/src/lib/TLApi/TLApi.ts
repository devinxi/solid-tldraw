import type { TLApp, TLPage, TLShapeModel, TLShape } from '~lib'
import type { TLEventMap } from '~types'
import { BoundsUtils } from '~utils'

export class TLApi<S extends TLShape = TLShape, K extends TLEventMap = TLEventMap> {
  #app: TLApp<S, K>

  constructor(app: TLApp<S, K>) {
    this.#app = app
  }

  /**
   * Set the current page.
   *
   * @param page The new current page or page id.
   */
  changePage = (page: string | TLPage<S, K>): this => {
    this.#app.setCurrentPage(page)
    return this
  }

  /**
   * Set the hovered shape.
   *
   * @param shape The new hovered shape or shape id.
   */
  hoverShape = (shape: string | S | undefined): this => {
    this.#app.setHoveredShape(shape)
    return this
  }

  /**
   * Create one or more shapes on the current page.
   *
   * @param shapes The new shape instances or serialized shapes.
   */
  createShapes = (...shapes: S[] | TLShapeModel[]): this => {
    this.#app.createShapes(shapes)
    return this
  }

  /**
   * Update one or more shapes on the current page.
   *
   * @param shapes The serialized shape changes to apply.
   */
  updateShapes = <T extends S>(...shapes: ({ id: string } & Partial<T['props']>)[]): this => {
    this.#app.updateShapes(shapes)
    return this
  }

  /**
   * Delete one or more shapes from the current page.
   *
   * @param shapes The shapes or shape ids to delete.
   */
  deleteShapes = (...shapes: S[] | string[]): this => {
    this.#app.deleteShapes(shapes.length ? shapes : this.#app.selectedShapesArray)
    return this
  }

  /**
   * Select one or more shapes on the current page.
   *
   * @param shapes The shapes or shape ids to select.
   */
  selectShapes = (...shapes: S[] | string[]): this => {
    this.#app.setSelectedShapes(shapes)
    return this
  }

  /**
   * Deselect one or more selected shapes on the current page.
   *
   * @param ids The shapes or shape ids to deselect.
   */
  deselectShapes = (...shapes: S[] | string[]): this => {
    const ids =
      typeof shapes[0] === 'string' ? (shapes as string[]) : (shapes as S[]).map(shape => shape.id)
    this.#app.setSelectedShapes(
      this.#app.selectedShapesArray.filter(shape => !ids.includes(shape.id))
    )
    return this
  }

  /** Select all shapes on the current page. */
  selectAll = (): this => {
    this.#app.setSelectedShapes(this.#app.currentPage.shapes)
    return this
  }

  /** Deselect all shapes on the current page. */
  deselectAll = (): this => {
    this.#app.setSelectedShapes([])
    return this
  }

  /** Zoom the camera in. */
  zoomIn = (): this => {
    this.#app.viewport.zoomIn()
    return this
  }

  /** Zoom the camera out. */
  zoomOut = (): this => {
    this.#app.viewport.zoomOut()
    return this
  }

  /** Reset the camera to 100%. */
  resetZoom = (): this => {
    this.#app.viewport.resetZoom()
    return this
  }

  /** Zoom to fit all of the current page's shapes in the viewport. */
  zoomToFit = (): this => {
    const { shapes } = this.#app.currentPage
    if (shapes.length === 0) return this
    const commonBounds = BoundsUtils.getCommonBounds(shapes.map(shape => shape.bounds))
    this.#app.viewport.zoomToBounds(commonBounds)
    return this
  }

  /** Zoom to fit the current selection in the viewport. */
  zoomToSelection = (): this => {
    const { selectionBounds } = this.#app
    if (!selectionBounds) return this
    this.#app.viewport.zoomToBounds(selectionBounds)
    return this
  }

  toggleGrid = (): this => {
    const { settings } = this.#app
    settings.update({ showGrid: !settings.showGrid })
    return this
  }

  toggleToolLock = (): this => {
    const { settings } = this.#app
    settings.update({ showGrid: !settings.isToolLocked })
    return this
  }

  save = () => {
    this.#app.save()
    return this
  }

  saveAs = () => {
    this.#app.save()
    return this
  }
}

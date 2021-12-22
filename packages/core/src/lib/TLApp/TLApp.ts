/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vec } from '@tldraw/vec'
import { action, computed, makeObservable, observable } from 'mobx'
import { BoundsUtils, KeyUtils } from '~utils'
import {
  TLSelectTool,
  TLInputs,
  TLPage,
  TLViewport,
  TLShape,
  TLToolConstructor,
  TLShapeConstructor,
  TLCustomProps,
} from '~lib'
import type {
  TLBounds,
  TLEvents,
  TLSubscription,
  TLSubscriptionEventInfo,
  TLSubscriptionEventName,
  TLCallback,
  TLShortcut,
  TLEventMap,
  TLStateEvents,
  TLShapeModel,
  TLPageModel,
  TLDocumentModel,
  TLAppStateModel,
} from '~types'
import { TLHistory } from '../TLHistory'
import { TLSettings } from '../TLSettings'
import { TLRootState } from '../TLState'
import { TLApi } from '~lib/TLApi'
import { TLCursors } from '~lib/TLCursors'

// export interface TLSnapshot {
//   currentPageId: string
//   selectedIds: string[]
//   pages: Record<string, TLPageModel>
//   shapes: Record<string, TLShapeModel>
// }

export class TLApp<
  S extends TLShape = TLShape,
  K extends TLEventMap = TLEventMap
> extends TLRootState<S, K> {
  constructor(
    id: string,
    document?: TLDocumentModel,
    appState?: TLAppStateModel,
    Shapes?: TLShapeConstructor<S>[],
    Tools?: TLToolConstructor<S, K>[]
  ) {
    super()
    this.history.pause()
    if (this.states && this.states.length > 0) {
      this.registerStates(this.states)
      const initialId = this.initial ?? this.states[0].id
      const state = this.children.get(initialId)
      if (state) {
        this.currentState = state
        this.currentState?._events.onEnter({ fromId: 'initial' })
      }
    }
    if (Shapes) this.registerShapes(Shapes)
    if (Tools) this.registerTools(Tools)
    // Load document
    if (document) {
      // this.history.deserialize(document)
      this.loadDocumentModel(document)
    } else {
      this.loadDocumentModel({
        id: this.id,
        pages: [
          {
            name: 'Page',
            id: 'page1',
            shapes: [],
            bindings: [],
          },
        ],
      })
    }
    // Set app state
    this.appState = {
      currentPageId: this.document.pages[0].id,
      selectedIds: [],
      ...appState,
    }

    this.history.resume()
    const ownShortcuts: TLShortcut<S, K>[] = [
      {
        keys: 'mod+shift+g',
        fn: () => this.api.toggleGrid(),
      },
      {
        keys: 'shift+0',
        fn: () => this.api.resetZoom(),
      },
      {
        keys: 'mod+-',
        fn: () => this.api.zoomToSelection(),
      },
      {
        keys: 'mod+-',
        fn: () => this.api.zoomOut(),
      },
      {
        keys: 'mod+=',
        fn: () => this.api.zoomIn(),
      },
      {
        keys: 'mod+z',
        fn: () => this.undo(),
      },
      {
        keys: 'mod+shift+z',
        fn: () => this.redo(),
      },
      {
        keys: '[',
        fn: () => this.sendBackward(),
      },
      {
        keys: 'shift+[',
        fn: () => this.sendToBack(),
      },
      {
        keys: ']',
        fn: () => this.bringForward(),
      },
      {
        keys: 'shift+]',
        fn: () => this.bringToFront(),
      },
      {
        keys: 'mod+a',
        fn: () => {
          const { selectedTool } = this
          if (selectedTool.currentState.id !== 'idle') return
          if (selectedTool.id !== 'select') {
            this.selectTool('select')
          }
          this.api.selectAll()
        },
      },
      {
        keys: 'mod+s',
        fn: () => {
          this.save()
          this.notify('save', null)
        },
      },
      {
        keys: 'mod+shift+s',
        fn: () => {
          this.saveAs()
          this.notify('saveAs', null)
        },
      },
      {
        keys: 'escape',
        fn: () => {
          if (this.currentState.id !== 'select') {
            if (this.currentState.currentState.id === 'idle') {
              this.selectTool('select')
            }
          }
        },
      },
    ]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shortcuts = (this.constructor['shortcuts'] || []) as TLShortcut<S, K>[]
    this._disposables.push(
      ...[...ownShortcuts, ...shortcuts].map(({ keys, fn }) => {
        return KeyUtils.registerShortcut(keys, e => {
          fn(this, this, e)
        })
      })
    )
    this.api = new TLApi(this)
    makeObservable(this)
    this.notify('mount', null)
  }

  static states: TLToolConstructor<any, any>[] = [TLSelectTool]
  static initial = 'select'

  readonly api: TLApi<S, K>
  readonly inputs = new TLInputs<K>()
  readonly cursors = new TLCursors()
  readonly viewport = new TLViewport()
  readonly settings = new TLSettings()

  /* --------------------- History -------------------- */

  history = new TLHistory<S, K>(this)

  persist = this.history.persist

  undo = this.history.undo

  redo = this.history.redo

  saving = false // used to capture direct mutations as part of the history stack

  saveState = () => {
    if (this.history.isPaused) return
    this.saving = true
    requestAnimationFrame(() => {
      if (this.saving) {
        this.persist()
        this.saving = false
      }
    })
  }

  /* -------------------------------------------------- */
  /*                      App State                     */
  /* -------------------------------------------------- */

  @observable appState: TLAppStateModel

  @action loadAppState(appState: TLAppStateModel): this {
    this.appState = appState
    return this
  }

  /* -------------------------------------------------- */
  /*                      Document                      */
  /* -------------------------------------------------- */

  @observable document: TLDocumentModel = {
    id: this.id,
    pages: [
      {
        name: 'Page',
        id: 'page1',
        shapes: [],
        bindings: [],
      },
    ],
  }

  @action loadDocumentModel(document: TLDocumentModel): this {
    this.document = document
    this.pages.clear()
    this.addPages(this.document.pages)
    this.document.pages.forEach(pageModel => {
      const page = this.getPageById(pageModel.id)
      const { shapes } = pageModel
      pageModel.shapes = []
      shapes.forEach(props => {
        const ShapeClass = this.getShapeConstructor(props.type)
        const shape = new ShapeClass(this, pageModel.id, props.id)
        pageModel.shapes.push({ ...shape.defaultProps, ...props })
        page.shapes.set(props.id, shape)
      })
    })
    return this
  }

  load = (): this => {
    // todo
    this.notify('load', null)
    return this
  }

  save = (): this => {
    // todo
    this.notify('save', null)
    return this
  }

  saveAs = (): this => {
    // todo
    this.notify('saveAs', null)
    return this
  }

  @computed get serialized(): TLDocumentModel {
    return this.document
  }

  /* ---------------------- Pages --------------------- */

  @observable pages = new Map<string, TLPage<S, K>>([])

  @action addPages(pages: TLPageModel[]): this {
    this.document.pages.concat(pages)
    pages.forEach(props => this.pages.set(props.id, new TLPage(this, props.id)))
    this.persist()
    return this
  }

  @action removePages(pages: TLPageModel[]): this {
    this.document.pages = this.document.pages.filter(page => !pages.includes(page))
    pages.forEach(page => this.pages.delete(page.id))
    this.persist()
    return this
  }

  @computed get currentPageId() {
    return this.appState.currentPageId
  }

  @computed get currentPage(): TLPage<S, K> {
    const page = this.pages.get(this.currentPageId)
    if (!page) throw Error(`Could not the current page: ${this.currentPageId}`)
    return page
  }

  getPageById = (pageId: string): TLPage<S, K> => {
    const page = this.pages.get(pageId)
    if (!page) throw Error(`Could not find a page: ${pageId}.`)
    return page
  }

  @action setCurrentPage(page: string | TLPage<S, K>): this {
    this.appState.currentPageId = typeof page === 'string' ? page : page.id
    return this
  }

  /* --------------------- Shapes --------------------- */

  getShapeById = (id: string, pageId = this.currentPage.id) => {
    const shape = this.getPageById(pageId).shapes.get(id)
    if (!shape) throw Error(`Could not find that shape: ${id} on page ${pageId}`)
    return shape
  }

  @action readonly createShapes = (shapes: S[] | TLShapeModel[]): this => {
    this.currentPage.addShapes(...shapes)
    return this
  }

  @action updateShapes = (shapes: ({ id: string } & Partial<TLCustomProps<S>>)[]): this => {
    shapes.forEach(shape => this.getShapeById(shape.id).update(shape))
    return this
  }

  @action readonly deleteShapes = (shapes: S[] | string[]): this => {
    if (shapes.length === 0) return this

    let ids: Set<string>
    if (typeof shapes[0] === 'string') {
      ids = new Set(shapes as string[])
    } else {
      ids = new Set((shapes as S[]).map(shape => shape.id))
    }
    this.setSelectedShapes(this.selectedShapesArray.filter(shape => !ids.has(shape.id)))
    this.currentPage.removeShapes(...shapes)
    this.persist()
    return this
  }

  bringForward = (shapes: S[] | string[] = this.selectedShapesArray): this => {
    if (shapes.length > 0) this.currentPage.bringForward(shapes)
    return this
  }

  sendBackward = (shapes: S[] | string[] = this.selectedShapesArray): this => {
    if (shapes.length > 0) this.currentPage.sendBackward(shapes)
    return this
  }

  sendToBack = (shapes: S[] | string[] = this.selectedShapesArray): this => {
    if (shapes.length > 0) this.currentPage.sendToBack(shapes)
    return this
  }

  bringToFront = (shapes: S[] | string[] = this.selectedShapesArray): this => {
    if (shapes.length > 0) this.currentPage.bringToFront(shapes)
    return this
  }

  /* ---------------------- Tools --------------------- */

  @computed get selectedTool() {
    return this.currentState
  }

  selectTool = this.transition

  registerTools = this.registerStates

  /* ------------------ Editing Shape ----------------- */

  @observable editingId?: string

  @computed get editingShape(): S | undefined {
    const { editingId, currentPage } = this
    return editingId ? currentPage.shapes.get(editingId) : undefined
  }

  @action readonly setEditingShape = (shape?: string | S): this => {
    this.editingId = typeof shape === 'string' ? shape : shape?.id
    return this
  }

  /* ------------------ Hovered Shape ----------------- */

  @observable hoveredId?: string

  @computed get hoveredShape(): S | undefined {
    const { hoveredId, currentPage } = this
    return hoveredId ? currentPage.shapes.get(hoveredId) : undefined
  }

  @action readonly setHoveredShape = (shape?: string | S): this => {
    this.hoveredId = typeof shape === 'string' ? shape : shape?.id
    return this
  }

  /* ----------------- Selected Shapes ---------------- */

  @observable selectedIds: Set<string> = new Set()

  @observable selectedShapes: Set<S> = new Set()

  @observable selectionRotation = 0

  @computed get selectedShapesArray() {
    const { selectedShapes, selectedTool } = this
    const stateId = selectedTool.id
    if (stateId !== 'select') return []
    return Array.from(selectedShapes.values())
  }

  @action setSelectedShapes = (shapes: S[] | string[]): this => {
    const { selectedIds, selectedShapes } = this
    selectedIds.clear()
    selectedShapes.clear()
    if (shapes[0] && typeof shapes[0] === 'string') {
      shapes.forEach(s => selectedIds.add(s as string))
    } else {
      shapes.forEach(s => selectedIds.add((s as S).id))
    }
    const newSelectedShapes = Array.from(selectedIds).map(id => this.getShapeById(id))
    newSelectedShapes.forEach(s => selectedShapes.add(s))
    if (newSelectedShapes.length === 1) {
      this.selectionRotation = newSelectedShapes[0].props.rotation ?? 0
    } else {
      this.selectionRotation = 0
    }
    this.appState.selectedIds = Array.from(selectedIds.values())
    return this
  }

  @action setSelectionRotation(radians: number) {
    this.selectionRotation = radians
  }

  /* ------------------ Erasing Shape ----------------- */

  @observable erasingIds: Set<string> = new Set()

  @observable erasingShapes: Set<S> = new Set()

  @computed get erasingShapesArray() {
    return Array.from(this.erasingShapes.values())
  }

  @action readonly setErasingShapes = (shapes: S[] | string[]): this => {
    const { erasingIds, erasingShapes } = this
    erasingIds.clear()
    erasingShapes.clear()
    if (shapes[0] && typeof shapes[0] === 'string') {
      shapes.forEach(s => erasingIds.add(s as string))
    } else {
      shapes.forEach(s => erasingIds.add((s as S).id))
    }
    const newErasingShapes = Array.from(erasingIds).map(id => this.getShapeById(id))
    newErasingShapes.forEach(s => erasingShapes.add(s))
    return this
  }

  /* ---------------------- Brush --------------------- */

  @observable brush?: TLBounds

  @action readonly setBrush = (brush?: TLBounds): this => {
    this.brush = brush
    return this
  }

  /* --------------------- Camera --------------------- */

  @action setCamera = (point?: number[], zoom?: number): this => {
    this.viewport.update({ point, zoom })
    return this
  }

  readonly getPagePoint = (point: number[]): number[] => {
    const { camera } = this.viewport
    return Vec.sub(Vec.div(point, camera.zoom), camera.point)
  }

  readonly getScreenPoint = (point: number[]): number[] => {
    const { camera } = this.viewport
    return Vec.mul(Vec.add(point, camera.point), camera.zoom)
  }

  /* --------------------- Display -------------------- */

  @computed get shapes(): S[] {
    const {
      currentPage: { shapes },
    } = this

    return Array.from(shapes.values())
  }

  @computed get shapesInViewport(): S[] {
    const {
      currentPage,
      viewport: { currentView },
    } = this

    const results: S[] = []

    currentPage.shapes.forEach(shape => {
      if (
        shape.parentId === currentPage.id &&
        (shape.stayMounted ||
          BoundsUtils.boundsContain(currentView, shape.rotatedBounds) ||
          BoundsUtils.boundsCollide(currentView, shape.rotatedBounds))
      )
        results.push(shape)
    })

    return results
  }

  @computed get selectionBounds(): TLBounds | undefined {
    const { selectedShapesArray } = this
    if (selectedShapesArray.length === 0) return undefined
    if (selectedShapesArray.length === 1) {
      return { ...selectedShapesArray[0].bounds, rotation: selectedShapesArray[0].props.rotation }
    }
    const bounds = BoundsUtils.getCommonBounds(
      this.selectedShapesArray.map(shape => shape.rotatedBounds)
    )
    return bounds
  }

  @computed get showSelection() {
    const { selectedShapesArray } = this
    return (
      this.isIn('select') &&
      ((selectedShapesArray.length === 1 && !selectedShapesArray[0]?.hideSelection) ||
        selectedShapesArray.length > 1)
    )
  }

  @computed get showSelectionDetail() {
    return (
      this.isIn('select') &&
      this.selectedShapes.size > 0 &&
      !this.selectedShapesArray.every(shape => shape.hideSelectionDetail)
    )
  }

  @computed get showSelectionRotation() {
    return (
      this.showSelectionDetail && this.isInAny('select.rotating', 'select.pointingRotateHandle')
    )
  }

  @computed get showContextBar() {
    const { selectedShapesArray } = this
    return (
      this.isInAny('select.idle', 'select.hoveringSelectionHandle') &&
      selectedShapesArray.length > 0 &&
      !selectedShapesArray.every(shape => shape.hideContextBar)
    )
  }

  @computed get showRotateHandles() {
    const { selectedShapesArray } = this
    return (
      this.isInAny(
        'select.idle',
        'select.hoveringSelectionHandle',
        'select.pointingRotateHandle',
        'select.pointingResizeHandle'
      ) &&
      selectedShapesArray.length > 0 &&
      !selectedShapesArray.every(shape => shape.hideRotateHandle)
    )
  }

  @computed get showResizeHandles() {
    const { selectedShapesArray } = this
    return (
      this.isInAny(
        'select.idle',
        'select.hoveringSelectionHandle',
        'select.pointingRotateHandle',
        'select.pointingResizeHandle'
      ) &&
      selectedShapesArray.length > 0 &&
      !selectedShapesArray.every(shape => shape.hideResizeHandles)
    )
  }

  /* ------------------ Shape Classes ----------------- */

  Shapes = new Map<string, TLShapeConstructor<S>>()

  registerShapes = (Shapes: TLShapeConstructor<S>[]) => {
    Shapes.forEach(Shape => this.Shapes.set(Shape.id, Shape))
  }

  deregisterShapes = (Shapes: TLShapeConstructor<S>[]) => {
    Shapes.forEach(Shape => this.Shapes.delete(Shape.id))
  }

  getShapeConstructor = (type: string): TLShapeConstructor<S> => {
    if (!type) throw Error('No shape type provided.')
    const Shape = this.Shapes.get(type)
    if (!Shape) throw Error(`Could not find shape class for ${type}`)
    return Shape
  }

  /* ------------------ Subscriptions ----------------- */

  private subscriptions = new Set<TLSubscription<S, K, this, any>>([])

  subscribe = <E extends TLSubscriptionEventName>(
    event: E,
    callback: TLCallback<S, K, this, E>
  ) => {
    if (callback === undefined) throw Error('Callback is required.')
    const subscription: TLSubscription<S, K, this, E> = { event, callback }
    this.subscriptions.add(subscription)
    return () => this.unsubscribe(subscription)
  }

  unsubscribe = (subscription: TLSubscription<S, K, this, any>) => {
    this.subscriptions.delete(subscription)
    return this
  }

  notify = <E extends TLSubscriptionEventName>(event: E, info: TLSubscriptionEventInfo<E>) => {
    this.subscriptions.forEach(subscription => {
      if (subscription.event === event) {
        subscription.callback(this, info)
      }
    })
    return this
  }

  /* ----------------- Event Handlers ----------------- */

  readonly onTransition: TLStateEvents<S, K>['onTransition'] = () => {
    this.settings.update({ isToolLocked: false })
  }

  readonly onWheel: TLEvents<S, K>['wheel'] = (info, e) => {
    this.viewport.panCamera(info.delta)
    this.inputs.onWheel([...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5], e)
  }

  readonly onPointerDown: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerDown(
        [...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5],
        e as K['pointer']
      )
    }
  }

  readonly onPointerUp: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerUp(
        [...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5],
        e as K['pointer']
      )
    }
  }

  readonly onPointerMove: TLEvents<S, K>['pointer'] = (info, e) => {
    if ('clientX' in e) {
      this.inputs.onPointerMove([...this.viewport.getPagePoint([e.clientX, e.clientY]), 0.5], e)
    }
  }

  readonly onKeyDown: TLEvents<S, K>['keyboard'] = (info, e) => {
    this.inputs.onKeyDown(e)
  }

  readonly onKeyUp: TLEvents<S, K>['keyboard'] = (info, e) => {
    this.inputs.onKeyUp(e)
  }

  readonly onPinchStart: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinchStart([...this.viewport.getPagePoint(info.point), 0.5], e)
  }

  readonly onPinch: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinch([...this.viewport.getPagePoint(info.point), 0.5], e)
  }

  readonly onPinchEnd: TLEvents<S, K>['pinch'] = (info, e) => {
    this.inputs.onPinchEnd([...this.viewport.getPagePoint(info.point), 0.5], e)
  }
}

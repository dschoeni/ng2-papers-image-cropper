/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */

import * as import0 from '../../src/ImageCropperComponent';
import * as import1 from '@angular/core/src/change_detection/change_detection_util';
import * as import2 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/render/api';
import * as import5 from '@angular/core/src/metadata/view';
import * as import6 from '@angular/core/src/linker/view_type';
import * as import7 from '@angular/core/src/change_detection/constants';
import * as import8 from '@angular/core/src/linker/component_factory';
import * as import9 from '@angular/core/src/linker/query_list';
import * as import10 from '@angular/core/src/linker/element_ref';
export class Wrapper_ImageCropperComponent {
  /*private*/ _eventHandler:Function;
  context:import0.ImageCropperComponent;
  /*private*/ _changed:boolean;
  /*private*/ _changes:{[key: string]:any};
  /*private*/ _expr_0:any;
  /*private*/ _expr_1:any;
  /*private*/ _expr_2:any;
  constructor() {
    this._changed = false;
    this._changes = {};
    this.context = new import0.ImageCropperComponent();
    this._expr_0 = import1.UNINITIALIZED;
    this._expr_1 = import1.UNINITIALIZED;
    this._expr_2 = import1.UNINITIALIZED;
  }
  ngOnDetach(view:import2.AppView<any>,componentView:import2.AppView<any>,el:any):void {
  }
  ngOnDestroy():void {
  }
  check_image(currValue:any,throwOnChange:boolean,forceUpdate:boolean):void {
    if ((forceUpdate || import3.checkBinding(throwOnChange,this._expr_0,currValue))) {
      this._changed = true;
      this.context.image = currValue;
      this._changes['image'] = new import1.SimpleChange(this._expr_0,currValue);
      this._expr_0 = currValue;
    }
  }
  check_gridAlpha(currValue:any,throwOnChange:boolean,forceUpdate:boolean):void {
    if ((forceUpdate || import3.checkBinding(throwOnChange,this._expr_1,currValue))) {
      this._changed = true;
      this.context.gridAlpha = currValue;
      this._changes['gridAlpha'] = new import1.SimpleChange(this._expr_1,currValue);
      this._expr_1 = currValue;
    }
  }
  check_showGrid(currValue:any,throwOnChange:boolean,forceUpdate:boolean):void {
    if ((forceUpdate || import3.checkBinding(throwOnChange,this._expr_2,currValue))) {
      this._changed = true;
      this.context.showGrid = currValue;
      this._changes['showGrid'] = new import1.SimpleChange(this._expr_2,currValue);
      this._expr_2 = currValue;
    }
  }
  ngDoCheck(view:import2.AppView<any>,el:any,throwOnChange:boolean):boolean {
    var changed:any = this._changed;
    this._changed = false;
    if (!throwOnChange) { if (changed) {
      this.context.ngOnChanges(this._changes);
      this._changes = {};
    } }
    return changed;
  }
  checkHost(view:import2.AppView<any>,componentView:import2.AppView<any>,el:any,throwOnChange:boolean):void {
  }
  handleEvent(eventName:string,$event:any):boolean {
    var result:boolean = true;
    return result;
  }
  subscribe(view:import2.AppView<any>,_eventHandler:any):void {
    this._eventHandler = _eventHandler;
  }
}
var renderType_ImageCropperComponent_Host:import4.RenderComponentType = import3.createRenderComponentType('',0,import5.ViewEncapsulation.None,([] as any[]),{});
class View_ImageCropperComponent_Host0 extends import2.AppView<any> {
  _el_0:any;
  compView_0:import2.AppView<import0.ImageCropperComponent>;
  _ImageCropperComponent_0_3:Wrapper_ImageCropperComponent;
  constructor(viewUtils:import3.ViewUtils,parentView:import2.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_ImageCropperComponent_Host0,renderType_ImageCropperComponent_Host,import6.ViewType.HOST,viewUtils,parentView,parentIndex,parentElement,import7.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import8.ComponentRef<any> {
    this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer,'image-cropper',import3.EMPTY_INLINE_ARRAY,rootSelector,(null as any));
    this.compView_0 = new View_ImageCropperComponent0(this.viewUtils,this,0,this._el_0);
    this._ImageCropperComponent_0_3 = new Wrapper_ImageCropperComponent();
    this.compView_0.create(this._ImageCropperComponent_0_3.context);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return new import8.ComponentRef_<any>(0,this,this._el_0,this._ImageCropperComponent_0_3.context);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import0.ImageCropperComponent) && (0 === requestNodeIndex))) { return this._ImageCropperComponent_0_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._ImageCropperComponent_0_3.ngDoCheck(this,this._el_0,throwOnChange);
    this.compView_0.internalDetectChanges(throwOnChange);
    if (!throwOnChange) { if ((this.numberOfChecks === 0)) { this._ImageCropperComponent_0_3.context.ngAfterViewInit(); } }
  }
  destroyInternal():void {
    this.compView_0.destroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
export const ImageCropperComponentNgFactory:import8.ComponentFactory<import0.ImageCropperComponent> = new import8.ComponentFactory<import0.ImageCropperComponent>('image-cropper',View_ImageCropperComponent_Host0,import0.ImageCropperComponent);
const styles_ImageCropperComponent:any[] = ['h1[_ngcontent-%COMP%] {\n            color: blue;\n        }'];
var renderType_ImageCropperComponent:import4.RenderComponentType = import3.createRenderComponentType('',0,import5.ViewEncapsulation.Emulated,styles_ImageCropperComponent,{});
export class View_ImageCropperComponent0 extends import2.AppView<import0.ImageCropperComponent> {
  _viewQuery_cropCanvas_0:import9.QueryList<any>;
  _el_0:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import2.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_ImageCropperComponent0,renderType_ImageCropperComponent,import6.ViewType.COMPONENT,viewUtils,parentView,parentIndex,parentElement,import7.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import8.ComponentRef<any> {
    const parentRenderNode:any = this.renderer.createViewRoot(this.parentElement);
    this._viewQuery_cropCanvas_0 = new import9.QueryList<any>();
    this._el_0 = import3.createRenderElement(this.renderer,parentRenderNode,'canvas',new import3.InlineArray2(2,'style','background: transparent;'),(null as any));
    var disposable_0:Function = import3.subscribeToRenderElement(this,this._el_0,new import3.InlineArray8(8,'panend',(null as any),'panmove',(null as any),'pinchmove',(null as any),'pinchend',(null as any)),this.eventHandler(this.handleEvent_0));
    this._viewQuery_cropCanvas_0.reset([new import10.ElementRef(this._el_0)]);
    this.context.canvas = this._viewQuery_cropCanvas_0.first;
    this.init((null as any),((<any>this.renderer).directRenderer? (null as any): [this._el_0]),[disposable_0]);
    return (null as any);
  }
  handleEvent_0(eventName:string,$event:any):boolean {
    this.markPathToRootAsCheckOnce();
    var result:boolean = true;
    if ((eventName == 'panend')) {
      const pd_sub_0:any = ((<any>this.context.onPanEnd($event)) !== false);
      result = (pd_sub_0 && result);
    }
    if ((eventName == 'panmove')) {
      const pd_sub_1:any = ((<any>this.context.onPan($event)) !== false);
      result = (pd_sub_1 && result);
    }
    if ((eventName == 'pinchmove')) {
      const pd_sub_2:any = ((<any>this.context.onPinch($event)) !== false);
      result = (pd_sub_2 && result);
    }
    if ((eventName == 'pinchend')) {
      const pd_sub_3:any = ((<any>this.context.onPinchEnd($event)) !== false);
      result = (pd_sub_3 && result);
    }
    return result;
  }
}
/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
 /* tslint:disable */

import * as import0 from '@angular/core/src/linker/ng_module_factory';
import * as import1 from '../../src/ImageCropper.module';
import * as import2 from '@angular/core/src/di/injector';
class ImageCropperModuleInjector extends import0.NgModuleInjector<import1.ImageCropperModule> {
  _ImageCropperModule_0:import1.ImageCropperModule;
  constructor(parent:import2.Injector) {
    super(parent,([] as any[]),([] as any[]));
  }
  createInternal():import1.ImageCropperModule {
    this._ImageCropperModule_0 = new import1.ImageCropperModule();
    return this._ImageCropperModule_0;
  }
  getInternal(token:any,notFoundResult:any):any {
    if ((token === import1.ImageCropperModule)) { return this._ImageCropperModule_0; }
    return notFoundResult;
  }
  destroyInternal():void {
  }
}
export const ImageCropperModuleNgFactory:import0.NgModuleFactory<import1.ImageCropperModule> = new import0.NgModuleFactory(ImageCropperModuleInjector,import1.ImageCropperModule);
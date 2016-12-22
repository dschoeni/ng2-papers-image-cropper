import { Component, ViewChild } from '@angular/core';
import { ImageCropperComponent } from 'ng2-papers-image-cropper';

@Component({
    selector: 'webpack-app',
    template: `<div>
                   <h1>Image Cropper</h1>

                   <button (click)="reset()">Reset Cropper</button>
                   <br>

                   <br>
                   <button (click)="zoomIn()">Zoom In</button>
                   <button (click)="zoomOut()">Zoom Out</button>
                   <button (click)="toggleGrid()">Toggle Grid</button>

                   <button (click)="rotateLeft()">Rotate Left</button>
                   <button (click)="rotateRight()">Rotate Right</button>
                   <br>

                   <button (click)="getSmallCrop()">Sized</button>
                   <button (click)="getOriginalCrop()">Original</button>
                   <button (click)="getBlob()">Blob (Sized)</button>
                   <button (click)="getOriginalBlob()">Blob (Original)</button>
                   <br>

                   <button (click)="setType('image/jpeg')">JPEG</button>
                   <button (click)="setType('image/png')">PNG</button>

                   <input id="custom-input" type="file" (change)="fileChangeListener($event)">
                   <div style="width: 500px; height: 500px; background-color: black;">
                    <image-cropper #imageCropper [image]="data" [showGrid]="showGrid"></image-cropper>
                   </div>
                   <img *ngIf="dataSrc" [src]="dataSrc">
               </div>`
})

export class AppComponent {

    @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

    private dataSrc;
    private showGrid: boolean = true;

    fileChangeListener($event) {
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let fileReader: FileReader = new FileReader();

        this.imageCropper.setExportQuality(1);
        this.imageCropper.setExportType('image/jpeg');

        fileReader.onloadend = (loadEvent:any) => {
            if (loadEvent.target) {
              image.src = loadEvent.target.result;
              this.imageCropper.setImage(image);
            }
        };

        if (file) {
          fileReader.readAsDataURL(file);
        }
    }

    getSmallCrop() {
      let smallCrop = this.imageCropper.getSizedCrop(200, 200);
      this.dataSrc = smallCrop;
    }

    setType(type: string) {
      this.imageCropper.setExportType(type);
    }

    zoomIn() {
      this.imageCropper.zoomCenter(1.25);
    }

    zoomOut() {
      this.imageCropper.zoomCenter(0.75);
    }

    reset() {
      this.imageCropper.reset();
    }

    rotateLeft() {
      this.imageCropper.rotateLeft();
    }

    rotateRight() {
      this.imageCropper.rotateRight();
    }

    toggleGrid() {
      this.showGrid = !this.showGrid;
    }

    getOriginalCrop() {
      let originalCrop = this.imageCropper.getOriginalCrop();
      this.dataSrc = originalCrop;
    }

    getBlob() {
      this.imageCropper.getSizedBlob(200, 200).then((blob) => {
        let reader = new FileReader();

        reader.addEventListener("load", (evt) => {
          this.dataSrc = (evt.target as any).result;
        });

        reader.readAsDataURL(blob);
      });
    }

    getOriginalBlob() {
      this.imageCropper.getOriginalCropAsBlob().then((blob) => {
        let reader = new FileReader();

        reader.addEventListener("load", (evt) => {
          this.dataSrc = (evt.target as any).result;
        });

        reader.readAsDataURL(blob);
      });
    }

}

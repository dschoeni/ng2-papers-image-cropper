import { Component, ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import 'blueimp-canvas-to-blob'; // toBlob polyfill
import 'hammerjs';

declare function require(moduleName: string): any;
let EXIF = require('exif-js');

@Component({
    selector: 'image-cropper',
    styles: [`
       h1 {
            color: blue;
        }
    `],
    template: `<canvas (panend)="onPanEnd($event)" (panmove)="onPan($event)" (pinchmove)="onPinch($event)" (pinchend)="onPinchEnd($event)" #cropCanvas style="background: transparent;"></canvas>`
})

export class ImageCropperComponent implements AfterViewInit, OnChanges {

    private context: CanvasRenderingContext2D;

    @ViewChild('cropCanvas') canvas;
    @Input() image;

    @Input() gridAlpha: number = 0.1;
    @Input() showGrid: boolean = true;

    private exportQuality: number = 1;
    private exportType: string = 'image/jpeg';

    private canvasSize: number = 400;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private minOffsetX: number;
    private maxOffsetX: number;

    private minOffsetY: number;
    private maxOffsetY: number;

    private drawWidth: number;
    private drawHeight: number;

    private MAX_ZOOM_FACTOR: number = 5;
    private MIN_ZOOM_FACTOR: number = 1;

    public zoomFactor: number = 1;

    private pinchCenter: {x: number, y: number} = null;
    private pinchScale: {scale: number, initialZoomFactor: number} = null;

    private rotation: number = 0;

    private pinchObserver: Observer<any>;
    private panObserver: Observer<any>;

    private pinch: Observable<any>;
    private pan: Observable<any>;

    constructor() {
      this.pinch = Observable.create((observer) => {
        this.pinchObserver = observer;
      });

      this.pan = Observable.create((observer) => {
        this.panObserver = observer;
      });

      this.pinch.throttleTime(20).subscribe(event => {
        if (!this.pinchCenter) {
          this.pinchCenter = {x: event.center.x - event.target.offsetLeft, y: event.center.y - event.target.offsetTop};
          this.pinchScale = {scale: event.scale, initialZoomFactor: this.zoomFactor};
        }

        this.zoomAround(this.pinchScale.initialZoomFactor * event.scale, this.pinchCenter.x, this.pinchCenter.y);
      });

      this.pan.throttleTime(20).subscribe(event => {
        let offsetValues = this.determineOffsetValues(event);
        this.drawImage(offsetValues.x, offsetValues.y);
      });
    }

    ngOnChanges(changes) {
      if (this.image) {
        this.drawImage(this.offsetX, this.offsetY);
      }
    }

    ngAfterViewInit() {
      this.reset();
    }

    onPan(event: any): void {
      this.panObserver.next(event);
    }

    onPanEnd(event: any): void {
      let offsetValues = this.determineOffsetValues(event);

      // update offset values (they are allowed now)
      this.offsetX = offsetValues.x;
      this.offsetY = offsetValues.y;
    }

    onPinchEnd(event: any): void {
      this.pinchCenter = null;
      this.pinchScale = null;
    }

    onPinch(event: any): void {
      this.pinchObserver.next(event);
    }

    private determineOffsetValues(event: any) {
      let newOffsetX, newOffsetY;

      if (this.rotation === -90) {
        newOffsetX = this.quarantineOffsetX(this.offsetX + -1 * event.deltaY);
        newOffsetY = this.quarantineOffsetY(this.offsetY + event.deltaX);
      } else if (this.rotation === 90) {
        newOffsetX = this.quarantineOffsetX(this.offsetX + event.deltaY);
        newOffsetY = this.quarantineOffsetY(this.offsetY + -1 * event.deltaX);
      } else if (this.rotation === 180 || this.rotation === -180) {
        newOffsetX = this.quarantineOffsetX(this.offsetX + -1 * event.deltaX);
        newOffsetY = this.quarantineOffsetY(this.offsetY + -1 * event.deltaY);
      } else {
        newOffsetX = this.quarantineOffsetX(this.offsetX + event.deltaX);
        newOffsetY = this.quarantineOffsetY(this.offsetY + event.deltaY);
      }

      return {x: newOffsetX, y: newOffsetY};
    }

    private quarantineOffsetX(offsetX: number): number {
      if (offsetX <= this.minOffsetX) {
        return this.minOffsetX;
      } else if (offsetX >= this.maxOffsetX) {
        return this.maxOffsetX;
      }

      return offsetX;
    }

    private quarantineOffsetY(offsetY: number): number {
      if (offsetY <= this.minOffsetY) {
        return this.minOffsetY;
      } else if (offsetY >= this.maxOffsetY) {
        return this.maxOffsetY;
      }

      return offsetY;
    }

    zoomCenter(zoom: number): void {

      // determine center of image in canvas
      let preZoomCenterX = Math.min(this.canvasSize, this.drawWidth) / 2;
      let preZoomCenterY = Math.min(this.canvasSize, this.drawHeight) / 2;

      this.zoomAround(this.zoomFactor * zoom, preZoomCenterX, preZoomCenterY);

    }

    zoomAround(zoom: number, x: number, y: number): void {

      // calculate distances from center to edge of image
      let distanceX = -this.offsetX + x;
      let distanceY = -this.offsetY + y;

      // get ratios relative to size of image
      let ratioX = distanceX / this.drawWidth;
      let ratioY = distanceY / this.drawHeight;

      // zoom the image
      this.zoomFactor = Math.max(Math.min(zoom, this.MAX_ZOOM_FACTOR), this.MIN_ZOOM_FACTOR);
      this.determineBoundingBox();

      // calculate the new distance to center from edge of image
      let postDistanceX = ratioX * this.drawWidth;
      let postDistanceY = ratioY * this.drawHeight;

      // get the delta of the two distances
      let deltaX = postDistanceX - distanceX;
      let deltaY = postDistanceY - distanceY;

      // move the center point akin to the delta
      this.offsetX -= deltaX;
      this.offsetY -= deltaY;

      this.drawImage(this.offsetX, this.offsetY);

    }

    setImage(img: any) {
      if (!img) {
          throw 'Image is null. Check your Upload.';
      }

      this.image = img;

      this.determineBoundingBox();
      this.drawImage(this.offsetX, this.offsetY);

      // read rotation from EXIF and rotate accordingly
      EXIF.getData(this.image, {call: (img) => {
        let orientation = img.exifdata['Orientation'];
        // if no orientation is found, img has no EXIF

        if (!orientation) {
          return;
        }

        switch (orientation) {
          case 3:
            this.rotate(-90);
          case 6:
            this.rotate(90);
          case 8:
            this.rotate(-90);
        }

      }});

    }

    setExportQuality(exportQuality: number) {
      this.exportQuality = Math.max(Math.min(1, exportQuality), 0);
    }

    setExportType(type: string) {
      if (type !== 'image/png' && type !== 'image/jpeg') {
        throw 'Type must be either "image/png" or "image/jpeg"';
      }
      this.exportType = type;
    }

    getSizedCrop(width = this.drawWidth, height = this.drawHeight): string {
      let canvas = this.renderInCanvas(width, height) as any;
      return canvas.toDataURL(this.exportType, this.exportQuality);
    }

    getOriginalCrop(): string {
      let canvas = this.renderInCanvas(this.image.width, this.image.height);
      return canvas.toDataURL(this.exportType, this.exportQuality);
    }

    getSizedBlob(width = this.drawWidth, height = this.drawHeight): Promise<Blob> {
      let canvas = this.renderInCanvas(width, height) as any;
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, this.exportType, this.exportQuality);
      });
    }

    getOriginalCropAsBlob(): Promise<Blob> {
      let canvas = this.renderInCanvas(this.image.width, this.image.height) as any;
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, this.exportType, this.exportQuality);
      });
    }

    /**
     * reset - resets the cropper to its original state, without any image loaded
     *
     * @return {type}  description
     */
    reset() {
      let canvas = this.canvas.nativeElement;
      this.context = canvas.getContext("2d");

      // set canvas to fill parent
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      // set new size of canvas to match parent
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // reset image offset
      this.offsetX = 0;
      this.offsetY = 0;

      this.canvasSize = canvas.width;
    }

    rotateLeft() {
      this.rotate(this.rotation - 90);
    }

    rotateRight() {
      this.rotate(this.rotation + 90);
    }

    private rotate(degree: number) {
      this.rotation = this.normalizeAngle(degree);
      this.determineBoundingBox();
      this.drawImage(this.offsetX, this.offsetY);
    }

    private normalizeAngle(angle: number) {
      // reduce the angle
      angle = angle % 360;

      // force it to be the positive remainder, so that 0 <= angle < 360
      angle = (angle + 360) % 360;

      if (angle > 180) {
          angle -= 360;
      }

      return angle;
    }

    private renderInCanvas(width: number, height: number): HTMLCanvasElement {
      let canvas = document.createElement('canvas');
      let canvasContext = canvas.getContext('2d');

      let scale = Math.max(width, height) / this.canvasSize;

      canvas.width = this.canvasSize * scale;
      canvas.height = this.canvasSize * scale;

      canvasContext.drawImage(this.image, this.offsetX * scale, this.offsetY * scale, this.drawWidth * scale, this.drawHeight * scale);

      // create a new, rotated canvas
      let rotatedCanvas = document.createElement('canvas');
      let rotatedCanvasContext = rotatedCanvas.getContext('2d');

      rotatedCanvas.width = this.canvasSize * scale;
      rotatedCanvas.height = this.canvasSize * scale;

      rotatedCanvasContext.rotate(this.rotation * Math.PI / 180);

      if (this.rotation === 90) {
        rotatedCanvasContext.translate(0, -this.canvasSize * scale);
      } else if (this.rotation === -90) {
        rotatedCanvasContext.translate(-this.canvasSize * scale, 0);
      } else if (this.rotation === -180 || this.rotation === 180) {
        rotatedCanvasContext.translate(-this.canvasSize * scale, -this.canvasSize * scale);
      }

      rotatedCanvasContext.drawImage(canvas, 0, 0);

      return rotatedCanvas;
    }

    private determineBoundingBox() {
      let width = this.image.width;
      let height = this.image.height;

      this.drawWidth = width;
      this.drawHeight = height;

      if (width > height) {
        this.drawHeight = this.canvasSize * this.zoomFactor;
        this.drawWidth = this.canvasSize * this.zoomFactor * (width / height);
      } else if (height > width) {
        this.drawHeight = this.canvasSize * this.zoomFactor  * (height / width);
        this.drawWidth = this.canvasSize * this.zoomFactor;
      } else {
        this.drawHeight = this.canvasSize * this.zoomFactor;
        this.drawWidth = this.canvasSize * this.zoomFactor;
      }

      this.minOffsetX = this.canvasSize - this.drawWidth;
      this.maxOffsetX = 0;
      this.minOffsetY = this.canvasSize - this.drawHeight;
      this.maxOffsetY = 0;
    }

    private drawGrid() {
      let gridPadding = 0;

      for (let x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
        this.context.moveTo(0.5 + x + gridPadding, gridPadding);
        this.context.lineTo(0.5 + x + gridPadding, this.canvasSize + gridPadding);
      }

      for (let x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
        this.context.moveTo(gridPadding, 0.5 + x + gridPadding);
        this.context.lineTo(this.canvasSize + gridPadding, 0.5 + x + gridPadding);
      }

      this.context.strokeStyle = 'rgba(0,0,0,' + this.gridAlpha + ')';
      this.context.lineWidth = 2;
      this.context.stroke();

    }

    private drawImage(x: number, y: number) {

      this.context.save();
      this.context.rotate(this.rotation * Math.PI / 180);

      if (this.rotation === 90) {
        this.context.translate(0, -this.canvasSize);
      } else if (this.rotation === -90) {
        this.context.translate(-this.canvasSize, 0);
      } else if (this.rotation === -180 || this.rotation === 180) {
        this.context.translate(-this.canvasSize, -this.canvasSize);
      }

      this.context.drawImage(this.image, x, y, this.drawWidth, this.drawHeight);
      this.context.restore();

      if (this.showGrid) {
        this.drawGrid();
      }
    }

}

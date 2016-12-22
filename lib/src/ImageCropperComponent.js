"use strict";
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
require('blueimp-canvas-to-blob'); // toBlob polyfill
require('hammerjs');
var EXIF = require('exif-js');
var ImageCropperComponent = (function () {
    function ImageCropperComponent() {
        var _this = this;
        this.gridAlpha = 0.1;
        this.showGrid = true;
        this.exportQuality = 1;
        this.exportType = 'image/jpeg';
        this.canvasSize = 400;
        this.offsetX = 0;
        this.offsetY = 0;
        this.MAX_ZOOM_FACTOR = 5;
        this.MIN_ZOOM_FACTOR = 1;
        this.zoomFactor = 1;
        this.pinchCenter = null;
        this.pinchScale = null;
        this.rotation = 0;
        this.pinch = rxjs_1.Observable.create(function (observer) {
            _this.pinchObserver = observer;
        });
        this.pan = rxjs_1.Observable.create(function (observer) {
            _this.panObserver = observer;
        });
        this.pinch.throttleTime(20).subscribe(function (event) {
            if (!_this.pinchCenter) {
                _this.pinchCenter = { x: event.center.x - event.target.offsetLeft, y: event.center.y - event.target.offsetTop };
                _this.pinchScale = { scale: event.scale, initialZoomFactor: _this.zoomFactor };
            }
            _this.zoomAround(_this.pinchScale.initialZoomFactor * event.scale, _this.pinchCenter.x, _this.pinchCenter.y);
        });
        this.pan.throttleTime(20).subscribe(function (event) {
            var offsetValues = _this.determineOffsetValues(event);
            _this.drawImage(offsetValues.x, offsetValues.y);
        });
    }
    ImageCropperComponent.prototype.ngOnChanges = function (changes) {
        if (this.image) {
            this.drawImage(this.offsetX, this.offsetY);
        }
    };
    ImageCropperComponent.prototype.ngAfterViewInit = function () {
        this.reset();
    };
    ImageCropperComponent.prototype.onPan = function (event) {
        this.panObserver.next(event);
    };
    ImageCropperComponent.prototype.onPanEnd = function (event) {
        var offsetValues = this.determineOffsetValues(event);
        // update offset values (they are allowed now)
        this.offsetX = offsetValues.x;
        this.offsetY = offsetValues.y;
    };
    ImageCropperComponent.prototype.onPinchEnd = function (event) {
        this.pinchCenter = null;
        this.pinchScale = null;
    };
    ImageCropperComponent.prototype.onPinch = function (event) {
        this.pinchObserver.next(event);
    };
    ImageCropperComponent.prototype.determineOffsetValues = function (event) {
        var newOffsetX, newOffsetY;
        if (this.rotation === -90) {
            newOffsetX = this.quarantineOffsetX(this.offsetX + -1 * event.deltaY);
            newOffsetY = this.quarantineOffsetY(this.offsetY + event.deltaX);
        }
        else if (this.rotation === 90) {
            newOffsetX = this.quarantineOffsetX(this.offsetX + event.deltaY);
            newOffsetY = this.quarantineOffsetY(this.offsetY + -1 * event.deltaX);
        }
        else if (this.rotation === 180 || this.rotation === -180) {
            newOffsetX = this.quarantineOffsetX(this.offsetX + -1 * event.deltaX);
            newOffsetY = this.quarantineOffsetY(this.offsetY + -1 * event.deltaY);
        }
        else {
            newOffsetX = this.quarantineOffsetX(this.offsetX + event.deltaX);
            newOffsetY = this.quarantineOffsetY(this.offsetY + event.deltaY);
        }
        return { x: newOffsetX, y: newOffsetY };
    };
    ImageCropperComponent.prototype.quarantineOffsetX = function (offsetX) {
        if (offsetX <= this.minOffsetX) {
            return this.minOffsetX;
        }
        else if (offsetX >= this.maxOffsetX) {
            return this.maxOffsetX;
        }
        return offsetX;
    };
    ImageCropperComponent.prototype.quarantineOffsetY = function (offsetY) {
        if (offsetY <= this.minOffsetY) {
            return this.minOffsetY;
        }
        else if (offsetY >= this.maxOffsetY) {
            return this.maxOffsetY;
        }
        return offsetY;
    };
    ImageCropperComponent.prototype.zoomCenter = function (zoom) {
        // determine center of image in canvas
        var preZoomCenterX = Math.min(this.canvasSize, this.drawWidth) / 2;
        var preZoomCenterY = Math.min(this.canvasSize, this.drawHeight) / 2;
        this.zoomAround(this.zoomFactor * zoom, preZoomCenterX, preZoomCenterY);
    };
    ImageCropperComponent.prototype.zoomAround = function (zoom, x, y) {
        // calculate distances from center to edge of image
        var distanceX = -this.offsetX + x;
        var distanceY = -this.offsetY + y;
        // get ratios relative to size of image
        var ratioX = distanceX / this.drawWidth;
        var ratioY = distanceY / this.drawHeight;
        // zoom the image
        this.zoomFactor = Math.max(Math.min(zoom, this.MAX_ZOOM_FACTOR), this.MIN_ZOOM_FACTOR);
        this.determineBoundingBox();
        // calculate the new distance to center from edge of image
        var postDistanceX = ratioX * this.drawWidth;
        var postDistanceY = ratioY * this.drawHeight;
        // get the delta of the two distances
        var deltaX = postDistanceX - distanceX;
        var deltaY = postDistanceY - distanceY;
        // move the center point akin to the delta
        this.offsetX -= deltaX;
        this.offsetY -= deltaY;
        this.drawImage(this.offsetX, this.offsetY);
    };
    ImageCropperComponent.prototype.setImage = function (img) {
        var _this = this;
        if (!img) {
            throw 'Image is null. Check your Upload.';
        }
        this.image = img;
        this.determineBoundingBox();
        this.drawImage(this.offsetX, this.offsetY);
        // read rotation from EXIF and rotate accordingly
        EXIF.getData(this.image, { call: function (img) {
                var orientation = img.exifdata['Orientation'];
                // if no orientation is found, img has no EXIF
                if (!orientation) {
                    return;
                }
                switch (orientation) {
                    case 3:
                        _this.rotate(-90);
                    case 6:
                        _this.rotate(90);
                    case 8:
                        _this.rotate(-90);
                }
            } });
    };
    ImageCropperComponent.prototype.setExportQuality = function (exportQuality) {
        this.exportQuality = Math.max(Math.min(1, exportQuality), 0);
    };
    ImageCropperComponent.prototype.setExportType = function (type) {
        if (type !== 'image/png' && type !== 'image/jpeg') {
            throw 'Type must be either "image/png" or "image/jpeg"';
        }
        this.exportType = type;
    };
    ImageCropperComponent.prototype.getSizedCrop = function (width, height) {
        if (width === void 0) { width = this.drawWidth; }
        if (height === void 0) { height = this.drawHeight; }
        var canvas = this.renderInCanvas(width, height);
        return canvas.toDataURL(this.exportType, this.exportQuality);
    };
    ImageCropperComponent.prototype.getOriginalCrop = function () {
        var canvas = this.renderInCanvas(this.image.width, this.image.height);
        return canvas.toDataURL(this.exportType, this.exportQuality);
    };
    ImageCropperComponent.prototype.getSizedBlob = function (width, height) {
        var _this = this;
        if (width === void 0) { width = this.drawWidth; }
        if (height === void 0) { height = this.drawHeight; }
        var canvas = this.renderInCanvas(width, height);
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
                resolve(blob);
            }, _this.exportType, _this.exportQuality);
        });
    };
    ImageCropperComponent.prototype.getOriginalCropAsBlob = function () {
        var _this = this;
        var canvas = this.renderInCanvas(this.image.width, this.image.height);
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
                resolve(blob);
            }, _this.exportType, _this.exportQuality);
        });
    };
    /**
     * reset - resets the cropper to its original state, without any image loaded
     *
     * @return {type}  description
     */
    ImageCropperComponent.prototype.reset = function () {
        var canvas = this.canvas.nativeElement;
        this.context = canvas.getContext("2d");
        // set canvas to fill parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // set new size of canvas to match parent
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // reset image offset
        this.offsetX = 0;
        this.offsetY = 0;
        this.canvasSize = canvas.width;
    };
    ImageCropperComponent.prototype.rotateLeft = function () {
        this.rotate(this.rotation - 90);
    };
    ImageCropperComponent.prototype.rotateRight = function () {
        this.rotate(this.rotation + 90);
    };
    ImageCropperComponent.prototype.rotate = function (degree) {
        this.rotation = this.normalizeAngle(degree);
        this.determineBoundingBox();
        this.drawImage(this.offsetX, this.offsetY);
    };
    ImageCropperComponent.prototype.normalizeAngle = function (angle) {
        // reduce the angle
        angle = angle % 360;
        // force it to be the positive remainder, so that 0 <= angle < 360
        angle = (angle + 360) % 360;
        if (angle > 180) {
            angle -= 360;
        }
        return angle;
    };
    ImageCropperComponent.prototype.renderInCanvas = function (width, height) {
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');
        var scale = Math.max(width, height) / this.canvasSize;
        canvas.width = this.canvasSize * scale;
        canvas.height = this.canvasSize * scale;
        canvasContext.drawImage(this.image, this.offsetX * scale, this.offsetY * scale, this.drawWidth * scale, this.drawHeight * scale);
        // create a new, rotated canvas
        var rotatedCanvas = document.createElement('canvas');
        var rotatedCanvasContext = rotatedCanvas.getContext('2d');
        rotatedCanvas.width = this.canvasSize * scale;
        rotatedCanvas.height = this.canvasSize * scale;
        rotatedCanvasContext.rotate(this.rotation * Math.PI / 180);
        if (this.rotation === 90) {
            rotatedCanvasContext.translate(0, -this.canvasSize * scale);
        }
        else if (this.rotation === -90) {
            rotatedCanvasContext.translate(-this.canvasSize * scale, 0);
        }
        else if (this.rotation === -180 || this.rotation === 180) {
            rotatedCanvasContext.translate(-this.canvasSize * scale, -this.canvasSize * scale);
        }
        rotatedCanvasContext.drawImage(canvas, 0, 0);
        return rotatedCanvas;
    };
    ImageCropperComponent.prototype.determineBoundingBox = function () {
        var width = this.image.width;
        var height = this.image.height;
        this.drawWidth = width;
        this.drawHeight = height;
        if (width > height) {
            this.drawHeight = this.canvasSize * this.zoomFactor;
            this.drawWidth = this.canvasSize * this.zoomFactor * (width / height);
        }
        else if (height > width) {
            this.drawHeight = this.canvasSize * this.zoomFactor * (height / width);
            this.drawWidth = this.canvasSize * this.zoomFactor;
        }
        else {
            this.drawHeight = this.canvasSize * this.zoomFactor;
            this.drawWidth = this.canvasSize * this.zoomFactor;
        }
        this.minOffsetX = this.canvasSize - this.drawWidth;
        this.maxOffsetX = 0;
        this.minOffsetY = this.canvasSize - this.drawHeight;
        this.maxOffsetY = 0;
    };
    ImageCropperComponent.prototype.drawGrid = function () {
        var gridPadding = 0;
        for (var x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
            this.context.moveTo(0.5 + x + gridPadding, gridPadding);
            this.context.lineTo(0.5 + x + gridPadding, this.canvasSize + gridPadding);
        }
        for (var x = 0; x <= this.canvasSize; x += (this.canvasSize - 1) / 3) {
            this.context.moveTo(gridPadding, 0.5 + x + gridPadding);
            this.context.lineTo(this.canvasSize + gridPadding, 0.5 + x + gridPadding);
        }
        this.context.strokeStyle = 'rgba(0,0,0,' + this.gridAlpha + ')';
        this.context.lineWidth = 2;
        this.context.stroke();
    };
    ImageCropperComponent.prototype.drawImage = function (x, y) {
        this.context.save();
        this.context.rotate(this.rotation * Math.PI / 180);
        if (this.rotation === 90) {
            this.context.translate(0, -this.canvasSize);
        }
        else if (this.rotation === -90) {
            this.context.translate(-this.canvasSize, 0);
        }
        else if (this.rotation === -180 || this.rotation === 180) {
            this.context.translate(-this.canvasSize, -this.canvasSize);
        }
        this.context.drawImage(this.image, x, y, this.drawWidth, this.drawHeight);
        this.context.restore();
        if (this.showGrid) {
            this.drawGrid();
        }
    };
    ImageCropperComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'image-cropper',
                    styles: ["\n       h1 {\n            color: blue;\n        }\n    "],
                    template: "<canvas (panend)=\"onPanEnd($event)\" (panmove)=\"onPan($event)\" (pinchmove)=\"onPinch($event)\" (pinchend)=\"onPinchEnd($event)\" #cropCanvas style=\"background: transparent;\"></canvas>"
                },] },
    ];
    /** @nocollapse */
    ImageCropperComponent.ctorParameters = [];
    ImageCropperComponent.propDecorators = {
        'canvas': [{ type: core_1.ViewChild, args: ['cropCanvas',] },],
        'image': [{ type: core_1.Input },],
        'gridAlpha': [{ type: core_1.Input },],
        'showGrid': [{ type: core_1.Input },],
    };
    return ImageCropperComponent;
}());
exports.ImageCropperComponent = ImageCropperComponent;

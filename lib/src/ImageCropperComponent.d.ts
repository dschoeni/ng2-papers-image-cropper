import { AfterViewInit, OnChanges } from '@angular/core';
import 'blueimp-canvas-to-blob';
import 'hammerjs';
export declare class ImageCropperComponent implements AfterViewInit, OnChanges {
    private context;
    canvas: any;
    image: any;
    gridAlpha: number;
    showGrid: boolean;
    private exportQuality;
    private exportType;
    private canvasSize;
    private offsetX;
    private offsetY;
    private minOffsetX;
    private maxOffsetX;
    private minOffsetY;
    private maxOffsetY;
    private drawWidth;
    private drawHeight;
    private MAX_ZOOM_FACTOR;
    private MIN_ZOOM_FACTOR;
    zoomFactor: number;
    private pinchCenter;
    private pinchScale;
    private rotation;
    private pinchObserver;
    private panObserver;
    private pinch;
    private pan;
    constructor();
    ngOnChanges(changes: any): void;
    ngAfterViewInit(): void;
    onPan(event: any): void;
    onPanEnd(event: any): void;
    onPinchEnd(event: any): void;
    onPinch(event: any): void;
    private determineOffsetValues(event);
    private quarantineOffsetX(offsetX);
    private quarantineOffsetY(offsetY);
    zoomCenter(zoom: number): void;
    zoomAround(zoom: number, x: number, y: number): void;
    setImage(img: any): void;
    setExportQuality(exportQuality: number): void;
    setExportType(type: string): void;
    getSizedCrop(width?: number, height?: number): string;
    getOriginalCrop(): string;
    getSizedBlob(width?: number, height?: number): Promise<Blob>;
    getOriginalCropAsBlob(): Promise<Blob>;
    /**
     * reset - resets the cropper to its original state, without any image loaded
     *
     * @return {type}  description
     */
    reset(): void;
    rotateLeft(): void;
    rotateRight(): void;
    private rotate(degree);
    private normalizeAngle(angle);
    private renderInCanvas(width, height);
    private determineBoundingBox();
    private drawGrid();
    private drawImage(x, y);
}

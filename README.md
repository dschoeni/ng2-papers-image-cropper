
# ng2-papers-image-cropper
This library provides an instagram inspired, fixed aspect-ratio imagecropper where the image can be manipulated using touch/mouse input. It is compatible with Ionic2.

# Add to your Project

    import { ImageCropperModule } from 'ng2-papers-image-cropper';

Then you can use the directive like so:

    <image-cropper #imageCropper [image]="data" [showGrid]="showGrid"></image-cropper>

Should you require access to the cropper in your code, include it as follows:

    import { ImageCropperComponent } from 'ng2-papers-image-cropper';

    ...

    @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

Thats it!

# Installation

Clone the repository and do:

    npm install
    npm link

# Building the library & watch it

    npm run develop
    
# Build the library for production

    npm run build

## Install the Webpack Example & start it

    cd examples/webpack
    npm link ng2-papers-image-cropper
    npm install
    npm start

Then access [http://localhost:8080](http://localhost:8080)
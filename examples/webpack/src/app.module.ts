import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageCropperModule } from 'ng2-papers-image-cropper';
import { AppComponent } from './app.component';

@NgModule({
 imports: [
   ImageCropperModule,
   BrowserModule
 ],
 declarations: [
   AppComponent
 ],
 bootstrap: [
   AppComponent
 ]
})

export class AppModule { }

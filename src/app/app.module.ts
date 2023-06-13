import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasBoxComponent } from './components/canvas-box/canvas-box.component';
import { HomePageMainBoxComponent } from './components/home-page-main-box/home-page-main-box.component';
import { ContentBoxComponent } from './components/content-box/content-box.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasBoxComponent,
    HomePageMainBoxComponent,
    ContentBoxComponent,
    HomePageComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

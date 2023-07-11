import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  headModelLoaded = false;
  textModelLoaded = false;
  imgLoaded = false;
  getLoadItems() {
    return [this.headModelLoaded, this.imgLoaded, this.textModelLoaded];
  }
  setHeadModelLoaded() {
    this.headModelLoaded = true;
    this.checkLoaded();
  }
  setImgLoaded() {
    this.imgLoaded = true;
    this.checkLoaded();
  }
  setTextModelLoaded() {
    this.textModelLoaded = true;
    this.checkLoaded();
  }
  checkLoaded() {
    for (const item of this.getLoadItems()) {
      if (!item) {
        return;
      }
    }
    this.loaded.emit(true);
  }
}

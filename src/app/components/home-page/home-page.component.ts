import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { set } from 'animejs';
import { LoaderService } from 'src/app/services/loader.service';

import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  @ViewChild('backgroundImage') backgroundImage!: ElementRef;
  loaded = false;
  isMobile = false;
  constructor(
    private loadingService: LoaderService,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if the User Agent contains keywords indicating a mobile platform
    this.isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(
        userAgent
      );
    this.loadingService.loaded.subscribe((loaded) => {
      setTimeout(() => {
        this.loaded = loaded;
      }, 1000);
    });
  }

  ngAfterViewInit(): void {
    console.log(this.backgroundImage);
    if (this.backgroundImage.nativeElement.complete) {
      this.loadingService.setImgLoaded();
    }
    this.renderer.listen(this.backgroundImage.nativeElement, 'load', () => {
      this.loadingService.setImgLoaded();
    });
  }
  closeNotModal() {
    this.isMobile = false;
  }
}

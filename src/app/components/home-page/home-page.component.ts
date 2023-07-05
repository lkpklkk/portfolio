import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { set } from 'animejs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  @ViewChild('backgroundImage') backgroundImage!: ElementRef;
  loaded = false;
  constructor(
    private loadingService: LoaderService,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
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
}

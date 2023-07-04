import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
    this.loadingService.loadingScreenFaded.subscribe((loaded) => {
      this.loaded = loaded;
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

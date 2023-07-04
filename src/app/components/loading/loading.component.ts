import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import anime from 'animejs';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements AfterViewInit {
  @ViewChild('scribblePath') scribblePath!: ElementRef;
  loaingTexts = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
  loadingTextIndex = 0;
  loadingUp = true;
  drawingUp = true;
  loadingText = 'Loading';
  pathLength!: number;
  length = 0;
  strokeDasharray!: string;
  distancePerFrame = 30;
  loadingCounter = 0;
  stopAnimation = false;
  constructor(
    private hostRef: ElementRef,
    private loadingService: LoaderService
  ) {}
  ngAfterViewInit(): void {
    this.pathLength = this.scribblePath.nativeElement.getTotalLength();
    this.drawPath();
    this.loadingService.loaded.subscribe((loaded) => {
      if (loaded) {
        this.fadeOut();
      }
    });
  }

  drawPath() {
    requestAnimationFrame(() => {
      if (this.length >= this.pathLength) {
        this.drawingUp = false;
      }
      if (this.length <= 0) {
        this.drawingUp = true;
      }
      if (this.stopAnimation) {
        return;
      }
      this.drawPath();
    });
    this.loadingCounter++;
    if (this.loadingCounter % 60 === 0) {
      this.loadingCounter = 0;
      if (this.loadingTextIndex >= this.loaingTexts.length - 1) {
        this.loadingUp = false;
      } else if (this.loadingTextIndex <= 0) {
        this.loadingUp = true;
      }
      if (this.loadingUp) {
        this.loadingTextIndex++;
      } else {
        this.loadingTextIndex--;
      }
      this.loadingText = this.loaingTexts[this.loadingTextIndex];
    }
    if (this.drawingUp) {
      this.length += this.distancePerFrame;
    } else {
      this.length -= this.distancePerFrame;
    }
    this.strokeDasharray = `${this.length} ${this.pathLength}`;
  }

  fadeOut() {
    anime({
      targets: this.hostRef.nativeElement,
      opacity: 0,
      scale: 2,
      duration: 1000,
      easing: 'easeOutQuad',
      complete: () => {
        this.stopAnimation = true;
        this.loadingService.loadingScreenFade();
      },
    });
  }
}

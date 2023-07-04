import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { set } from 'animejs';
import anime from 'animejs';
@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css'],
})
export class AboutMeComponent implements AfterViewInit {
  @ViewChild('centerImageOverlay') centerImageOverlay!: ElementRef;
  @ViewChild('mouseCircle') mouseCircle!: ElementRef;
  @ViewChild('bottomRightTextOverlay') bottomRightTextOverlay!: ElementRef;
  mouseTop = '0px';
  mouseLeft = '0px';
  mouseX = 0;
  mouseY = 0;
  centerImageClipX = 0;
  centerImageClipY = 0;
  bottomRightTextClipX = 0;
  bottomRightTextClipY = 0;
  delay = 10;
  revisedMousePosX = 0;
  revisedMousePosY = 0;
  revisedCenterImageClipX = 0;
  revisedCenterImageClipY = 0;
  revisedbottomRightTextClipX = 0;
  revisedbottomRightTextClipY = 0;

  mouseIsHere = false;

  constructor(private hostRef: ElementRef) {}
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    this.delayMouseFollow();
    this.mouseIsHere = true;
  }
  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.mouseIsHere = false;
    this.bottomRightTextOverlay.nativeElement.style.setProperty('--x', `0px`);
    this.bottomRightTextOverlay.nativeElement.style.setProperty('--y', `0px`);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.mouseIsHere) {
      return;
    }

    const centerCircleBoundingClientRect =
      this.centerImageOverlay.nativeElement.getBoundingClientRect();
    const bottomRightTextBoundingClientRect =
      this.bottomRightTextOverlay.nativeElement.getBoundingClientRect();
    const hostBoundingClientRect =
      this.hostRef.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - hostBoundingClientRect.left;
    this.mouseY = event.clientY - hostBoundingClientRect.top;
    this.centerImageClipX = event.clientX - centerCircleBoundingClientRect.left;
    this.centerImageClipY = event.clientY - centerCircleBoundingClientRect.top;
    this.bottomRightTextClipX =
      event.clientX - bottomRightTextBoundingClientRect.left;
    this.bottomRightTextClipY =
      event.clientY - bottomRightTextBoundingClientRect.top;
  }
  ngAfterViewInit() {
    this.delayMouseFollow();
  }
  delayMouseFollow() {
    requestAnimationFrame(() => {
      if (!this.mouseIsHere) {
        this.centerImageClipX = 0;
        this.centerImageClipY = 0;
        this.centerImageOverlay.nativeElement.style.setProperty(
          '--x',
          `${this.revisedCenterImageClipX}px`
        );
        this.centerImageOverlay.nativeElement.style.setProperty(
          '--y',
          `${this.revisedCenterImageClipY}px`
        );
        return;
      }
      this.delayMouseFollow();
    });
    this.mouseCircle?.nativeElement.style.setProperty(
      'rotate',
      `${Math.random() * 360}deg`
    );
    this.revisedMousePosX += (this.mouseX - this.revisedMousePosX) / this.delay;
    this.revisedMousePosY += (this.mouseY - this.revisedMousePosY) / this.delay;
    this.revisedCenterImageClipX +=
      (this.centerImageClipX - this.revisedCenterImageClipX) / this.delay;
    this.revisedCenterImageClipY +=
      (this.centerImageClipY - this.revisedCenterImageClipY) / this.delay;
    this.revisedbottomRightTextClipX +=
      (this.bottomRightTextClipX - this.revisedbottomRightTextClipX) /
      this.delay;
    this.revisedbottomRightTextClipY +=
      (this.bottomRightTextClipY - this.revisedbottomRightTextClipY) /
      this.delay;

    this.mouseTop = this.revisedMousePosY + 'px';
    this.mouseLeft = this.revisedMousePosX + 'px';

    this.centerImageOverlay.nativeElement.style.setProperty(
      '--x',
      `${this.revisedCenterImageClipX}px`
    );
    this.centerImageOverlay.nativeElement.style.setProperty(
      '--y',
      `${this.revisedCenterImageClipY}px`
    );

    this.bottomRightTextOverlay.nativeElement.style.setProperty(
      '--x',
      `${this.revisedbottomRightTextClipX}px`
    );
    this.bottomRightTextOverlay.nativeElement.style.setProperty(
      '--y',
      `${this.revisedbottomRightTextClipY}px`
    );
  }
}

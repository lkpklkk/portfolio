import { Component, ElementRef, ViewChild } from '@angular/core';
import anime from 'animejs';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @ViewChild('sideLogoLeft') sideLogoLeft!: ElementRef;
  @ViewChild('sideLogoRight') sideLogoRight!: ElementRef;
  leftSpinningAnimation!: anime.AnimeInstance;
  rightSpinningAnimation!: anime.AnimeInstance;
  hovered = [];
  startLogosSpinning() {
    this.leftSpinningAnimation = anime({
      targets: this.sideLogoLeft.nativeElement,
      rotate: 360,
      duration: 5000,
      easing: 'linear',
      loop: true,
    });
    this.rightSpinningAnimation = anime({
      targets: this.sideLogoRight.nativeElement,
      rotate: 360,
      duration: 5000,
      easing: 'linear',
      loop: true,
    });
  }
  ngAfterViewInit() {
    this.startLogosSpinning();
    this.sideLogoLeft.nativeElement.addEventListener('mouseenter', () => {
      let curDegree = this.leftSpinningAnimation.progress;
      this.leftSpinningAnimation.pause();
      console.log(curDegree);
      anime({
        targets: this.sideLogoLeft.nativeElement,
        rotate: (curDegree / 100) * 360 + 20,
        duration: 80,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        loop: true,
      });
    });
    this.sideLogoLeft.nativeElement.addEventListener('mouseleave', () => {
      this.leftSpinningAnimation.play();
    });
    this.sideLogoRight.nativeElement.addEventListener('mouseenter', () => {
      let curDegree = this.rightSpinningAnimation.progress;
      this.rightSpinningAnimation.pause();
      console.log(curDegree);
      anime({
        targets: this.sideLogoRight.nativeElement,
        rotate: (curDegree / 100) * 360 + 20,
        duration: 80,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        loop: true,
      });
    });
    this.sideLogoRight.nativeElement.addEventListener('mouseleave', () => {
      this.rightSpinningAnimation.play();
    });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // check if mouse is on the left or right logo
  }
}

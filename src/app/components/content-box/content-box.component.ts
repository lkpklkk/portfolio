import anime from 'animejs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationCorrelatorService } from 'src/app/services/animation-correlator.service';
import { ContentTag } from 'src/app/contentTag';
import * as THREE from 'three';

@Component({
  selector: 'app-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.css'],
})
export class ContentBoxComponent {
  // exposed for html
  contentTag = ContentTag;
  @ViewChild('aboutMe') aboutMe!: ElementRef;
  @ViewChild('projects') projects!: ElementRef;
  @ViewChild('credits') credits!: ElementRef;
  @ViewChild('neutral') neutral!: ElementRef;

  animationTargets!: { [key in ContentTag]: ElementRef };
  currentView: ContentTag = ContentTag.NOCONTENT;
  nocontentRandString: string = THREE.MathUtils.generateUUID();
  constructor(private animator: AnimationCorrelatorService) {}

  startAnimation(
    contentTag: ContentTag,
    translateX: number,
    translateY: number,
    transitionIn: boolean
  ) {
    translateX *= window.innerWidth / 10;
    translateY *= window.innerWidth / 10;

    if (transitionIn) {
      this.currentView = contentTag;
      console.log(
        this.animationTargets[contentTag].nativeElement.children[0].children
      );
      anime({
        targets:
          this.animationTargets[contentTag].nativeElement.children[0].children,
        translateX: [translateX, 0],
        translateY: [translateY, 0],
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(2, .5)',
        delay: anime.stagger(20),
      });
    } else {
      anime({
        targets:
          this.animationTargets[contentTag].nativeElement.children[0].children,
        translateX: [0, translateX],
        translateY: [0, translateY],
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 500,
        easing: 'easeOutQuad',
        delay: anime.stagger(20),
        complete: () => {
          if (this.currentView == contentTag)
            this.currentView = ContentTag.NOCONTENT;
        },
      });
    }
  }

  ngAfterViewInit() {
    this.animationTargets = {
      [ContentTag.NOCONTENT]: this.neutral,
      [ContentTag.ABOUTME]: this.aboutMe,
      [ContentTag.PROJECTS]: this.projects,
      [ContentTag.CREDITS]: this.credits,
    };
    console.log(this.animationTargets);
    this.animator.animationDataUploaded.subscribe((data) => {
      this.startAnimation(
        data.contentTag,
        data.translateX,
        data.translateY,
        data.transitionIn
      );
    });
    this.animate();
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    let dateTime = new Date();
    this.nocontentRandString = dateTime.toString();
  }
}

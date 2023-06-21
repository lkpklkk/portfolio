import anime from 'animejs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationCorrelatorService } from 'src/app/animation-correlator.service';
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

  constructor(private animator: AnimationCorrelatorService) {}

  startAnimation(
    contentTag: ContentTag,
    cameraPosition: THREE.Vector3,
    targetPosition: THREE.Vector3,
    transitionIn: boolean
  ) {
    targetPosition = targetPosition.clone().normalize();
    cameraPosition = cameraPosition.clone().normalize();
    let direction = new THREE.Vector2(
      targetPosition.x - cameraPosition.x,
      targetPosition.y - cameraPosition.y
    );
    //
    // Convert the direction to a 2D angle
    let angle = Math.atan2(direction.y, direction.x);
    let translateX = Math.cos(angle) * 20;
    let translateY = -Math.sin(angle) * 20;
    if (cameraPosition.z < 0) {
      translateX = -translateX;
    }
    if (transitionIn) {
      console.log('transition into' + contentTag);
      this.currentView = contentTag;
      anime({
        targets: this.animationTargets[contentTag].nativeElement,
        translateX: [translateX, 0],
        translateY: [translateY, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInOutQuad',
      });
    } else {
      console.log('transition out' + contentTag);
      anime({
        targets: this.animationTargets[contentTag].nativeElement,
        translateX: [0, translateX],
        translateY: [0, translateY],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInOutQuad',
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
        data.cameraPosition,
        data.targetPosition,
        data.transitionIn
      );
    });
  }
}

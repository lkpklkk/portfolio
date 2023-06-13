import { Component } from '@angular/core';
import { AnimationCorrelatorService } from 'src/app/animation-correlator.service';
import { ContentTag } from 'src/app/contentTag';
import * as THREE from 'three';
@Component({
  selector: 'app-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: ['./content-box.component.css'],
})
export class ContentBoxComponent {
  displayNotSelected = true;
  displayAboutMe = false;
  displayProjects = false;
  displayedContent: string = 'asd';
  constructor(private animator: AnimationCorrelatorService) {}
  contentTag: ContentTag = ContentTag.NOCONTENT;
  vectorCameraToTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  ngOnInit() {
    this.animator.animationDataUploaded.subscribe((data) => {
      this.contentTag = data.contentTag;
      switch (this.contentTag) {
        case ContentTag.ABOUT:
          this.displayNotSelected = false;
          this.displayAboutMe = true;
          this.displayProjects = false;
          break;
        case ContentTag.PROJECTS:
          this.displayNotSelected = false;
          this.displayAboutMe = false;
          this.displayProjects = true;
          break;
        case ContentTag.CONTACT:
          this.displayNotSelected = false;
          this.displayAboutMe = false;
          this.displayProjects = false;
          break;
        case ContentTag.NOCONTENT:
          this.displayNotSelected = true;
          this.displayAboutMe = false;
          this.displayProjects = false;
          break;
      }
      this.vectorCameraToTarget = data.vectorCameraToTarget;
      console.log(
        'ContentBoxComponent received animation data: ' +
          this.contentTag +
          ' ' +
          this.vectorCameraToTarget
      );
    });
  }
}

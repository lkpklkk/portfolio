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
  displayedContent: string = 'asd';
  constructor(private animator: AnimationCorrelatorService) {}
  contentTag: ContentTag = ContentTag.NOCONTENT;
  vectorCameraToTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  ngOnInit() {
    this.animator.animationDataUploaded.subscribe((data) => {
      this.displayedContent =
        data.contentTag.toString() +
        ' ' +
        data.vectorCameraToTarget.x +
        ' ' +
        data.vectorCameraToTarget.y +
        ' ' +
        data.vectorCameraToTarget.z;
      this.contentTag = data.contentTag;
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

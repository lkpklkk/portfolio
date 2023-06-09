import { Injectable, EventEmitter, Output } from '@angular/core';

import { ContentTag } from './contentTag';
import * as THREE from 'three';

interface AnimationData {
  contentTag: ContentTag;
  vectorCameraToTarget: THREE.Vector3;
}
@Injectable({
  providedIn: 'root',
})
export class AnimationCorrelatorService {
  currentContentTag: ContentTag = ContentTag.NOCONTENT;
  currentVectorCameraToTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  @Output() animationDataUploaded: EventEmitter<AnimationData> =
    new EventEmitter();
  constructor() {}

  uploadAnimationData(
    contentTag: ContentTag,
    vectorCameraToTarget: THREE.Vector3
  ) {
    this.currentContentTag = contentTag;
    this.currentVectorCameraToTarget = vectorCameraToTarget;

    this.animationDataUploaded.emit({
      contentTag: this.currentContentTag,
      vectorCameraToTarget: this.currentVectorCameraToTarget,
    });
  }
}

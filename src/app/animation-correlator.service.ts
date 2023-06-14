import { Injectable, EventEmitter, Output } from '@angular/core';

import { ContentTag } from './contentTag';
import * as THREE from 'three';

interface AnimationData {
  contentTag: ContentTag;
  cameraPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  transitionIn: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AnimationCorrelatorService {
  @Output() animationDataUploaded: EventEmitter<AnimationData> =
    new EventEmitter();
  constructor() {}

  uploadAnimationData(
    contentTag: ContentTag,
    cameraPosition: THREE.Vector3,
    targetPosition: THREE.Vector3,
    transitionIn: boolean
  ) {
    this.animationDataUploaded.emit({
      contentTag: contentTag,
      cameraPosition: cameraPosition,
      targetPosition: targetPosition,
      transitionIn: transitionIn,
    });
  }
}

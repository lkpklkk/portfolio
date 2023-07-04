import { Injectable, EventEmitter, Output } from '@angular/core';

import { ContentTag } from '../contentTag';
import * as THREE from 'three';

interface AnimationData {
  contentTag: ContentTag;
  translateX: number;
  translateY: number;
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
    translateX: number,
    translateY: number,
    transitionIn: boolean
  ) {
    this.animationDataUploaded.emit({
      contentTag: contentTag,
      translateX: translateX,
      translateY: translateY,
      transitionIn: transitionIn,
    });
  }
}

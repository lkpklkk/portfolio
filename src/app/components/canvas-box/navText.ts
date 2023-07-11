import * as THREE from 'three';
import { CanvasBoxComponent } from './canvas-box.component';
import { ContentTag } from 'src/app/contentTag';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import * as TWEEN from '@tweenjs/tween.js';
import anime from 'animejs';
import { NONE_TYPE } from '@angular/compiler';
export class navText extends THREE.Mesh {
  originalColor: THREE.Color;
  hoverColor: string;
  active: boolean;
  canvaBox: CanvasBoxComponent;
  conetentTag: ContentTag;
  focusing: boolean = false;
  focused: boolean = false;
  focusedFrame: number = 0;
  pageIndicatorDom: HTMLElement;
  pageIndicatorAnimation?: anime.AnimeInstance;

  constructor(
    canvasBox: CanvasBoxComponent,
    contentTag: ContentTag,
    font: Font,
    text: string,
    position: THREE.Vector3,
    pageIndicatorDom: HTMLElement
  ) {
    super();
    this.originalColor = new THREE.Color(0xf77d20);
    this.hoverColor = 'grey';
    this.geometry = new TextGeometry(text, {
      font: font,
      size: 6,
      height: 2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    this.material = new THREE.MeshToonMaterial({
      color: this.originalColor,
    });
    this.scale.set(0.04, 0.04, 0.03);
    this.position.copy(position);
    this.positionSelf();
    this.active = false;
    this.canvaBox = canvasBox;
    this.conetentTag = contentTag;
    this.pageIndicatorDom = pageIndicatorDom;
  }

  private positionSelf() {
    // get the center of the bounding box
    let center = new THREE.Vector3();
    this.geometry.computeBoundingBox();
    this.geometry.boundingBox!.getCenter(center);
    this.geometry.translate(
      this.position.x - center.x,
      this.position.y - center.y,
      this.position.z - center.z
    );
    this.lookAt(this.position.clone().multiplyScalar(2));
  }
  onPointerOver(e: any) {
    (this.material as THREE.MeshStandardMaterial).color.set(this.hoverColor);
  }

  onPointerOut(e: any) {
    (this.material as THREE.MeshStandardMaterial).color.set(this.originalColor);
  }

  private getProjectionOntoPlane() {
    let camera = this.canvaBox.camera;
    let cameraDistance = camera.position.length();
    let planeNormal = camera.position.clone().normalize();
    let intersection = this.position
      .clone()
      .normalize()
      .multiplyScalar(cameraDistance);
    let cameraToIntersection = new THREE.Vector3().subVectors(
      intersection,
      camera.position
    );
    let projectionOntoNormal = planeNormal
      .clone()
      .multiplyScalar(
        cameraToIntersection.dot(planeNormal) / planeNormal.lengthSq()
      );
    let projectionOntoPlane = new THREE.Vector3()
      .subVectors(cameraToIntersection, projectionOntoNormal)
      .normalize();
    return projectionOntoPlane;
  }
  /**
   * This method is called at each update, to apply a small amount of force to the camera
   * in the direction of the navSphere. Aiming to achive a magnetic effect.
   * v1 = camera.position
   * v2 = navSphere.position
   * if angle between v1 and v2 is less than 30 degrees, apply force
   * along the direction of the arc connecting camera and navSphere
   * https://www.maplesoft.com/support/help/maple/view.aspx?path=MathApps/ProjectionOfVectorOntoPlane
   */
  gravityPull() {
    let camera = this.canvaBox.camera;
    let camDisToOrigin = camera.position.length();
    let angle = camera.position.angleTo(this.position);
    let force = ((camDisToOrigin / 3) * Math.abs(angle)) / 5;
    // let projectionOntoPlane = this.getProjectionOntoPlane();
    let cameraPlaneNorma = this.canvaBox.camera.position.clone().normalize();
    let cameraPlane = new THREE.Plane(cameraPlaneNorma, 0);
    let projectionOntoPlane = new THREE.Vector3();
    cameraPlane.projectPoint(this.position, projectionOntoPlane);
    projectionOntoPlane.normalize();
    return projectionOntoPlane.multiplyScalar(force);
    // TODO: adjust the force (i.e. the direction traveled) according to the distance of the camera from the origin
  }

  isWithinView() {
    let camera = this.canvaBox.camera;
    let angle = camera.position.angleTo(this.position);
    if (angle < Math.PI / 10) {
      return true;
    } else {
      return false;
    }
  }
  getAngleDifference() {
    let camera = this.canvaBox.camera;
    let angle = camera.position.angleTo(this.position);
    return angle;
  }
  getContentTag() {
    return this.conetentTag;
  }
  /**
   * to be determined?
   */
  getVectorToTarget() {
    let projectionOntoPlane = this.getProjectionOntoPlane();

    return projectionOntoPlane;
  }
}

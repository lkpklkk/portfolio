import * as THREE from 'three';
import { CanvasBoxComponent } from './canvas-box.component';
import { ContentTag } from 'src/app/contentTag';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import * as TWEEN from '@tweenjs/tween.js';
export class navText extends THREE.Mesh {
  originalColor: THREE.Color;
  hoverColor: string;
  active: boolean;
  canvaBox: CanvasBoxComponent;
  conetentTag: ContentTag;
  isTweening: boolean = false;
  focuesd: boolean = false;

  constructor(
    canvasBox: CanvasBoxComponent,
    contentTag: ContentTag,
    font: Font,
    text: string,
    position: THREE.Vector3
  ) {
    super();
    this.originalColor = new THREE.Color(0xffa559);
    this.hoverColor = 'grey';
    this.geometry = new TextGeometry(text, {
      font: font,
      size: 5,
      height: 1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    this.material = new THREE.MeshToonMaterial({
      color: 0xffa559,
    });
    this.scale.set(0.03, 0.03, 0.03);
    this.position.copy(position);
    this.positionSelf();
    this.active = false;
    this.canvaBox = canvasBox;
    this.conetentTag = contentTag;
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

  onClicked(e: any) {
    const targetCoord = this.position
      .clone()
      .add(this.position.clone().normalize().multiplyScalar(2));
    const coords = this.canvaBox.camera.position.clone();

    new TWEEN.Tween(coords)
      .to({ x: targetCoord.x, y: targetCoord.y, z: targetCoord.z }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() =>
        this.canvaBox.camera.position.set(coords.x, coords.y, coords.z)
      )
      .onStart(() => {
        console.log('start');
        this.isTweening = true;
        this.canvaBox.controls.enabled = false;
      })
      .onComplete(() => {
        console.log('complete');
        this.isTweening = false;
        this.canvaBox.controls.enabled = true;
      })
      .start();
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
    if (this.isTweening) {
      // means I am going towards the thing
      return true;
    }
    let camera = this.canvaBox.camera;
    let angle = camera.position.angleTo(this.position);
    if (angle < Math.PI / 10) {
      let camDisToOrigin = camera.position.length();
      let force = Math.abs(angle) / 2;
      // let projectionOntoPlane = this.getProjectionOntoPlane();
      let cameraPlaneNorma = this.canvaBox.camera.position.clone().normalize();
      let cameraPlane = new THREE.Plane(cameraPlaneNorma, 0);
      let projectionOntoPlane = new THREE.Vector3();
      cameraPlane.projectPoint(this.position, projectionOntoPlane);
      projectionOntoPlane.normalize();
      let nudge = projectionOntoPlane.multiplyScalar(force);
      // TODO: adjust the force (i.e. the direction traveled) according to the distance of the camera from the origin
      camera.position.add(nudge);
      return true;
    } else {
      return false;
    }
  }

  getContentTag() {
    return this.conetentTag;
  }
  /**
   * to be determined?
   */
  getVectorToTarget() {
    let projectionOntoPlane = this.getProjectionOntoPlane();
    // let distanceBetweenCameraAndNavSphere =
    //   this.canvaBox.camera.position.distanceTo(
    //     this.position
    //       .clone()
    //       .normalize()
    //       .multiplyScalar(this.canvaBox.camera.position.length())
    //   );
    // console.log(
    //   'distanceBetweenCameraAndNavSphere: ' + distanceBetweenCameraAndNavSphere
    // );
    return projectionOntoPlane;
  }
}

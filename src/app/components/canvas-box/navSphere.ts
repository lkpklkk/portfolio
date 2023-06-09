import * as THREE from 'three';
import { CanvasBoxComponent } from './canvas-box.component';
import { ContentTag } from 'src/app/contentTag';
export class NavSphere extends THREE.Mesh {
  originalColor: string;
  hoverColor: string;
  active: boolean;
  canvaBox: CanvasBoxComponent;
  conetentTag: ContentTag;

  constructor(canvasBox: CanvasBoxComponent, contentTag: ContentTag) {
    super();
    this.originalColor = 'white';
    this.hoverColor = 'grey';
    this.geometry = new THREE.SphereGeometry(0.1);
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.originalColor).convertSRGBToLinear(),
    });
    this.active = false;
    this.canvaBox = canvasBox;
    this.conetentTag = contentTag;
  }

  onPointerOver(e: any) {
    (this.material as THREE.MeshStandardMaterial).color.set(this.hoverColor);
    (this.material as THREE.MeshStandardMaterial).color.convertSRGBToLinear();
  }

  onPointerOut(e: any) {
    (this.material as THREE.MeshStandardMaterial).color.set(this.originalColor);
    (this.material as THREE.MeshStandardMaterial).color.convertSRGBToLinear();
  }
  private getProjectionOntoPlane() {
    let camera = this.canvaBox.camera;
    let angle = camera.position.angleTo(this.position);
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
    let angle = camera.position.angleTo(this.position);
    if (angle < Math.PI / 8 && angle > Math.PI / 30) {
      let force = Math.abs(angle) / 10;
      let projectionOntoPlane = this.getProjectionOntoPlane();
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
    return this.canvaBox.camera.position
      .clone()
      .sub(
        this.position
          .clone()
          .normalize()
          .multiplyScalar(this.canvaBox.camera.position.length())
      );
  }
}

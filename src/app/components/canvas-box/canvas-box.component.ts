import { Component, ElementRef, Host, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { AfterViewInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { navText } from './navText';
import { HostListener } from '@angular/core';
import { ContentTag } from 'src/app/contentTag';
import { AnimationCorrelatorService } from 'src/app/animation-correlator.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as TWEEN from '@tweenjs/tween.js';
@Component({
  selector: 'app-canvas-box',
  templateUrl: './canvas-box.component.html',
  styleUrls: ['./canvas-box.component.css'],
})
export class CanvasBoxComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement')
  private canvasElement!: ElementRef;
  private curCanvaWidth!: number;
  private curCanvaHeight!: number;
  private boundingRect!: DOMRect;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  intersects: THREE.Intersection[] = [];
  hovered: { [key: string]: THREE.Intersection } = {};
  raycaster = new THREE.Raycaster();
  navSpheres: navText[] = [];
  contentTag: ContentTag = ContentTag.NOCONTENT;
  vectorCameraToTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  navFont!: Font;

  cameraSettings = {
    fov: 75,
    near: 0.6,
    far: 1200,
    initialZPosition: 5,
  };

  controlsSettings = {
    enableDamping: true,
    dampingFactor: 0.02,
    minDistance: 2,
    maxDistance: 15,
  };

  constructor(
    private hostRef: ElementRef,
    private animator: AnimationCorrelatorService
  ) {
    console.log(this.hostRef.nativeElement);
  }

  ngOnInit() {}
  ngAfterViewInit() {
    // annoyingly, the canvas element has a border-box sizing, so we have to subtract the border
    this.curCanvaWidth = this.hostRef.nativeElement.clientWidth - 2;
    this.curCanvaHeight = this.hostRef.nativeElement.clientHeight - 2;
    this.boundingRect = this.hostRef.nativeElement.getBoundingClientRect();
    this.initThreeJsScene();
    this.animate();
  }

  addNavText() {
    let navSpheres = [
      new navText(
        this,
        ContentTag.ABOUT,
        this.navFont,
        'About Me',
        new THREE.Vector3(0, 1, 1.1)
      ),
      new navText(
        this,
        ContentTag.PROJECTS,
        this.navFont,
        'Projects',
        new THREE.Vector3(0, 0.4, -1.1)
      ),
      new navText(
        this,
        ContentTag.CREDITS,
        this.navFont,
        'Credits',
        new THREE.Vector3(1, -0.4, -1.1)
      ),
    ];
    navSpheres.forEach((navSphere) => {
      this.scene.add(navSphere);
      this.navSpheres.push(navSphere);
    });
  }
  addAxisLines(): void {
    const materials = [
      new THREE.LineBasicMaterial({ color: 'red' }),
      new THREE.LineBasicMaterial({ color: 'green' }),
      new THREE.LineBasicMaterial({ color: 'blue' }),
    ];

    const xAxisPoints = [];
    xAxisPoints.push(new THREE.Vector3(-10, 0, 0));
    xAxisPoints.push(new THREE.Vector3(0, 0, 0));
    xAxisPoints.push(new THREE.Vector3(10, 0, 0));
    const yAxisPoints = [];
    yAxisPoints.push(new THREE.Vector3(0, -10, 0));
    yAxisPoints.push(new THREE.Vector3(0, 0, 0));
    yAxisPoints.push(new THREE.Vector3(0, 10, 0));
    const zAxisPoints = [];
    zAxisPoints.push(new THREE.Vector3(0, 0, -10));

    zAxisPoints.push(new THREE.Vector3(0, 0, 0));
    zAxisPoints.push(new THREE.Vector3(0, 0, 10));
    const points = [xAxisPoints, yAxisPoints, zAxisPoints];
    const aidAxis = new THREE.Group();
    points.forEach((point, ndx) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(point);
      const line = new THREE.Line(geometry, materials[ndx]);
      aidAxis.add(line);
    });

    this.scene.add(aidAxis);
  }
  addThreeJsBox(): void {
    /*The our code is here, I removed it because of the total lines*/

    const material = new THREE.MeshToonMaterial();
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), material);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(5, 1.5, 16, 100),
      material
    );

    this.scene.add(torus, box);
  }
  initThreeJsScene() {
    // set up scene and camera
    this.canvasElement.nativeElement.width = this.curCanvaWidth;
    this.canvasElement.nativeElement.height = this.curCanvaHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.cameraSettings.fov,
      this.curCanvaWidth / this.curCanvaHeight,
      this.cameraSettings.near,
      this.cameraSettings.far
    );
    this.camera.position.z = this.cameraSettings.initialZPosition;

    // 3d text loader
    const fontLoader = new FontLoader();

    fontLoader.load('assets/fonts/Impact_Regular.json', (font) => {
      this.navFont = font;
      this.addNavText();
    });
    // load models
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      'assets/models/scene.gltf',
      (gltf) => {
        this.scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvasElement.nativeElement,
      alpha: true,
    });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = this.controlsSettings.enableDamping;
    this.controls.dampingFactor = this.controlsSettings.dampingFactor;
    this.controls.minDistance = this.controlsSettings.minDistance;
    this.controls.maxDistance = this.controlsSettings.maxDistance;

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    this.scene.add(pointLight);

    // add new ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.addAxisLines();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouse = new THREE.Vector2();
    const mousePosX = event.clientX - this.boundingRect.left;
    const mousePosY = event.clientY - this.boundingRect.top;
    mouse.set(
      (mousePosX / this.curCanvaWidth) * 2 - 1,
      -(mousePosY / this.curCanvaHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    Object.keys(this.hovered).forEach((key) => {
      const hit = this.intersects.find((hit) => hit.object.uuid === key);
      if (hit === undefined) {
        const hoveredItem = this.hovered[key];
        if (hoveredItem.object instanceof navText) {
          hoveredItem.object.onPointerOut(hoveredItem);
        }

        delete this.hovered[key];
      }
    });

    this.intersects.forEach((hit) => {
      // If a hit has not been flagged as hovered we must call onPointerOver
      if (!this.hovered[hit.object.uuid]) {
        this.hovered[hit.object.uuid] = hit;
        // check if the object implements onPointerOver
        if (hit.object instanceof navText) {
          (hit.object as navText).onPointerOver(hit);
        }
      }
    });
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    this.intersects.forEach((hit) => {
      // Call onClick
      if (hit.object instanceof navText) {
        (hit.object as navText).onClicked(event);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // update sizes
    this.boundingRect = this.hostRef.nativeElement.getBoundingClientRect();

    // annoyingly, the canvas element has a border-box sizing, so we have to subtract the border
    this.curCanvaWidth = this.hostRef.nativeElement.clientWidth - 2;
    this.curCanvaHeight = this.hostRef.nativeElement.clientHeight - 2;

    this.canvasElement.nativeElement.width = this.curCanvaWidth;
    this.canvasElement.nativeElement.height = this.curCanvaHeight;

    this.renderer.setSize(this.curCanvaWidth, this.curCanvaHeight);
    this.camera.aspect = this.curCanvaWidth / this.curCanvaHeight;
    this.camera.updateProjectionMatrix();
  }
  animate() {
    let focused = false;
    requestAnimationFrame(() => this.animate());
    this.navSpheres.forEach((navSphere) => {
      if (navSphere.gravityPull()) {
        focused = true;
        // that means I am trying to move here, activate animation of the contents
        this.animator.uploadAnimationData(
          navSphere.getContentTag(),
          navSphere.getVectorToTarget()
        );
      }
    });
    if (!focused) {
      this.animator.uploadAnimationData(
        ContentTag.NOCONTENT,
        new THREE.Vector3(0, 0, 0)
      );
    }
    TWEEN.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import anime from 'animejs';
import * as THREE from 'three';
import { AfterViewInit } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { navText } from './navText';
import { HostListener } from '@angular/core';
import { ContentTag } from 'src/app/contentTag';
import { AnimationCorrelatorService } from 'src/app/services/animation-correlator.service';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as TWEEN from '@tweenjs/tween.js';
import * as HOWL from 'howler';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-canvas-box',
  templateUrl: './canvas-box.component.html',
  styleUrls: ['./canvas-box.component.css'],
})
export class CanvasBoxComponent implements OnInit, AfterViewInit {
  ContentTag = ContentTag;
  @ViewChildren('iconOne,iconTwo,iconThree') sideIcons!: ElementRef[];
  @ViewChildren('progressBarOne,progressBarTwo,progressBarThree')
  progressBars!: ElementRef[];
  @ViewChild('turnHintContainer')
  turnHintContainer!: ElementRef;
  turnHintContainerAnimation!: anime.AnimeInstance;
  @ViewChild('turnIcon')
  turnIcon!: ElementRef;
  turnIconAnimation!: anime.AnimeInstance;
  turnHintUsed: boolean = false;
  @ViewChild('pageIndicatorContainer')
  pageIndicatorContainer!: ElementRef;
  @ViewChild('pageIndicatorAbout')
  pageIndicatorAbout!: ElementRef;
  @ViewChild('pageIndicatorProjects')
  pageIndicatorProjects!: ElementRef;
  @ViewChild('pageIndicatorCredits')
  pageIndicatorCredits!: ElementRef;
  gravityHintContainerAnimation!: anime.AnimeInstance;
  private canvasElement!: ElementRef;
  headModel!: THREE.Group;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  intersects: THREE.Intersection[] = [];
  hovered: { [key: string]: THREE.Intersection } = {};
  raycaster = new THREE.Raycaster();
  navTexts: navText[] = [];
  contentTag: ContentTag = ContentTag.NOCONTENT;
  vectorCameraToTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  navFont!: Font;
  soundWhoosh!: HOWL.Howl;
  soundClick!: HOWL.Howl;
  lastClickCameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  focusingNav?: navText = undefined;
  doneFocus: boolean = false;
  focusedTimer: number = 0;
  camerDistance: number = 3.5;
  isFlying: boolean = false;
  cameraSettings = {
    fov: 75,
    near: 0.6,
    far: 1200,
    initialZPosition: 5,
  };

  controlsSettings = {
    enableDamping: true,
    dampingFactor: 0.04,
    minDistance: this.camerDistance,
    maxDistance: this.camerDistance,
    enableZoom: false,
  };

  headCenter = new THREE.Vector3(0, 0.5, 0);
  headMaxDistance = 0.2;

  constructor(
    private hostRef: ElementRef,
    private animator: AnimationCorrelatorService,
    private loaderService: LoaderService
  ) {}
  getCanvaWidth() {
    let containerStyle = getComputedStyle(this.hostRef.nativeElement);
    return (
      this.hostRef.nativeElement.clientWidth -
      parseInt(containerStyle.paddingLeft) -
      parseInt(containerStyle.paddingRight) -
      10
    );
  }
  getCanvaHeight() {
    let containerStyle = getComputedStyle(this.hostRef.nativeElement);
    return (
      this.hostRef.nativeElement.clientHeight -
      parseInt(containerStyle.paddingTop) -
      parseInt(containerStyle.paddingBottom) -
      10
    );
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.soundInit();
    this.canvasElement = new ElementRef(
      document.createElement('canvas')
    ) as ElementRef<HTMLCanvasElement>;
    let newCanvaHeight = this.getCanvaHeight();
    let newCanvaWidth = this.getCanvaWidth();
    this.canvasElement.nativeElement.width = newCanvaWidth;
    this.canvasElement.nativeElement.height = newCanvaHeight;
    // set z-index to 1 so that it is above the background
    this.canvasElement.nativeElement.style.zIndex = '1';

    // annoyingly, the canvas element has a border-box sizing, so we have to subtract the border

    this.hostRef.nativeElement.appendChild(this.canvasElement.nativeElement);
    this.createScene();
    this.hintInit();
    this.animate();
    this.createLoadedAnimation();
  }

  createLoadedAnimation() {
    this.loaderService.loaded.subscribe(() => {
      this.controls.enabled = false;
      const numRotationY = 1;
      const numRotationX = 1;
      const fullRotation = Math.PI * 2;
      this.soundWhoosh.play();
      new TWEEN.Tween(this.scene.scale).to({ x: 1, y: 1, z: 1 }, 1000).start();
      new TWEEN.Tween(this.scene.rotation)
        .to(
          {
            x: numRotationX * fullRotation,
            y: numRotationY * fullRotation,
            z: 0,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onComplete(() => {
          this.controls.enabled = true;
        });
    });
  }
  addNavText() {
    let navSpheres = [
      new navText(
        this,
        ContentTag.ABOUTME,
        this.navFont,
        'About Me',
        new THREE.Vector3(0, 1, 1.1),
        this.pageIndicatorAbout.nativeElement
      ),
      new navText(
        this,
        ContentTag.PROJECTS,
        this.navFont,
        'Projects',
        new THREE.Vector3(0, 0.4, -1.1),
        this.pageIndicatorProjects.nativeElement
      ),
      new navText(
        this,
        ContentTag.CREDITS,
        this.navFont,
        'Credits',
        new THREE.Vector3(1, -0.4, -1.1),
        this.pageIndicatorCredits.nativeElement
      ),
    ];
    navSpheres.forEach((navSphere) => {
      this.scene.add(navSphere);
      this.navTexts.push(navSphere);
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

  addTorus(): void {
    let material = new THREE.MeshStandardMaterial();
    material.metalness = 0.3;
    material.roughness = 0;
    material.wireframe = true;

    let torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.2, 16, 100),
      material
    );
    torus.rotateX(Math.PI / 2);
    torus.position.y = -1.5;
    this.scene.add(torus);
  }
  createScene() {
    // set up scene and camera
    let newCanvaHeight = this.getCanvaHeight();
    let newCanvaWidth = this.getCanvaWidth();

    this.canvasElement.nativeElement.width = newCanvaWidth;

    this.canvasElement.nativeElement.height = newCanvaHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.cameraSettings.fov,
      newCanvaWidth / newCanvaHeight,
      this.cameraSettings.near,
      this.cameraSettings.far
    );
    this.camera.position.z = this.cameraSettings.initialZPosition;
    // 3d text loader
    const fontLoader = new FontLoader();

    fontLoader.load('assets/fonts/Impact_Regular.json', (font) => {
      this.navFont = font;
      this.addNavText();
      this.loaderService.setTextModelLoaded();
    });
    // load models
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      'assets/models/scene.gltf',
      (gltf) => {
        this.headModel = gltf.scene;
        this.headModel.position.set(
          this.headCenter.x,
          this.headCenter.y,
          this.headCenter.z
        );
        this.scene.add(this.headModel);
        this.loaderService.setHeadModelLoaded();
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
    this.controls.enableZoom = this.controlsSettings.enableZoom;

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    this.scene.add(pointLight);

    // add new ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.addTorus();
    // this.addAxisLines();

    this.scene.scale.set(0.1, 0.1, 0.1);
  }
  soundInit() {
    this.soundWhoosh = new HOWL.Howl({
      src: ['assets/sounds/whoosh/1.mp3'],
      volume: 0.3,
    });

    this.soundClick = new HOWL.Howl({
      src: ['assets/sounds/click.mp3'],
    });
  }
  hintInit() {
    this.turnHintContainerAnimation = anime({
      targets: this.turnHintContainer.nativeElement,
      opacity: [0, 1, 0],
      duration: 4000,
      easing: 'linear',
      loop: true,
    });
  }
  calculateTranslateXY(cameraVec: THREE.Vector3, targetVec: THREE.Vector3) {
    let direction = new THREE.Vector2(
      targetVec.x - cameraVec.x,
      targetVec.y - cameraVec.y
    );
    //
    // Convert the direction to a 2D angle
    let angle = Math.atan2(direction.y, direction.x);
    let translateX = Math.cos(angle);
    let translateY = -Math.sin(angle);
    if (cameraVec.z < 0) {
      translateX = -translateX;
    }
    return [translateX, translateY];
  }
  // @HostListener('window:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   const mouse = new THREE.Vector2();
  //   const boundingRect =
  //     this.canvasElement.nativeElement.getBoundingClientRect();
  //   const mousePosX = event.clientX - boundingRect.left;
  //   const mousePosY = event.clientY - boundingRect.top;
  //   const getCanvaWidth = this.getCanvaWidth();
  //   const getCanvaHeight = this.getCanvaHeight();
  //   mouse.set(
  //     (mousePosX / getCanvaWidth) * 2 - 1,
  //     -(mousePosY / getCanvaHeight) * 2 + 1
  //   );
  //   this.raycaster.setFromCamera(mouse, this.camera);
  //   this.intersects = this.raycaster.intersectObjects(
  //     this.scene.children,
  //     true
  //   );
  //   Object.keys(this.hovered).forEach((key) => {
  //     const hit = this.intersects.find((hit) => hit.object.uuid === key);
  //     if (hit === undefined) {
  //       const hoveredItem = this.hovered[key];
  //       if (hoveredItem.object instanceof navText) {
  //         hoveredItem.object.onPointerOut(hoveredItem);
  //       }
  //       delete this.hovered[key];
  //     }
  //   });

  //   this.intersects.forEach((hit) => {
  //     // If a hit has not been flagged as hovered we must call onPointerOver
  //     if (!this.hovered[hit.object.uuid]) {
  //       this.hovered[hit.object.uuid] = hit;
  //       // check if the object implements onPointerOver
  //       if (hit.object instanceof navText) {
  //         (hit.object as navText).onPointerOver(hit);
  //       }
  //     }
  //   });
  // }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent) {
    // this.intersects.forEach((hit) => {
    //   // Call onClick
    //   if (hit.object instanceof navText) {
    //     // (hit.object as navText).onClicked(event);
    //     this.soundClick.play();
    //   }
    // });
    if (!this.turnHintUsed) {
      this.turnHintContainerAnimation.pause();
      let curOpacity = this.turnHintContainer.nativeElement.style.opacity;

      this.turnHintContainerAnimation = anime({
        targets: this.turnHintContainer.nativeElement,
        opacity: [curOpacity, 0],
        duration: curOpacity * 1000,
        easing: 'easeOutQuad',
        loop: false,
        complete: () => {
          this.turnHintUsed = true;
          this.turnHintContainer.nativeElement.style.display = 'none';
          this.pageIndicatorContainer.nativeElement.style.display = 'block';
          anime({
            targets: this.pageIndicatorContainer.nativeElement,
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutQuad',
            loop: false,
          });
        },
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    let newCanvaHeight = this.getCanvaHeight();
    let newCanvaWidth = this.getCanvaWidth();
    this.canvasElement.nativeElement.width = newCanvaWidth;
    this.canvasElement.nativeElement.height = newCanvaHeight;
    this.renderer.setSize(newCanvaWidth, newCanvaHeight);
    this.camera.aspect = newCanvaWidth / newCanvaHeight;
    this.camera.updateProjectionMatrix();
  }
  onClickPageIndicator(contentTag: ContentTag) {
    console.log('clicked');
    this.navTexts.forEach((navText) => {
      if (
        navText.conetentTag === contentTag &&
        contentTag !== this.focusingNav?.conetentTag
      ) {
        console.log(this.focusingNav);
        if (
          (this.focusingNav === undefined || this.doneFocus) &&
          !this.isFlying
        ) {
          this.flyTo(navText);
          this.doneFocus = false;
        }
      }
    });
  }
  flyTo(navText: navText) {
    this.isFlying = true;
    const targetCoord = navText.position
      .clone()
      .add(
        navText.position.clone().normalize().multiplyScalar(this.camerDistance)
      );
    const coords = this.camera.position.clone();
    new TWEEN.Tween(coords)
      .to({ x: targetCoord.x, y: targetCoord.y, z: targetCoord.z }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => this.camera.position.set(coords.x, coords.y, coords.z))
      .onStart(() => {
        this.controls.enabled = false;
        console.log('start');
      })
      .onComplete(() => {
        console.log('complete');
        this.focusingNav = navText;
        this.isFlying = false;
        this.focusedTimer = 0;
        this.doneFocus = true;
        this.controls.enabled = true;
      })
      .start();
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    TWEEN.update();
    this.controls.update();
    let normalizedCam = this.camera.position.clone().normalize();
    let percs = [normalizedCam.x, normalizedCam.y, normalizedCam.z];
    this.progressBars.forEach((elementRef: ElementRef, i: number) => {
      const nativeElement = elementRef.nativeElement;
      nativeElement.style.width = Math.abs(percs[i]) * 100 + '%';
      // Perform operations on nativeElement using the index i
    });
    this.sideIcons.forEach((elementRef: ElementRef, i: number) => {
      const nativeElement = elementRef.nativeElement;
      nativeElement.style.rotate = Math.abs(percs[i]) * 180 + 'deg';
      // Perform operations on nativeElement using the index i
    });

    let difference = this.lastClickCameraPosition
      .clone()
      .sub(this.camera.position);

    if (difference.length() > 0.3) {
      // this.soundClick.play();
      this.lastClickCameraPosition.set(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );
    }
    let neutral = true;

    // NavText gravity pulling effect
    this.navTexts.forEach((navText) => {
      if (navText.isWithinView()) {
        if (!this.doneFocus) {
          this.controls.enabled = false;
        }

        neutral = false;
        if (this.focusingNav !== navText) {
          this.focusingNav = navText;
          this.doneFocus = false;
          // Staring the transition
          this.soundWhoosh.play();
          let translate = this.calculateTranslateXY(
            this.camera.position.clone().normalize(),
            navText.position.clone().normalize()
          );
          let translateX = translate[0];
          let translateY = translate[1];

          navText.focused = true;
          this.animator.uploadAnimationData(
            navText.conetentTag,
            translateX,
            translateY,
            true
          );
          let angle = Math.asin(translateX);
          angle = angle * (180 / Math.PI);

          navText.pageIndicatorAnimation = anime({
            targets: navText.pageIndicatorDom,
            translateX: [translateX * 20, 0],
            translateY: [translateY * 20, 0],
            scale: [0.5, 1],
            opacity: [0, 1],
            duration: 1500,
            easing: 'easeOutElastic(1, .6)',
            loop: false,
          });
        }

        // update done focus
        if (!this.isFlying) {
          let angleDifference = navText.getAngleDifference();
          if (angleDifference < 0.1) {
            this.focusedTimer += 1;
            if (this.focusedTimer > 100) {
              this.focusedTimer = 0;
              this.doneFocus = true;
              this.controls.enabled = true;
            }
          } else {
            this.focusedTimer = 0;
          }
          if (!this.doneFocus) {
            let cameraNudge = navText.gravityPull();
            this.camera.position.add(cameraNudge);
          }
        }
      }
    });

    // send out transitioning out signal
    if (neutral) {
      this.controls.enabled = true;
      if (this.focusingNav) {
        let translate = this.calculateTranslateXY(
          this.camera.position.clone().normalize(),
          this.focusingNav.position.clone().normalize()
        );
        let translateX = translate[0];
        let translateY = translate[1];
        this.animator.uploadAnimationData(
          this.focusingNav.conetentTag,
          translateX,
          translateY,
          false
        );
        if (this.focusingNav.pageIndicatorAnimation) {
          this.focusingNav.pageIndicatorAnimation.pause();
        }
        let animationTarget = this.focusingNav.pageIndicatorDom;
        this.focusingNav = undefined;
        this.doneFocus = false;
        this.focusedTimer = 0;

        anime({
          targets: animationTarget,
          translateX: [0, translateX * 10],
          translateY: [0, translateY * 10],
          opacity: [1, 0],
          duration: 500,
          easing: 'easeOutQuad',
          loop: false,
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

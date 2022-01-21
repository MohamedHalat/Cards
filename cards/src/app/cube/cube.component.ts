import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import AmmoModule from "ammojs-typed";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  public cameraZ: number = 30;
  public fieldOfView: number = 1;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  // private Ammo: typeof AmmoModule;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.render();
  }


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }


  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.copy(new THREE.Vector3(16, 13, -4));


    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
     });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.camera.position.setZ(this.cameraZ);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderCards();
  }


  private renderCards() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../../assets/uno card.jpeg');
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;

    const geometry2 = new THREE.BoxGeometry(10, 0.1, 16, 100);
    const material2 = new THREE.MeshStandardMaterial({ map: texture });
    const card2 = new THREE.Mesh(geometry2, material2);
    card2.position.set(0, 0, 0);
    this.scene.add(card2);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
    pointLight.position.set(20, 20, 20);
    this.scene.add(pointLight);
  }


  private render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }

}

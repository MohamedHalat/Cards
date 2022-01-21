import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card } from '../../classes/card';
import { Table } from '../../classes/table';
import { SceneObject } from '../../classes/sceneObject';
import * as CANNON from 'cannon';

export let sceneObjects: SceneObject[] = []

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private world: CANNON.World;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private table: Table;

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createScene();
    this.lightScene();
    this.renderCards();

    this.renderCycle();
  }


  private createScene() {

    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);

    let box = new CANNON.Body({
      mass: 0.2,
      position: new CANNON.Vec3(0, 0, 0),
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
      shape: new CANNON.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    this.world.addBody(groundBody)

    console.log(this.world)

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

    this.camera.position.setZ(30);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.canvas.addEventListener('click', (event) => this.mouseEvents(event));
  }

  mouseEvents(event: any) {
    if (!event) {
      let modal = document.querySelector('.p-contextmenu')?.getBoundingClientRect();
      event = {
        clientX: modal?.top ?? 0,
        clientY: modal?.left ?? 0
      }
    }

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(sceneObjects.map(obj => obj.obj));

    if (intersects.length > 0) {
      sceneObjects.find(obj => obj.obj === intersects[0].object)?.clicked();
    }
  }


  private renderCards() {
    this.table = new Table(this.scene, this.world);
    this.table.addToScene();
    sceneObjects.push(this.table);

    let card = new Card(this.scene, this.world, 'black', 'uno card');
    card.addToScene();
    sceneObjects.push(card);

    let card2 = new Card(this.scene, this.world, 'white', 'uno card');
    card2.addToScene();
    sceneObjects.push(card2);
  }


  private lightScene() {
    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
    pointLight.position.set(20, 20, 20);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(pointLight, ambientLight);
  }

  private renderCycle() {
    requestAnimationFrame(() => this.renderCycle());

    this.world.step(1 / 45);
    sceneObjects.forEach(obj => obj.render());
    this.renderer.render(this.scene, this.camera);
  }


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}

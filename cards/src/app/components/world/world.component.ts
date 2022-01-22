import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card } from '../../classes/card';
import { Table } from '../../classes/table';
import { SceneObject } from '../../classes/sceneObject';
import * as CANNON from 'cannon';
import { Deck } from 'src/app/classes/deck';
import { Group } from 'src/app/classes/group';
import { Hand } from 'src/app/classes/hand';
import { MenuItem } from 'primeng/api';
import { AnimationService } from 'src/app/services/animation.service';

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

  private deck: Deck;
  private table: Table;
  private playerHand: Hand;

  public actions: MenuItem[];
  private readonly DefaultActions: MenuItem[] = [
    {
      label: 'Lock Camera',
      icon: 'pi pi-lock',
      command: () => this.lockCamera()
    }
  ]

  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.actions = this.DefaultActions;

    this.createScene();
    this.createAnimationCycle();
    this.lightScene();
    this.renderCards();

    this.renderCycle();
  }


  private createScene() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

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

  private createAnimationCycle() {
    this.animationService.scene = this.scene;
    this.animationService.world = this.world;
    this.animationService.renderer = this.renderer;
    this.animationService.camera = this.camera;

    this.controls.addEventListener('change', () => this.renderCycle());
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
      let obj = sceneObjects.find(obj => obj.obj === intersects[0].object);
      if (obj) {
        obj.clicked();
        this.renderCycle();

        if (this.deck.cards.filter(c => c.selected).length > 0) {
          this.actions = this.DefaultActions.concat([
            {
              label: 'Add to hand',
              icon: 'pi pi-plus',
              command: () => {
                this.addToHand();
                this.renderCycle();
              }
            },
            {
              label: 'Flip',
              icon: 'pi pi-refresh',
              command: () => {
                obj?.flip();
                this.renderCycle();
              }
            }
          ]);

        } else {
          this.actions = this.DefaultActions;
        }
      }
    }
  }


  private renderCards() {
    this.table = new Table(this.scene, this.world);
    this.table.addToScene();
    sceneObjects.push(this.table);

    this.deck = new Deck(this.scene, this.world);
    this.deck.addToScene();
    sceneObjects.push(this.deck);

    this.playerHand = new Hand();
  }

  private lockCamera() {
    this.controls.enabled = !this.controls.enabled;
  }

  private lightScene() {
    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
    pointLight.position.set(20, 20, 20);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(pointLight, ambientLight);
  }

  private renderCycle() {
    this.animationService.animate();
  }

  addToHand() {
    this.deck.addToHand(this.playerHand);
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}
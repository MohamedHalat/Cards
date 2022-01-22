import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Table } from '../../classes/table';
import { Deck } from 'src/app/classes/deck';
import { Hand } from 'src/app/classes/hand';
import { MenuItem } from 'primeng/api';
import { SceneService } from 'src/app/services/scene.service';
import { RendererService } from 'src/app/services/renderer.service';
import { CameraService } from 'src/app/services/camera.service';
import { WorldService } from 'src/app/services/world.service';


@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private scene: SceneService;
  private renderer: RendererService;
  private cameraService: CameraService;

  private controls: OrbitControls | DragControls;
  private orbitControls: OrbitControls;
  private dragControls: DragControls;

  private conrolsLock = true;

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

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.actions = this.DefaultActions;

    this.canvas.addEventListener('click', (event) => this.mouseEvents(event));

    this.renderer = new RendererService();
    this.cameraService = new CameraService();

    this.scene = new SceneService(this.renderer, new WorldService(), this.cameraService);


    this.renderCards();
    this.scene.animate();
    this.setOrbitControls();
  }

  private setOrbitControls() {
    this.orbitControls = new OrbitControls(this.cameraService.camera, this.renderer.domElement);
    this.orbitControls.addEventListener('change', () => this.scene.animate());
    this.controls = this.orbitControls;
  }

  private setDragControls() {
    this.dragControls = new DragControls(this.deck.cards.map(c => c.obj), this.cameraService.camera, this.renderer.domElement);
    this.dragControls.addEventListener('change', () => this.scene.animate());

    this.dragControls.addEventListener( 'dragstart', function ( event ) {
      event.object.material.emissive.set( 0xaaaaaa );
    } );

    this.dragControls.addEventListener( 'dragend', function ( event ) {
      event.object.material.emissive.set( 0x000000 );
    });

    this.controls = this.dragControls;
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
    raycaster.setFromCamera(mouse, this.cameraService.camera);

    const intersects = raycaster.intersectObjects(this.scene.objects.map(obj => obj.obj));

    if (intersects.length > 0) {
      let obj = this.scene.objects.find(obj => obj.obj === intersects[0].object);
      if (obj) {
        obj.clicked();
        this.scene.animate();

        if (this.deck.cards.filter(c => c.selected).length > 0) {
          this.actions = this.DefaultActions.concat([
            {
              label: 'Add to hand',
              icon: 'pi pi-plus',
              command: () => {
                this.addToHand();
                this.scene.animate();
              }
            },
            {
              label: 'Flip',
              icon: 'pi pi-refresh',
              command: () => {
                obj?.flip();
                this.scene.animate();
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
    this.table = new Table(this.scene);
    this.table.addToScene();

    this.deck = new Deck(this.scene);
    this.deck.addToScene();

    this.playerHand = new Hand(this.scene);
    this.playerHand.addToScene();
  }

  private lockCamera() {
    if (this.conrolsLock) {
      this.setDragControls();
      this.dragControls.enabled = true;
      this.orbitControls.enabled = false;
    }
    else {
      this.setOrbitControls();
      this.dragControls.enabled = false;
      this.orbitControls.enabled = true;
    }
    this.conrolsLock = !this.conrolsLock;
  }

  addToHand() {
    this.deck.addToHand(this.playerHand);
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}

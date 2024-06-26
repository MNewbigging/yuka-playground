import { makeAutoObservable, observable } from "mobx";
import * as THREE from "three";
import * as YUKA from "yuka";
import { AssetManager } from "./asset-manager";
import { Level } from "./level";
import { Player } from "./player";
import { FpsControls } from "./fps-controls";

export class GameState {
  @observable paused = false;

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private renderer = new THREE.WebGLRenderer({ antialias: true });

  private time = new YUKA.Time();
  private entityManager = new YUKA.EntityManager();
  private player: Player;

  constructor(private assetManager: AssetManager) {
    makeAutoObservable(this);

    this.setupScene();
    this.setupLevel();
    this.player = this.setupPlayer();

    const axesHeper = new THREE.AxesHelper(50);
    this.scene.add(axesHeper);
  }

  start() {
    this.update();
  }

  addEntity(entity: YUKA.GameEntity, renderComponent: THREE.Object3D) {
    renderComponent.matrixAutoUpdate = false;
    this.scene.add(renderComponent);
    entity.setRenderComponent(renderComponent, this.sync);
    this.entityManager.add(entity);
  }

  private setupScene() {
    // skybox

    const hdri = this.assetManager.textures.get("hdri");
    this.scene.environment = hdri;
    this.scene.background = hdri;

    // camera

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.matrixAutoUpdate = true;
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 1.5, -5);

    // lights

    const ambientLight = new THREE.AmbientLight(undefined, 0.25);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(undefined, Math.PI);
    directLight.position.copy(new THREE.Vector3(0.75, 1, 0.75).normalize());
    this.scene.add(directLight);

    // renderer

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    window.addEventListener("resize", this.onWindowResize, false);

    const canvasRoot = document.getElementById("canvas-root");
    canvasRoot?.appendChild(this.renderer.domElement);
  }

  private setupLevel() {
    const renderComponent = this.assetManager.models.get(
      "level"
    ) as THREE.Object3D;
    const level = new Level();
    level.name = "level";
    this.addEntity(level, renderComponent);
  }

  private setupPlayer() {
    const player = new Player();
    this.camera.matrixAutoUpdate = false;
    player.head.setRenderComponent(this.camera, this.syncCamera);

    player.position.set(0, 1.5, 0);

    this.entityManager.add(player);

    return player;
  }

  private update = () => {
    requestAnimationFrame(this.update);

    this.time.update();
    const dt = this.time.getDelta();

    this.entityManager.update(dt);

    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);
  };

  private sync = (
    yukaEntity: YUKA.GameEntity,
    renderComponent: THREE.Object3D
  ) => {
    const matrix = yukaEntity.worldMatrix as unknown;
    renderComponent.matrix.copy(matrix as THREE.Matrix4);
  };

  private syncCamera = (
    yukaEntity: YUKA.GameEntity,
    camera: THREE.PerspectiveCamera
  ) => {
    const matrix = yukaEntity.worldMatrix as unknown;
    camera.matrixWorld.copy(matrix as THREE.Matrix4);
  };

  private onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };
}

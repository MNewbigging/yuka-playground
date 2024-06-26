import { makeAutoObservable, observable } from "mobx";
import * as THREE from "three";
import * as YUKA from "yuka";
import { AssetManager } from "../loaders/asset-manager";
import { Level } from "./level";

export class GameState {
  @observable paused = false;

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private renderer = new THREE.WebGLRenderer({ antialias: true });

  private entityManager = new YUKA.EntityManager();

  constructor(private assetManager: AssetManager) {
    makeAutoObservable(this);

    this.setupScene();
    this.setupLevel();
  }

  start() {
    this.update();
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
    this.camera.position.set(2, 2, 2);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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
    const renderComponent = this.assetManager.models.get("level");
    const level = new Level();
    level.name = "level";
    level.setRenderComponent(renderComponent, this.sync);
    this.scene.add(renderComponent);
  }

  private update = () => {
    requestAnimationFrame(this.update);

    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);
  };

  private sync = (
    yukaEntity: YUKA.GameEntity,
    renderComponent: THREE.Object3D
  ) => {
    renderComponent.matrix.fromArray(
      yukaEntity.worldMatrix.toArray(new Array())
    );
  };

  private onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };
}

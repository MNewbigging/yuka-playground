import * as YUKA from "yuka";
import * as THREE from "three";

export class Zombie extends YUKA.Vehicle {
  path?: Array<YUKA.Vector3>;

  private brain: YUKA.Think<Zombie>;
  private mixer?: THREE.AnimationMixer;
  private animations = new Map<string, THREE.AnimationAction>();

  constructor() {
    super();

    this.brain = new YUKA.Think(this);
  }

  setAnimations(mixer: THREE.AnimationMixer, clips: THREE.AnimationClip[]) {
    this.mixer = mixer;

    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
      action.enabled = false;

      this.animations.set(clip.name, action);
    });
  }

  override start(): this {
    // default animation

    this.playAnimation("zombie-idle");

    return this;
  }

  override update(delta: number): this {
    super.update(delta);

    this.updateAnimations(delta);

    return this;
  }

  private updateAnimations(dt: number) {
    this.mixer?.update(dt);
  }

  private playAnimation(name: string) {
    const action = this.animations.get(name);
    if (action) {
      action.enabled = true;
    }
  }
}

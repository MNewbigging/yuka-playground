import * as YUKA from "yuka";
import * as THREE from "three";
import { PathPlanner } from "../core/path-planner";
import { Player } from "./player";
import { TrackPlayerEvaluator } from "../evaluators/track-player-evaluator";

const POSITION_EQUALITY_TOLERANCE = 1;

export class Zombie extends YUKA.Vehicle {
  path?: Array<YUKA.Vector3>;
  followPathBehaviour: YUKA.FollowPathBehavior;
  brain: YUKA.Think<Zombie>;

  private mixer?: THREE.AnimationMixer;
  private animations = new Map<string, THREE.AnimationAction>();

  constructor(public pathPlanner: PathPlanner, public player: Player) {
    super();

    // goals

    this.brain = new YUKA.Think(this);
    //this.brain.addEvaluator(new TrackPlayerEvaluator());

    // steering

    this.followPathBehaviour = new YUKA.FollowPathBehavior();
    this.followPathBehaviour.active = false;
    this.steering.add(this.followPathBehaviour);
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

  atPosition(position: YUKA.Vector3) {
    const tolerance = POSITION_EQUALITY_TOLERANCE * POSITION_EQUALITY_TOLERANCE;

    const distance = this.position.squaredDistanceTo(position);

    return distance <= tolerance;
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

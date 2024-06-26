import * as YUKA from "yuka";
import { FpsControls } from "./fps-controls";

export class Player extends YUKA.MovingEntity {
  head: YUKA.GameEntity;

  private fpsControls: FpsControls;

  constructor() {
    super();

    // the camera is attached to the player's head

    this.head = new YUKA.GameEntity();
    this.head.forward.set(0, 0, -1);
    this.add(this.head);

    // player owns the first person controls

    this.updateOrientation = false;
    this.fpsControls = new FpsControls(this);
    this.fpsControls.enable();

    this.maxSpeed = 6;
  }

  override update(delta: number): this {
    super.update(delta);

    this.fpsControls.update(delta);

    return this;
  }
}

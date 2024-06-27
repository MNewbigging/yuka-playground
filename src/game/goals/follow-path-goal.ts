import * as YUKA from "yuka";
import { Zombie } from "../entities/zombie";

export class FollowPathGoal extends YUKA.Goal<Zombie> {
  private to = new YUKA.Vector3();

  constructor(public owner: Zombie) {
    super(owner);
  }

  override activate(): void {
    const owner = this.owner;
    const path = owner.path;

    if (!path) {
      this.status = YUKA.Goal.STATUS.FAILED;

      return;
    }

    // update path and steering

    const followPathBehaviour = owner.followPathBehaviour;
    followPathBehaviour.active = true;
    followPathBehaviour.path.clear();

    path.forEach((waypoint) => {
      followPathBehaviour.path.add(waypoint);
    });

    this.to = path[path.length - 1];
  }

  override execute(): void {
    if (this.active()) {
      if (this.owner.atPosition(this.to)) {
        this.status = YUKA.Goal.STATUS.COMPLETED;
      }
    }
  }

  override terminate(): void {
    this.owner.followPathBehaviour.active = false;
  }
}

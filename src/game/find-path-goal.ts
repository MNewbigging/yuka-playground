import * as YUKA from "yuka";
import { Zombie } from "./zombie";

export class FindPathGoal extends YUKA.Goal<Zombie> {
  private from: YUKA.Vector3;
  private to: YUKA.Vector3;

  constructor(owner: Zombie, from: YUKA.Vector3, to: YUKA.Vector3) {
    super(owner);

    this.from = from;
    this.to = to;
  }

  override activate(): void {
    // Start the path finding
  }

  override execute(): void {
    // Continually check if the path was found
  }
}

import * as YUKA from "yuka";
import { PathPlanner } from "../core/path-planner";

export type PathFoundCallback = (
  vehicle: YUKA.Vehicle,
  path: YUKA.Vector3[]
) => void;

export class PathPlannerTask extends YUKA.Task {
  constructor(
    private planner: PathPlanner,
    private vehicle: YUKA.Vehicle,
    private from: YUKA.Vector3,
    private to: YUKA.Vector3,
    private callback: PathFoundCallback
  ) {
    super();
  }

  override execute(): void {
    const path = this.planner.navMesh.findPath(this.from, this.to);

    this.callback(this.vehicle, path);
  }
}

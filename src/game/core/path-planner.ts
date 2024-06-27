import * as YUKA from "yuka";
import { PathFoundCallback, PathPlannerTask } from "../tasks/path-planner-task";

export class PathPlanner {
  private taskQueue = new YUKA.TaskQueue();

  constructor(public navMesh: YUKA.NavMesh) {}

  findPath(
    vehicle: YUKA.Vehicle,
    from: YUKA.Vector3,
    to: YUKA.Vector3,
    callback: PathFoundCallback
  ) {
    const task = new PathPlannerTask(this, vehicle, from, to, callback);

    this.taskQueue.enqueue(task);
  }

  update() {
    this.taskQueue.update();
  }
}

interface Input {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export class FpsControls {
  private enabled = false;
  private input: Input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  enable() {
    if (this.enabled) {
      return;
    }

    document.addEventListener("keydown", this.onKeyDown, false);
    document.addEventListener("keyup", this.onKeyUp, false);

    this.enabled = true;
  }

  disable() {
    if (!this.enabled) {
      return;
    }

    document.removeEventListener("keydown", this.onKeyDown, false);
    document.removeEventListener("keyup", this.onKeyUp, false);

    this.enabled = false;
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.enabled) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case "w":
        this.input.forward = true;
        break;
      case "s":
        this.input.backward = true;
        break;
      case "a":
        this.input.left = true;
        break;
      case "d":
        this.input.right = true;
        break;
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (!this.enabled) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case "w":
        this.input.forward = false;
        break;
      case "s":
        this.input.backward = false;
        break;
      case "a":
        this.input.left = false;
        break;
      case "d":
        this.input.right = false;
        break;
    }
  };
}

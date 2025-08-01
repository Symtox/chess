import { MoveValidator } from "@/game/engine/validators/move-checker";
export class MoveCheckerFactory<T extends string> {

  constructor(private validators: { [key in T]: MoveValidator }) {}

  getInstance(type: T): MoveValidator {
    return this.validators[type];
  }
}


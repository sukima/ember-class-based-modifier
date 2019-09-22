interface ModifierArgs {
  positional: unknown[];
  named: { [key: string]: unknown };
}

interface IModifier<Args extends ModifierArgs = ModifierArgs> {
  args: Args;
  element: Element | null;
  isDestroying: boolean;
  isDestroyed: boolean;
  didReceiveArguments(): void;
  didUpdateArguments(): void;
  didInstall(): void;
  willRemove(): void;
  willDestroy(): void;
}

type Owner = unknown;

declare module "ember-class-based-modifier" {
  export default class Modifier<Args extends ModifierArgs = ModifierArgs>
    implements IModifier<Args> {
    args: Args;
    element: Element | null;
    isDestroying: boolean;
    isDestroyed: boolean;
    constructor(owner: Owner, args: Args);
    didReceiveArguments(): void;
    didUpdateArguments(): void;
    didInstall(): void;
    willRemove(): void;
    willDestroy(): void;
  }
}

declare module "ember-class-based-modifier/classic" {
  import EmberObject from "@ember/object";

  export default class Modifier extends EmberObject implements IModifier {
    args: ModifierArgs;
    element: Element | null;
    isDestroying: boolean;
    isDestroyed: boolean;
    didReceiveArguments(): void;
    didUpdateArguments(): void;
    didInstall(): void;
    willRemove(): void;
    willDestroy(): void;
  }
}

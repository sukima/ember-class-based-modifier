export const name: string;

export default class Modifier {
  element: HTMLElement | SVGElement;
  didInsertElement(positionalArgs?: Array<any>, namedArgs?: { [key: string]: any; }): void;
  didRecieveArguments(positionalArgs?: Array<any>, namedArgs?: { [key: string]: any; }): void;
  didUpdateArguments(positionalArgs?: Array<any>, namedArgs?: { [key: string]: any; }): void;
  willDestroyElement(positionalArgs?: Array<any>, namedArgs?: { [key: string]: any; }): void;

  static modifier(klass: typeof Modifier): typeof Modifier;
}

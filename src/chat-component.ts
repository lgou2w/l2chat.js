import { ChatStyle } from './chat-style'

export interface ChatComponent {

  style: ChatStyle;

  setStyle: (style?: ChatStyle) => void;

  extras: ChatComponent[];

  extraSize: number;

  append: (extra: ChatComponent) => void;

  toString: () => string;
}

export abstract class ChatComponentAbstract implements ChatComponent {

  private _style?: ChatStyle;
  private _extras: ChatComponent[] = new Array<ChatComponent>();

  get style(): ChatStyle {
    if (!this._style) {
      this._style = new ChatStyle();
      this._extras.forEach(value => value.style.setParent(this._style));
    }
    return this._style;
  }

  set style(style: ChatStyle) {
    this.setStyle(style);
  }

  setStyle = (style?: ChatStyle) => {
    this._style = style;
    this._extras.forEach(value => value.style.setParent(this._style));
  };

  get extras(): ChatComponent[] {
    return this._extras;
  }

  get extraSize(): number {
    return this._extras.length;
  }

  append = (extra: ChatComponent) => {
    extra.style.setParent(this.style);
    this._extras.push(extra);
  };

  toString = (): string => {
    return `ChatComponentAbstract{style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  }
}

export class ChatComponentText extends ChatComponentAbstract {

  text: string;

  constructor(text: string = '') {
    super();
    this.text = text;
  }

  toString = (): string => {
    return `ChatComponentText{text='${
      this.text
    }', style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  };
}

export class ChatComponentSelector extends ChatComponentAbstract {

  selector: string;

  constructor(selector: string) {
    super();
    this.selector = selector;
  }

  toString = (): string => {
    return `ChatComponentSelector{selector='${
      this.selector
    }', style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  };
}

export class ChatComponentScore extends ChatComponentAbstract {

  name: string;
  objective: string;
  value?: string;

  constructor(name: string, objective: string, value?: string) {
    super();
    this.name = name;
    this.objective = objective;
    this.value = value;
  }

  toString = (): string => {
    return `ChatComponentScope{name='${
      this.name
    }', objective='${
      this.objective
    }', value='${
      this.value
    }', style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  };
}

export class ChatComponentKeybind extends ChatComponentAbstract {

  keybind: string;

  constructor(keybind: string) {
    super();
    this.keybind = keybind;
  }

  toString = (): string => {
    return `ChatComponentKeybind{keybind='${
      this.keybind
    }', style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  };
}

export class ChatComponentTranslation extends ChatComponentAbstract {

  key: string;
  withs: any[];

  constructor(key: string, withs: any[] = []) {
    super();
    this.key = key;
    this.withs = withs;
  }

  toString = (): string => {
    return `ChatComponentTranslation{key='${
      this.key
    }', withs=[${
      this.withs.join(',')
    }], style=${
      this.style.toString()
    }, extras=[${
      this.extras.map(extra => extra.toString())
    }]}`
  };
}

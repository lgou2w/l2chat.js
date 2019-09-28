import {ChatColor, toColor} from './chat-color';
import { ChatAction, ChatClickEvent, ChatHoverEvent } from './chat-event';
import { ChatStyle } from './chat-style';
import {
  ChatComponent,
  ChatComponentAbstract,
  ChatComponentText,
  ChatComponentSelector,
  ChatComponentScore,
  ChatComponentKeybind,
  ChatComponentTranslation,
  ChatComponentRaw // internal only
} from './chat-component';

const styleSerializer = (key: string, value: any): any => {
  if (!(value instanceof ChatStyle))
    return value;
  if (value.isEmpty())
    return undefined;

  let json = <any>{};
  if (value.color)
    json.color = value.color.name;
  if (typeof value.bold === 'boolean')
    json.bold = value.bold;
  if (typeof value.italic === 'boolean')
    json.italic = value.italic;
  if (typeof value.underlined === 'boolean')
    json.underlined = value.underlined;
  if (typeof value.strikethrough === 'boolean')
    json.strikethrough = value.strikethrough;
  if (typeof value.obfuscated === 'boolean')
    json.obfuscated = value.obfuscated;
  if (typeof value.insertion === 'string')
    json.insertion = value.insertion;
  if (value.clickEvent) {
    json.clickEvent = {
      action: value.clickEvent.action,
      value: value.clickEvent.value
    }
  }
  if (value.hoverEvent) {
    json.hoverEvent = {
      action: value.hoverEvent.action,
      value: value.hoverEvent.value instanceof ChatComponentRaw
        ? value.hoverEvent.value.raw
        : componentSerializer('value', value.hoverEvent.value)
    }
  }
  return json;
};

const styleDeserializer = (json: { [key: string]: any }): ChatStyle => {
  let style = new ChatStyle();
  if (typeof json.color === 'string')
    style.color = ChatColor[json.color.toUpperCase()] || ChatColor.WHITE;
  if (typeof json.bold === 'boolean')
    style.bold = json.bold;
  if (typeof json.italic === 'boolean')
    style.italic = json.italic;
  if (typeof json.underlined === 'boolean')
    style.underlined = json.underlined;
  if (typeof json.strikethrough === 'boolean')
    style.strikethrough = json.strikethrough;
  if (typeof json.obfuscated === 'boolean')
    style.obfuscated = json.obfuscated;
  if (typeof json.insertion === 'string')
    style.insertion = json.insertion;
  if (typeof json.clickEvent === 'object') {
    if (typeof json.clickEvent.action === 'string' &&
        typeof json.clickEvent.value === 'string') {
      let action: ChatAction<ChatClickEvent, string>
        = ChatClickEvent.Action[json.clickEvent.action.toUpperCase()];
      if (action)
        style.clickEvent = action.create(json.clickEvent.value);
    }
  }
  if (typeof json.hoverEvent === 'object') {
    if (typeof json.hoverEvent.action === 'string' &&
        typeof json.hoverEvent.value === 'object') {
      let action: ChatAction<ChatHoverEvent, ChatComponent>
        = ChatHoverEvent.Action[json.hoverEvent.action.toUpperCase()];
      if (action) {
        let value = componentDeserializer(json.hoverEvent.value);
        style.hoverEvent = action.create(value);
      }
    }
  }
  return style;
};

const componentSerializer = (key: string, value: any): any => {
  if (!(value instanceof ChatComponentAbstract))
    return value;

  let json = <any>{};
  if (!value.style.isEmpty()) {
    let jsonStyle = styleSerializer('style', value.style);
    for (let key in jsonStyle)
      // noinspection JSUnfilteredForInLoop
      json[key] = jsonStyle[key];
  }
  if (value.extraSize > 0) {
    let jsonExtra = new Array<any>();
    for (let extra of value.extras)
      jsonExtra.push(componentSerializer('extra', extra));
    json.extra = jsonExtra;
  }

  if (value instanceof ChatComponentText) {
    json.text = value.text;
  } else if (value instanceof ChatComponentTranslation) {
    json.translate = value.key;
    let args = new Array<string>();
    for (let arg of value.withs) {
      if (arg instanceof ChatComponentAbstract)
        arg = componentSerializer('with', arg);
      args.push(arg);
    }
    json.with = args;
  } else if (value instanceof ChatComponentScore) {
    json.score = {
      name: value.name,
      objective: value.objective
    };
    if (value.value !== undefined)
      json.score.value = value.value;
  } else if (value instanceof ChatComponentSelector) {
    json.selector = value.selector;
  } else if (value instanceof ChatComponentKeybind) {
    json.keybind = value.keybind;
  } else {
    throw new Error(`Don\'t know how to parse ${value} into a chat component.`);
  }

  return json;
};

const componentDeserializer = (json: string | [] | { [key: string]: any }): ChatComponent => {
  if (typeof json === 'string')
    return new ChatComponentText(json);
  if (Array.isArray(json)) {
    let component;
    // @ts-ignore
    for (let extra of json) {
      let extraComponent = componentDeserializer(extra);
      if (!component)
        component = extraComponent;
      else if (extraComponent) // noinspection JSUnusedAssignment
        component.append(extraComponent);
    }
    return component;
  }
  let component;
  if (typeof json.text === 'string') {
    component = new ChatComponentText(json.text);
  } else if (typeof json.translate === 'string') {
    component = new ChatComponentTranslation(json.translate);
    let args = new Array<any>();
    let i = 0;
    if (Array.isArray(json.with)) {
      for (let arg of json.with) {
        args[i] = componentDeserializer(arg);
        if (args[i] instanceof ChatComponentText) {
          if (args[i].style.isEmpty() && args[i].extras.length <= 0)
            args[i] = args[i].text;
        }
      }
    }
    if (args.length > 0)
      component.withs = args;
  } else if (typeof json.scope === 'object') {
    let name = json.scope.name;
    let objective = json.scope.objective;
    // noinspection SuspiciousTypeOfGuard
    if (typeof name !== 'string' || typeof objective !== 'string')
      throw new Error('A score component needs a least a name and an objective.');
    component = new ChatComponentScore(name, objective);
    if (typeof json.scope.value === 'string')
      component.value = json.scope.value;
  } else if (typeof json.selector === 'string') {
    component = new ChatComponentSelector(json.selector);
  } else if (typeof json.keybind === 'string') {
    component = new ChatComponentKeybind(json.keybind);
  } else {
    throw new Error(`Don't know how to parse ${json} into a chat component.`)
  }
  if (Array.isArray(json.extra)) {
    if (json.extra.length <= 0)
      throw new Error('Invalid empty array component.');
    for (let ext of json.extra) {
      let extComponent = componentDeserializer(ext);
      if (extComponent)
        component.append(extComponent);
    }
  }
  component.style = styleDeserializer(json);
  return component;
};

export function toJson(component: ChatComponent): string {
  return JSON.stringify(component, componentSerializer)
}

export function toJsonObject(component: ChatComponent): { [key: string]: any } {
  return componentSerializer('', component);
}

export function fromJson(json: string | [] | { [key: string]: any }): ChatComponent {
  return componentDeserializer(
    typeof json === 'string'
      ? JSON.parse(json)
      : json
  );
}

const toRaw0 = (result: Array<string>, component: ChatComponent, color: boolean) => {
  if (color) {
    let style = component.style;
    if (style.color)
      result.push(style.color.toString());
    if (style.bold === true)
      result.push(ChatColor.BOLD.toString());
    if (style.italic === true)
      result.push(ChatColor.ITALIC.toString());
    if (style.underlined === true)
      result.push(ChatColor.UNDERLINE.toString());
    if (style.strikethrough === true)
      result.push(ChatColor.STRIKETHROUGH.toString());
    if (style.obfuscated === true)
      result.push(ChatColor.OBFUSCATED.toString());
  }
  if (component instanceof ChatComponentText)
    result.push(component.text);
  for (let ext of component.extras)
    toRaw0(result, ext, color);
};

export function toRaw(component: ChatComponent, color: boolean = true): string {
  let result = new Array<string>();
  toRaw0(result, component, color);
  return result.join('');
}

class RawMessage {

  private readonly raw: string;
  private readonly regex = /(§[0-9A-FK-OR])/ig;
  private currentComponent?: ChatComponent;
  private style: ChatStyle = new ChatStyle();
  private currentIndex = 0;

  constructor(raw: string) {
    this.raw = raw;
  }

  private append = (index: number) => {
    if (index > this.currentIndex) {
      let text = this.raw.substring(this.currentIndex, index);
      let extra = new ChatComponentText(text);
      extra.setStyle(this.style);
      this.currentIndex = index;
      this.style = this.style.clone();
      if (!this.currentComponent)
        this.currentComponent = new ChatComponentText();
      this.currentComponent.append(extra);
    }
  };

  get = (): ChatComponent => {
    let array;
    while ((array = this.regex.exec(this.raw)) !== null) {
      this.append(array.index);
      let match: string = array[0];
      let color = ChatColor.fromCode(match[1].toLowerCase());
      switch (color) {
        case ChatColor.RESET:
          this.style = new ChatStyle();
          break;
        case ChatColor.BOLD:
          this.style.setBold(true);
          break;
        case ChatColor.ITALIC:
          this.style.setItalic(true);
          break;
        case ChatColor.UNDERLINE:
          this.style.setUnderlined(true);
          break;
        case ChatColor.STRIKETHROUGH:
          this.style.setStrikethrough(true);
          break;
        case ChatColor.OBFUSCATED:
          this.style.setObfuscated(true);
          break;
        default:
          this.style = new ChatStyle().setColor(color);
          break;
      }
      this.currentIndex = this.regex.lastIndex;
    }
    if (this.currentIndex < this.raw.length)
      this.append(this.raw.length);

    return this.currentComponent || new ChatComponentText();
  }
}

export function fromRaw(raw: string): ChatComponent {
  let rawColor = toColor(raw);
  return new RawMessage(rawColor).get();
}

import { Color } from './chat-color'
import { ChatClickEvent, ChatHoverEvent } from './chat-event';

export class ChatStyle {

  private parent?: ChatStyle;
  color         ?: Color;
  bold          ?: boolean;
  italic        ?: boolean;
  underlined    ?: boolean;
  strikethrough ?: boolean;
  obfuscated    ?: boolean;
  clickEvent    ?: ChatClickEvent;
  hoverEvent    ?: ChatHoverEvent;
  insertion     ?: string;

  private getParent = (): ChatStyle => { return this.parent || ROOT };

  setParent = (parent?: ChatStyle): ChatStyle => {
    this.parent = parent;
    return this;
  };
  setColor = (color?: Color): ChatStyle => {
    this.color = color;
    return this;
  };
  setBold = (bold?: boolean): ChatStyle => {
    this.bold = bold;
    return this;
  };
  setItalic = (italic?: boolean): ChatStyle => {
    this.italic = italic;
    return this;
  };
  setUnderlined = (underlined?: boolean): ChatStyle => {
    this.underlined = underlined;
    return this;
  };
  setStrikethrough = (strikethrough?: boolean): ChatStyle => {
    this.strikethrough = strikethrough;
    return this;
  };
  setObfuscated = (obfuscated?: boolean): ChatStyle => {
    this.obfuscated = obfuscated;
    return this;
  };
  setClickEvent = (clickEvent?: ChatClickEvent): ChatStyle => {
    this.clickEvent = clickEvent;
    return this;
  };
  setHoverEvent = (hoverEvent?: ChatHoverEvent): ChatStyle => {
    this.hoverEvent = hoverEvent;
    return this;
  };
  setInsertion = (insertion?: string): ChatStyle => {
    this.insertion = insertion;
    return this;
  };

  getColor = (): Color | undefined => {
    return this.color || this.getParent().getColor();
  };
  getBold = (): boolean => {
    return this.bold || this.getParent().getBold();
  };
  getItalic = (): boolean => {
    return this.italic || this.getParent().getItalic();
  };
  getUnderlined = (): boolean => {
    return this.underlined || this.getParent().getUnderlined();
  };
  getStrikethrough = (): boolean => {
    return this.strikethrough || this.getParent().getStrikethrough();
  };
  getObfuscated = (): boolean => {
    return this.obfuscated || this.getParent().getObfuscated();
  };
  getClickEvent = (): ChatClickEvent | undefined => {
    return this.clickEvent || this.getParent().getClickEvent();
  };
  getHoverEvent = (): ChatHoverEvent | undefined => {
    return this.hoverEvent || this.getParent().getHoverEvent();
  };
  getInsertion = (): string | undefined => {
    return this.insertion || this.getParent().getInsertion();
  };

  isEmpty = (): boolean => {
    return !this.color &&
      !this.bold && !this.italic &&
      !this.strikethrough && !this.underlined &&
      !this.obfuscated && !this.clickEvent &&
      !this.hoverEvent && !this.insertion;
  };

  clone = (): ChatStyle => {
    let copy = new ChatStyle();
    copy.color = this.color;
    copy.bold = this.bold;
    copy.italic = this.italic;
    copy.strikethrough = this.strikethrough;
    copy.underlined = this.underlined;
    copy.obfuscated = this.obfuscated;
    copy.clickEvent = this.clickEvent;
    copy.hoverEvent = this.hoverEvent;
    copy.insertion = this.insertion;
    return copy;
  };

  toString = (): string => {
    return `ChatStyle{hasParent=${
      this.parent != null
    }, color=${
      this.color ? this.color.name : undefined
    }, bold=${this.bold}, italic=${this.italic}, underlined=${
      this.underlined
    }, strikethrough=${this.strikethrough}, obfuscated=${
      this.obfuscated
    }, clickEvent=${this.clickEvent}, hoverEvent=${
      this.hoverEvent
    }, insertion=${this.insertion}}`
  };

  static ROOT: ChatStyle;
}

class RootStyle extends ChatStyle {

  setParent = (parent?: ChatStyle): ChatStyle => { throw ERROR };
  setColor = (color?: Color): ChatStyle => { throw ERROR };
  setBold = (bold?: boolean): ChatStyle => { throw ERROR };
  setItalic = (italic?: boolean): ChatStyle => { throw ERROR };
  setUnderlined = (underlined?: boolean): ChatStyle => { throw ERROR };
  setStrikethrough = (strikethrough?: boolean): ChatStyle => { throw ERROR };
  setObfuscated = (obfuscated?: boolean): ChatStyle => { throw ERROR };
  setClickEvent = (clickEvent?: ChatClickEvent): ChatStyle => { throw ERROR };
  setHoverEvent = (hoverEvent?: ChatHoverEvent): ChatStyle => { throw ERROR };
  setInsertion = (insertion?: string): ChatStyle => { throw ERROR };

  getColor = (): Color | undefined => { return undefined };
  getBold = (): boolean => { return false };
  getItalic = (): boolean => { return false };
  getUnderlined = (): boolean => { return false };
  getStrikethrough = (): boolean => { return false };
  getObfuscated = (): boolean => { return false };
  getClickEvent = (): ChatClickEvent | undefined => { return undefined };
  getHoverEvent = (): ChatHoverEvent | undefined => { return undefined };
  getInsertion = (): string | undefined => { return undefined };

  toString = (): string => { return 'ChatStyle.ROOT' };
}

const ROOT = new RootStyle();
const ERROR = new Error('UnsupportedOperationException');

ChatStyle.ROOT = ROOT;

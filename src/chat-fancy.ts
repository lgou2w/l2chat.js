import {
  Color,
  ChatColor
} from './chat-color';
import {
  ChatClickEvent,
  ChatHoverEvent
} from './chat-event';
import {
  ChatComponent,
  ChatComponentText,
  ChatComponentRaw // internal only
} from './chat-component';
import {
  fromRaw
} from './chat-serializer';

export class ChatComponentFancy {

  protected extras = new Array<ChatComponent>();
  protected get last(): ChatComponent {
    return this.extras[this.extras.length - 1];
  }

  get size(): number { return this.extras.length }

  then = (extra: string | ChatComponent): ChatComponentFancy => {
    this.extras.push(
      typeof extra === 'string'
        ? new ChatComponentText(extra)
        : extra
    );
    return this;
  };

  thenNewLine = (): ChatComponentFancy => {
    return this.then('\n');
  };

  color = (color: Color | string): ChatComponentFancy => {
    this.last.style.setColor(
      typeof color === 'string'
        ? (ChatColor[color.toUpperCase()] || ChatColor.fromCode(color))
        : color
    );
    return this;
  };

  withBold = (): ChatComponentFancy => {
    this.last.style.setBold(true);
    return this;
  };

  withItalic = (): ChatComponentFancy => {
    this.last.style.setItalic(true);
    return this;
  };

  withUnderlined = (): ChatComponentFancy => {
    this.last.style.setUnderlined(true);
    return this;
  };

  withStrikethrough = (): ChatComponentFancy => {
    this.last.style.setStrikethrough(true);
    return this;
  };

  withObfuscated = (): ChatComponentFancy => {
    this.last.style.setObfuscated(true);
    return this;
  };

  withInsertion = (insertion: string): ChatComponentFancy => {
    this.last.style.setInsertion(insertion);
    return this;
  };

  withClickEvent = (clickEvent: ChatClickEvent): ChatComponentFancy => {
    this.last.style.setClickEvent(clickEvent);
    return this;
  };

  withHoverEvent = (hoverEvent: ChatHoverEvent): ChatComponentFancy => {
    this.last.style.setHoverEvent(hoverEvent);
    return this;
  };

  withClickOpenFile = (path: string): ChatComponentFancy => {
    this.last.style.setClickEvent(ChatClickEvent.Action.OPEN_FILE.create(path));
    return this;
  };

  withClickOpenLink = (url: string): ChatComponentFancy => {
    this.last.style.setClickEvent(ChatClickEvent.Action.OPEN_URL.create(url));
    return this;
  };

  withClickSuggestCommand = (command: string): ChatComponentFancy => {
    this.last.style.setClickEvent(ChatClickEvent.Action.SUGGEST_COMMAND.create(command));
    return this;
  };

  withClickRunCommand = (command: string): ChatComponentFancy => {
    this.last.style.setClickEvent(ChatClickEvent.Action.RUN_COMMAND.create(command));
    return this;
  };

  withClickChangePage = (index: number | string): ChatComponentFancy => {
    this.last.style.setClickEvent(ChatClickEvent.Action.CHANGE_PAGE.create(index.toString()));
    return this;
  };

  withHoverShowText = (text: string | ChatComponent): ChatComponentFancy => {
    this.last.style.setHoverEvent(ChatHoverEvent.Action.SHOW_TEXT.create(
      typeof text === 'string'
        ? fromRaw(text)
        : text
    ));
    return this;
  };

  withHoverShowTexts = (texts: Array<string>): ChatComponentFancy => {
    return this.withHoverShowText(texts.join('\n'));
  };

  withHoverShowItem = (itemMojangson: string): ChatComponentFancy => {
    this.last.style.setHoverEvent(ChatHoverEvent.Action.SHOW_ITEM.create(
      new ChatComponentRaw(itemMojangson) // internal only
    ));
    return this;
  };

  join = (other: ChatComponentFancy): ChatComponentFancy => {
    for (let extra of other.extras)
      this.extras.push(extra);
    return this;
  };

  clear = (): ChatComponentFancy => {
    this.extras = [];
    return this;
  };

  build = (): ChatComponent => {
    let component = new ChatComponentText();
    for (let extra of this.extras)
      component.extras.push(extra);
    return component;
  };
}

export function chatFancy(first: string | ChatComponent): ChatComponentFancy {
  return new ChatComponentFancy()
    .then(first);
}

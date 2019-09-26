import { ChatComponent } from './chat-component'

export type ChatAction<T, P> = {
  readonly name     : string;
  readonly toString : () => string;
  readonly create   : (value: P) => T;
};

const defineClickAction = (
  name: string
): ChatAction<ChatClickEvent, string> => {
  return {
    name,
    toString:  () => { return name },
    create: value => { return new ChatClickEvent(name, value) }
  }
};

export class ChatClickEvent {

  readonly action : string;
  readonly value  : string;

  constructor(action: string, value: string) {
    this.action = action;
    this.value  = value;
  }

  static Action = {
    OPEN_URL          : defineClickAction('open_url'),
    OPEN_FILE         : defineClickAction('open_file'),
    SUGGEST_COMMAND   : defineClickAction('suggest_command'),
    RUN_COMMAND       : defineClickAction('run_command'),
    CHANGE_PAGE       : defineClickAction('change_page'),
  }
}

const defineHoverAction = (
  name: string
): ChatAction<ChatHoverEvent, ChatComponent> => {
  return {
    name,
    toString:  () => { return name },
    create: value => { return new ChatHoverEvent(name, value) }
  }
};

export class ChatHoverEvent {

  readonly action : string;
  readonly value  : ChatComponent;

  constructor(action: string, value: ChatComponent) {
    this.action = action;
    this.value  = value;
  }

  static Action = {
    SHOW_TEXT           : defineHoverAction('show_text'),
    SHOW_ACHIEVEMENT    : defineHoverAction('show_achievement'),
    SHOW_ITEM           : defineHoverAction('show_item'),
    SHOW_ENTITY         : defineHoverAction('show_entity'),
  }
}

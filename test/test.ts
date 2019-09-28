import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';
import { ChatClickEvent, ChatHoverEvent } from '../src/chat-event';
import { ChatStyle } from '../src/chat-style'
import {
  ChatComponentText,
  ChatComponentTranslation,
  ChatComponentSelector,
  ChatComponentScore,
  ChatComponentKeybind
} from '../src/chat-component';
import {
  toJson,
  toJsonObject,
  fromJson,
  toRaw,
  fromRaw
} from '../src/chat-serializer';
import {
  ChatComponentFancy,
  chatFancy
} from '../src/chat-fancy';

describe('test', function () {
  it('should', async () => {
    // TODO expect
  });
});

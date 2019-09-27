import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';
import { ChatClickEvent, ChatHoverEvent } from '../src/chat-event';
import { ChatStyle } from '../src/chat-style'
import { ChatComponentText, ChatComponentTranslation } from '../src/chat-component';
import { toJson, fromJson, toRaw, fromRaw } from '../src/chat-serializer';

describe('test', function () {
  it('should', async () => {
    let raw = toColor('Hello&lWorld');
    let component = fromRaw(raw);
    console.log(toJson(component));
  });
});

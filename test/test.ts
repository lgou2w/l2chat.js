import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';
import { ChatClickEvent, ChatHoverEvent } from '../src/chat-event';
import { ChatStyle } from '../src/chat-style'
import { ChatComponentText, ChatComponentTranslation } from '../src/chat-component';
import { toJson, fromJson, toRaw } from '../src/chat-serializer';

describe('test', function () {
  it('should', async () => {
    let component = fromJson({
      text: 'HelloWorld',
      color: ChatColor.GREEN.name,
      bold: true
    });
    console.log(toJson(component));
    console.log(toRaw(component, false));
  });
});

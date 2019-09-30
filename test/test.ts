import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';
import { ChatClickEvent, ChatHoverEvent } from '../src/chat-event';
import { ChatStyle } from '../src/chat-style';
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

describe('test chat color', function () {
  it('should fromCode', async () => {
    expect(ChatColor.fromCode('a')).to.equal(ChatColor.GREEN);
    expect(ChatColor.fromCode('404')).to.equal(undefined);
  });
  it('should stripColor', async () => {
    expect(stripColor('§aGreen text')).to.equal('Green text');
    expect(stripColor('§?Unknown color')).to.equal('§?Unknown color');
  });
  it('should toColor', async () => {
    expect(toColor('&a')).to.equal('§a');
    expect(toColor('&?')).to.equal('&?');
  });
});

describe('test chat event', function () {
  it('should valueOf', async () => {
    expect(ChatClickEvent.Action['OPEN_URL']).to.equal(ChatClickEvent.Action.OPEN_URL);
    expect(ChatClickEvent.Action.RUN_COMMAND.name).to.equal('run_command');
    expect(ChatHoverEvent.Action['SHOW_TEXT']).to.equal(ChatHoverEvent.Action.SHOW_TEXT);
    expect(ChatHoverEvent.Action.SHOW_TEXT.name).to.equal('show_text');
  });
});

describe('test chat component', function () {
  it('should text', async () => {
    expect(new ChatComponentText('hello')).to.have.property('text', 'hello');
  });
  it('should translation', async () => {
    let component = new ChatComponentTranslation('msg.hi');
    expect(component).to.have.property('key', 'msg.hi');
    expect(component).to.have.property('withs').to.lengthOf(0);
  });
  it('should selector', async () => {
    expect(new ChatComponentSelector('@a')).to.have.property('selector', '@a');
  });
  it('should scope', async () => {
    let component = new ChatComponentScore('test', 'dummy', '1');
    expect(component).to.have.property('name', 'test');
    expect(component).to.have.property('objective', 'dummy');
    expect(component).to.have.property('value', '1');
  });
  it('should keybind', async () => {
    expect(new ChatComponentKeybind('ctrl')).to.have.property('keybind', 'ctrl');
  });
});

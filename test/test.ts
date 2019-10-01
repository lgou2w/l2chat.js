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

describe('test chat json', function () {
  it('should toJsonObject', async () => {
    let component = new ChatComponentText('msg');
    component.style = new ChatStyle().setColor(ChatColor.RED);
    let json = toJsonObject(component);
    expect(json.text).to.equal('msg');
    expect(json.color).to.equal('red');
  });
  it('should toJson', async () => {
    let component = new ChatComponentText('msg');
    component.style
      .setColor(ChatColor.GOLD)
      .setBold(true);
    let json = toJson(component);
    expect(json).to.equal('{"color":"gold","bold":true,"text":"msg"}');
  });
  it('should fromJson', async () => {
    let json = '{"text":"hello","color":"red","bold":true}';
    let component = fromJson(json);
    expect(component).to.instanceOf(ChatComponentText);
    expect(component).to.have.property('text').to.equal('hello');
    expect(component.style.color).to.equal(ChatColor.RED);
    expect(component.style.bold).to.equal(true);
  });
});

describe('test chat raw', function () {
  it('should toRaw', async () => {
    let component = new ChatComponentText('HelloWorld');
    component.style
      .setColor(ChatColor.RED)
      .setBold(true);
    expect(toRaw(component, false)).to.equal('HelloWorld');
    expect(toRaw(component, true)).to.equal('§c§lHelloWorld');
  });
  it('should fromRaw', async () => {
    let raw = '§6sample &7text';
    let component = fromRaw(raw);
    expect(component).to.instanceOf(ChatComponentText);
    expect(component.extraSize).to.equal(2); // [sample, text]
    expect(component.extras[0].style.color).to.equal(ChatColor.GOLD);
    expect(component.extras[1].style.color).to.equal(ChatColor.GRAY);
  });
});

describe('test chat fancy', function () {
  it('should', async () => {
    let raw = chatFancy('1')
      .color(ChatColor.GOLD)
      .then('2')
      .color(ChatColor.GREEN)
      .then('3')
      .color(ChatColor.RED)
      .build()
      .toRaw();
    expect(raw).to.equal('§61§a2§c3');
  });
});

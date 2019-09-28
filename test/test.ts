import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';
import { ChatClickEvent, ChatHoverEvent } from '../src/chat-event';
import { ChatStyle } from '../src/chat-style'
import { ChatComponentText, ChatComponentTranslation } from '../src/chat-component';
import { toJson, fromJson, toRaw, fromRaw } from '../src/chat-serializer';
import { ChatComponentFancy, chatFancy } from '../src/chat-fancy';

import {toMojangson, tagByte, tagString, tagCompound, tagList, tagInt, tagShort} from 'l2nbt/dist/l2nbt';

describe('test', function () {
  it('should', async () => {
    console.log(
      chatFancy('< ')
        .color(ChatColor.GREEN)
        .withBold()
        .then('Hello World')
        .color(ChatColor.RED)
        .withUnderlined()
        .withClickOpenLink('https://github.com/lgou2w')
        .withHoverShowItem(
          toMojangson(tagCompound({
            id: tagString('minecraft:diamond_sword'),
            Count: tagByte(1),
            tag: tagCompound({
              display: tagCompound({
                Name: tagString(fromRaw('&6物品展示').toJson()),
                Lore: tagList([
                  tagString(fromRaw('&a标签').toJson()),
                  tagString(fromRaw('&c2333').toJson())
                ])
              }),
              Enchantments: tagList([
                tagCompound({
                  id: tagString('unbreaking'),
                  lvl: tagInt(5)
                })
              ])
            })
          }))
        )
        .then(' >')
        .color(ChatColor.GREEN)
        .withBold()
        .build()
        .toJson()
    );
  });
});

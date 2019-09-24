import { expect } from 'chai';
import { ChatColor, stripColor, toColor } from '../src/chat-color';

describe('test', function () {
  it('should color', async () => {
    expect(ChatColor.fromCode('a')).to.equal(ChatColor.GREEN);
  });
});

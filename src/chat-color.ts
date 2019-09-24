export interface Color {
  readonly name: string,
  readonly code: string,
  readonly isFormat: boolean
}

const defineColor = (
  name: string,
  code: string,
  isFormat: boolean = false
): Color => {
  return {name, code, isFormat};
};

export const ChatColor = {

  BLACK           : defineColor('black',         '0'),
  DARK_BLUE       : defineColor('dark_blue',     '1'),
  DARK_GREEN      : defineColor('dark_green',    '2'),
  DARK_AQUA       : defineColor('dark_aqua',     '3'),
  DARK_RED        : defineColor('dark_red',      '4'),
  DARK_PURPLE     : defineColor('dark_purple',   '5'),
  GOLD            : defineColor('gold',          '6'),
  GRAY            : defineColor('gray',          '7'),
  DARK_GRAY       : defineColor('dark_gray',     '8'),
  BLUE            : defineColor('blue',          '9'),
  GREEN           : defineColor('green',         'a'),
  AQUA            : defineColor('aqua',          'b'),
  RED             : defineColor('red',           'c'),
  LIGHT_PURPLE    : defineColor('light_purple',  'd'),
  YELLOW          : defineColor('yellow',        'e'),
  WHITE           : defineColor('white',         'f'),

  OBFUSCATED      : defineColor('obfuscated',    'k', true),
  BOLD            : defineColor('bold',          'l', true),
  STRIKETHROUGH   : defineColor('strikethrough', 'm', true),
  UNDERLINE       : defineColor('underline',     'n', true),
  ITALIC          : defineColor('italic',        'o', true),

  RESET           : defineColor('reset',         'r'),
};

// Color character
const CHAR_COLOR = '§';
const CHAR_CODES = '0123456789AaBbCcDdEeFfKkLlMmNnOoRr';
const STRIP_COLOR = /§[0-9A-FK-OR]/i;

export const stripColor = (input: string): string => {
  return input.replace(STRIP_COLOR, '');
};

export const toColor = (
  input: string,
  altColorChar: string = '&'
): string => {
  let chars = input.split('');
  let length = input.length;
  for (let i = 0; i < length; i++) {
    if (chars[i] === altColorChar && CHAR_CODES.indexOf(chars[i + 1]) > -1) {
      chars[i] = (CHAR_COLOR);
      chars[i + 1] = input[i + 1].toLowerCase();
    }
  }
  return chars.join('');
};

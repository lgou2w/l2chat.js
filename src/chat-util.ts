import { Color, ChatColor } from './chat-color';
import { ChatComponent, ChatComponentText } from './chat-component';

const REG_WHITESPACE = /\s/g;
const WHITESPACE = '&nbsp;';
const TAG_TYPE = 'span';
const CLASS_ROOT = 'l2chat';
const CLASS_COLOR = (color: Color, shadow?: boolean): string => {
  let colorName = CLASS_ROOT + '-' + color.name.replace(/_/g, '-');
  return !color.isFormat && color !== ChatColor.RESET && shadow === true
    ? colorName + '-shadow'
    : colorName
};

const STYLE_COLOR = {
  [ChatColor.BLACK.name]        : { color: '#000', shadow: 'none' },
  [ChatColor.DARK_BLUE.name]    : { color: '#00A', shadow: '#00002A' },
  [ChatColor.DARK_GREEN.name]   : { color: '#0A0', shadow: '#002A00' },
  [ChatColor.DARK_AQUA.name]    : { color: '#0AA', shadow: '#002A2A' },
  [ChatColor.DARK_RED.name]     : { color: '#A00', shadow: '#2A0000' },
  [ChatColor.DARK_PURPLE.name]  : { color: '#A0A', shadow: '#2A002A' },
  [ChatColor.GOLD.name]         : { color: '#FA0', shadow: '#2A2A00' },
  [ChatColor.DARK_GRAY.name]    : { color: '#555', shadow: '#151515' },
  [ChatColor.BLUE.name]         : { color: '#55F', shadow: '#15153F' },
  [ChatColor.GREEN.name]        : { color: '#5F5', shadow: '#153F15' },
  [ChatColor.AQUA.name]         : { color: '#5FF', shadow: '#153F3F' },
  [ChatColor.RED.name]          : { color: '#F55', shadow: '#3F1515' },
  [ChatColor.LIGHT_PURPLE.name] : { color: '#F5F', shadow: '#3F153F' },
  [ChatColor.YELLOW.name]       : { color: '#FF5', shadow: '#3F3F15' },
  [ChatColor.WHITE.name]        : { color: '#FFF', shadow: '#3F3F3F' },
};

const generateHTMLFromBrowser = (
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
): HTMLElement => {
  let root = document.createElement(TAG_TYPE);
  let child = generateHTMLFromBrowser0(component, shadow, styleLocal);
  root.className = CLASS_ROOT;
  root.appendChild(child);
  return root;
};

const generateHTMLFromBrowser0 = (
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
): HTMLElement => {
  let parent = document.createElement(TAG_TYPE);
  let style = component.style;
  let color = style.getColor();

  if (styleLocal !== true) {
    if (color)
      parent.classList.add(CLASS_COLOR(color, shadow));
    if (style.getBold())
      parent.classList.add(CLASS_COLOR(ChatColor.BOLD));
    if (style.getItalic())
      parent.classList.add(CLASS_COLOR(ChatColor.ITALIC));
    if (style.getUnderlined())
      parent.classList.add(CLASS_COLOR(ChatColor.UNDERLINE));
    if (style.getStrikethrough())
      parent.classList.add(CLASS_COLOR(ChatColor.STRIKETHROUGH));
    if (style.getObfuscated())
      parent.classList.add(CLASS_COLOR(ChatColor.OBFUSCATED));
  } else {
    if (color) {
      parent.style.color = STYLE_COLOR[color.name].color;
      if (shadow === true)
        parent.style.textShadow = STYLE_COLOR[color.name].shadow
    }
    if (style.getBold())
      parent.style.fontWeight = 'bold';
    if (style.getItalic())
      parent.style.fontSize = 'italic';
    if (style.getUnderlined())
      parent.style.textDecoration = 'underline';
    if (style.getStrikethrough())
      parent.style.textDecoration = 'line-through';
    //if (style.getObfuscated())
      // TODO: Text Obfuscated
  }

  if (component instanceof ChatComponentText)
    parent.innerText = component.text.replace(REG_WHITESPACE, WHITESPACE);
  for (let extra of component.extras)
    parent.appendChild(generateHTMLFromBrowser0(extra, shadow, styleLocal));
  return parent;
};

const generateHTMLFromCommon = (
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
): string => {
  let html = new Array<string>();
  html.push(`<span class="${CLASS_ROOT}">`);
  generateHTMLFromCommon0(html, component, shadow, styleLocal);
  html.push('</span>');
  return html.join('');
};

const generateHTMLFromCommon0 = (
  html: Array<string>,
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
) => {
  let style = component.style;
  let color = style.getColor();

  if (styleLocal !== true) {
    let classList = new Array<string>();
    if (color)
      classList.push(CLASS_COLOR(color, shadow));
    if (style.getBold())
      classList.push(CLASS_COLOR(ChatColor.BOLD));
    if (style.getItalic())
      classList.push(CLASS_COLOR(ChatColor.ITALIC));
    if (style.getUnderlined())
      classList.push(CLASS_COLOR(ChatColor.UNDERLINE));
    if (style.getStrikethrough())
      classList.push(CLASS_COLOR(ChatColor.STRIKETHROUGH));
    if (style.getObfuscated())
      classList.push(CLASS_COLOR(ChatColor.OBFUSCATED));
    if (classList.length > 0)
      html.push(`<span class="${classList.join(' ')}">`);
    else
      html.push('<span>');
  } else {
    let styleList = new Array<string>();
    if (color) {
      const styleColor = STYLE_COLOR[color.name];
      styleList.push(`color: ${styleColor.color}`);
      if (shadow === true)
        styleList.push(`text-shadow: ${styleColor.shadow}`)
    }
    if (style.getBold())
      styleList.push('font-weight: bold');
    if (style.getItalic())
      styleList.push('font-style: italic');
    if (style.getUnderlined())
      styleList.push('text-decoration: underline');
    if (style.getStrikethrough())
      styleList.push('text-decoration: line-through');
    //if (style.getObfuscated())
      // TODO: Text Obfuscated
    if (styleList.length > 0)
      html.push(`<span style="${styleList.join('; ')}">`);
    else
      html.push('<span>');
  }

  if (component instanceof ChatComponentText)
    html.push(component.text.replace(REG_WHITESPACE, WHITESPACE));
  for (let extra of component.extras)
    generateHTMLFromCommon0(html, extra, shadow, styleLocal);
  html.push('</span>');
};

export function generateHTML(
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
): HTMLElement | string {
  return typeof window !== 'undefined'
    ? generateHTMLFromBrowser(component, shadow, styleLocal)
    : generateHTMLFromCommon(component, shadow, styleLocal);
}

export function generateHTMLString(
  component: ChatComponent,
  shadow?: boolean,
  styleLocal?: boolean
): string {
  return generateHTMLFromCommon(component, shadow, styleLocal);
}

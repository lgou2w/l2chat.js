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

const generateHTMLFromBrowser = (
  component: ChatComponent,
  shadow?: boolean
): HTMLElement => {
  let root = document.createElement(TAG_TYPE);
  let child = generateHTMLFromBrowser0(component, shadow);
  root.className = CLASS_ROOT;
  root.appendChild(child);
  return root;
};

const generateHTMLFromBrowser0 = (
  component: ChatComponent,
  shadow?: boolean
): HTMLElement => {
  let parent = document.createElement(TAG_TYPE);
  let style = component.style;
  let color = style.getColor();
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
  if (component instanceof ChatComponentText)
    parent.innerText = component.text.replace(REG_WHITESPACE, WHITESPACE);
  for (let extra of component.extras)
    parent.appendChild(generateHTMLFromBrowser0(extra, shadow));
  return parent;
};

const generateHTMLFromCommon = (
  component: ChatComponent,
  shadow?: boolean
): string => {
  let html = new Array<string>();
  html.push(`<span class="${CLASS_ROOT}">`);
  generateHTMLFromCommon0(html, component, shadow);
  html.push('</span>');
  return html.join('');
};

const generateHTMLFromCommon0 = (
  html: Array<string>,
  component: ChatComponent,
  shadow?: boolean
) => {
  let classList = new Array<string>();
  let style = component.style;
  let color = style.getColor();
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
  html.push(`<span class="${classList.join(' ')}">`);
  if (component instanceof ChatComponentText)
    html.push(component.text.replace(REG_WHITESPACE, WHITESPACE));
  for (let extra of component.extras)
    generateHTMLFromCommon0(html, extra, shadow);
  html.push('</span>');
};

export function generateHTML(
  component: ChatComponent,
  shadow?: boolean
): HTMLElement | string {
  return typeof window !== 'undefined'
    ? generateHTMLFromBrowser(component, shadow)
    : generateHTMLFromCommon(component, shadow);
}

export function generateHTMLString(
  component: ChatComponent,
  shadow?: boolean
): string {
  return generateHTMLFromCommon(component, shadow);
}

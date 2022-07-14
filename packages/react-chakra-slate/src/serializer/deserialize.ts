import camelCase from 'lodash.camelcase';
import { jsx } from 'slate-hyperscript';

export function deserializeElement(el: any, markAttributes: any = {}) {
  const style: any = {}
  const styleAtr = el?.getAttribute?.("style") ?? "";
  const styleParts = styleAtr.split(";");
  if (styleParts.length) {
    for (const part of styleParts) {
      const labelValue = part.split(":").map(x => x?.trim?.() ?? x);
      const [label, value] = labelValue;
      if (label && value) style[camelCase(label)] = value;
    }
  }

  const nodeAttributes: any = { ...markAttributes };

  if (el?.nodeType === Node.TEXT_NODE) {
    if (style.color) nodeAttributes.color = `color-${style?.color}`;
    return jsx("text", nodeAttributes, el.textContent);
  } else if (el?.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (el?.nodeName === "CODE") markAttributes.code = true;
  if (el?.nodeName === "STRONG") markAttributes.bold = true;
  if (el?.nodeName === "EM") markAttributes.italic = true;
  if (el?.nodeName === "U") markAttributes.underline = true;

  const children = Array.from(el?.childNodes).map(node => deserializeElement(node, nodeAttributes)).flat();

  if (children.length === 0) {
    children.push(jsx("text", nodeAttributes, ""));
  }

  const typeMap = {
    BODY: jsx("fragment", {}, children),
    BR: "\n",
    BLOCKQUOTE: jsx("element", { type: "block-quote" }, children),
    P: jsx("element", { type: "paragraph" }, children),
    A: jsx("element", { type: "link", url: el?.getAttribute?.("href") }, children),
    H1: jsx("element", { type: "heading-one" }, children),
    H2: jsx("element", { type: "heading-two" }, children),
    H3: jsx("element", { type: "heading-three" }, children),
    UL: jsx("element", { type: "bulleted-list" }, children),
    OL: jsx("element", { type: "numbered-list" }, children),
    LI: jsx("element", { type: "list-item" }, children),
    SPAN: jsx("text", { style, color: style?.color ? `color-${style.color}` : undefined }, el?.textContent),
  };

  return typeMap[el?.nodeName] ?? children;
}

export default function deserialize(html: string) {
  const parser = new DOMParser();
  const el = parser.parseFromString(html, "text/html");
  return deserializeElement(el?.body);
}

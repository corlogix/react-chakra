import { Text } from 'slate';
import { SlateNode } from '../types';
import escapeHtml from "escape-html";
import { RichBlockTypes } from '../components/RichBlock';


export function serializeElement(node: SlateNode) {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.color) string = `<span color="${node?.color?.replace?.("color-", "")}">${string}</span>`;
    if (node.bold) string = `<strong>${string}</strong>`;
    if (node.italic) string = `<em>${string}</em>`;
    if (node.underline) string = `<u>${string}</u>`;
    if (node.code) string = `<code>${string}</code>`;
    return string;
  }

  const children = node.children.map(serializeElement).join("");

  const typeMap: Record<typeof RichBlockTypes[number], string> = {
    "paragraph": `<p>${children}</p>`,
    "link": `<a href="${escapeHtml(node?.url)}">${children}</a>`,
    "block-quote": `<blockquote><p>${children}</p></blockquote>`,
    "bulleted-list": `<ul>${children}</ul>`,
    "numbered-list": `<ol>${children}</ol>`,
    "list-item": `<li>${children}</li>`,
    "heading-one": `<h1>${children}</h1>`,
    "heading-two": `<h2>${children}</h2>`,
    "heading-three": `<h3>${children}</h3>`,
    span: null
  }
  return typeMap[node.type] ?? children
}

export default function serialize(nodes: SlateNode[]) {
  return nodes.map(serializeElement).join("");
}
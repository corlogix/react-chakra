import { Editor, Editor as SlateEditor, Transforms } from 'slate';
import { EditorProps, SlateElement, SlateNode } from '../types';

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TYPO_TYPES = ["paragraph", "heading-three", "heading-two", "heading-one"] as const;

export function isBlockActive(editor: EditorProps, format: string) {
  const nodeGen: any = SlateEditor.nodes<SlateNode>(editor, {
    match: (n) => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  })

  let node = nodeGen?.next?.();
  while (!node?.done) {
    return true;
  }
  return false;
}

export function isMarkActive(editor: EditorProps, format: string) {
  const marks: any = SlateEditor.marks(editor);

  if (marks?.color && format.startsWith("color")) {
    return marks?.color?.includes?.(format)
  }

  return marks ? marks[format] === true : false;
}

export function toggleBlock(editor: EditorProps, format: string) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes((!SlateEditor.isEditor(editor) && SlateElement.isElement(n) && n.type) as string)
  });

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  };

  Transforms.setNodes<SlateNode>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function toggleMark(editor: EditorProps, format: string) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    if (format.includes("color-")) {
      Editor.addMark(editor, "color", format);
    } else {
      Editor.addMark(editor, format, true);
    }
  }
}

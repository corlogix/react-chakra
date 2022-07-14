import { Editor, Element, ElementInterface, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type EditorProps = Editor | ReactEditor | HistoryEditor;

export interface SlateElementInterface extends ElementInterface {
  isElement: (value: any) => value is Element & { type: string };
}

export const SlateElement = Element as SlateElementInterface;

export type SlateNode = Node & {
  type?: string;
  text?: string;
  children?: SlateNode[];
  [atr: string]: any;
};
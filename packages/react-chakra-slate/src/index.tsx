import { Box, ThemeTypings } from "@chakra-ui/react";
import isHotkey from "is-hotkey";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createEditor, Editor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { RichBlock } from "./components/RichBlock";
import { RichLeaf } from "./components/RichLeaf";
import { Toolbar } from "./components/Toolbar";
import { toggleMark } from "./components/utils";
import deserialize from "./serializer/deserialize";
import serialize from "./serializer/serialize";
import { SlateNode } from "./types";

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export const initialValue: SlateNode[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export type RichTextEditorProps = {
  value: string | SlateNode[];
  onChange?: (value: RichTextEditorProps["value"]) => void;
  serializeOnChange?: boolean;
  options?: { colorScheme?: ThemeTypings["colorSchemes"] };
};

export default function RichTextEditor({
  value,
  onChange = () => null,
  serializeOnChange = false,
}: RichTextEditorProps) {
  const editor = useMemo(
    () => withHistory(withReact(createEditor() as any)),
    []
  );

  const [valueCache, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);

  const divRef = useRef(null);
  const selectionRef = useRef(editor?.selection);

  useEffect(() => {
    if (typeof value === "string") {
      console.log({ deserialize: deserialize(value) });
      setValue(deserialize(value));
    } else setValue(value);
  }, [value]);

  const renderBlock = useCallback((props) => <RichBlock {...props} />, []);
  const renderLeaf = useCallback((props) => <RichLeaf {...props} />, []);

  const focusEditor = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === divRef.current) {
        ReactEditor.focus(editor);
        e.preventDefault();
      }
    },
    [editor]
  );

  const onFocus = useCallback(() => {
    setFocus(true);
    if (!editor.selection && value.length) {
      Transforms.select(
        editor,
        selectionRef?.current ?? Editor.end(editor, [])
      );
    }
  }, [editor]);

  const onBlur = useCallback(() => {
    setFocus(false);
    selectionRef.current = editor.selection;
  }, [editor]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, e)) {
        e.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  const handleChange = (nextValue) => {
    setValue(nextValue);
    onChange(serializeOnChange ? serialize(nextValue) : nextValue);
  };

  return (
    <Box ref={divRef} onMouseDown={focusEditor} borderWidth="1px">
      <Slate editor={editor} value={valueCache} onChange={handleChange}>
        <Toolbar />
        <Box padding="15px 10px">
          <Editable
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            renderElement={renderBlock}
            renderLeaf={renderLeaf}
            placeholder="Enter some text..."
            spellCheck
            style={{
              resize: "vertical",
              overflow: "auto",
              height: 150,
              maxHeight: 300,
              minHeight: 150,
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
}

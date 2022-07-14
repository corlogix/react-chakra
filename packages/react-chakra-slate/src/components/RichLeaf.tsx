import { chakra, useColorMode } from "@chakra-ui/react";

export const RichLeafTypes = [
  "span",
  "heading-one",
  "heading-two",
  "block-quote",
  "numbered-list",
  "bulleted-list",
  "list-item",
] as const;

export function RichLeaf({ attributes, children, leaf }) {
  const { colorMode } = useColorMode();

  if (leaf?.code)
    children = (
      <chakra.code
        padding="3px"
        backgroundColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      >
        {children}
      </chakra.code>
    );

  if (leaf?.bold) children = <strong>{children}</strong>;
  if (leaf?.italic) children = <em>{children}</em>;
  if (leaf?.underline) children = <u>{children}</u>;

  return (
    <chakra.span {...attributes} color={leaf?.color?.replace?.("color-", "")}>
      {children}
    </chakra.span>
  );
}

import {
  chakra,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

export const RichBlockTypes = [
  "span",
  "paragraph",
  "heading-one",
  "heading-two",
  "heading-three",
  "block-quote",
  "numbered-list",
  "bulleted-list",
  "list-item",
  "link",
] as const;

export function RichBlock({ attributes, children, element }) {
  const typeMap: Record<typeof RichBlockTypes[number], JSX.Element> = {
    "block-quote": (
      <chakra.blockquote
        padding="0.5em 10px"
        margin="1.5em 10px"
        borderLeftWidth="10px"
        borderLeftColor="gray.200"
        {...attributes}
      >
        {children}
      </chakra.blockquote>
    ),
    "list-item": <ListItem {...attributes}>{children}</ListItem>,
    "numbered-list": (
      <OrderedList ml="1.9em" {...attributes}>
        {" "}
        {children}
      </OrderedList>
    ),
    "bulleted-list": (
      <UnorderedList ml="1.9em" {...attributes}>
        {" "}
        {children}
      </UnorderedList>
    ),
    "heading-one": (
      <Heading as="h1" size="xl" {...attributes}>
        {children}
      </Heading>
    ),
    "heading-two": (
      <Heading as="h2" size="lg" {...attributes}>
        {children}
      </Heading>
    ),
    "heading-three": (
      <Heading as="h3" size="md" {...attributes}>
        {children}
      </Heading>
    ),
    link: (
      <a href={element?.url ?? ""} target="_blank">
        {children}
      </a>
    ),
    paragraph: null,
    span: (
      <span {...attributes} style={element?.style}>
        {children}
      </span>
    ),
  };
  return typeMap[element?.type] ?? <p {...attributes}>{children}</p>;
}

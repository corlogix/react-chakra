import {
  Box,
  Button,
  chakra,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { Editor as SlateEditor } from "slate";
import { useSlate } from "slate-react";
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  TYPO_TYPES,
} from "./utils";
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
} from "react-icons/md";
import { BiChevronDown } from "react-icons/all";
import { RichTextEditorProps } from "../index";

export const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: ReactElement;
}) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <IconButton
      variant="outline"
      colorScheme="gray"
      isActive={isActive}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      aria-label={format}
      icon={icon}
      borderWidth={0}
      fontSize="20px"
    />
  );
};

export const BlockButton = ({
  format,
  icon,
}: {
  format: string;
  icon: ReactElement;
}) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);
  return (
    <IconButton
      variant="outline"
      colorScheme="gray"
      isActive={isActive}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      aria-label={format}
      icon={icon}
      borderWidth={0}
      fontSize="20px"
    />
  );
};

export const TypographyPicker = () => {
  const editor = useSlate();

  const typoMap: Record<typeof TYPO_TYPES[number], string> = {
    paragraph: "Paragraph",
    "heading-one": "Heading 1",
    "heading-two": "Heading 2",
    "heading-three": "Heading 3",
  };

  const items = TYPO_TYPES.map((value) => ({
    value,
    label: typoMap[value],
    active: isBlockActive(editor, value),
  }));

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BiChevronDown style={{ marginLeft: "-3px" }} />}
        variant="outline"
        paddingRight="unset"
        paddingLeft="1"
        borderWidth={0}
        fontWeight={400}
      >
        {items?.find?.((x) => x.active)?.label ?? typoMap.paragraph}
      </MenuButton>
      <MenuList width="unset" minWidth="unset">
        {items.map(({ label, value }, key) => {
          return (
            <MenuItem
              key={key}
              as={Button}
              borderRadius="unset"
              variant="outline"
              borderWidth={0}
              onClick={(e) => {
                e.preventDefault();
                toggleBlock(editor, value);
              }}
            >
              {label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export const ColorPicker = () => {
  const editor = useSlate();

  const options = [
    {
      value: "red",
      label: "color-red",
      active: isMarkActive(editor, "color-red"),
    },
    {
      value: "blue",
      label: "color-blue",
      active: isMarkActive(editor, "color-blue"),
    },
    {
      value: "green",
      label: "color-green",
      active: isMarkActive(editor, "color-green"),
    },
    {
      value: "grey",
      label: "color-grey",
      active: isMarkActive(editor, "color-grey"),
    },
    {
      value: "black",
      label: "color-black",
      active: isMarkActive(editor, "color-black"),
    },
  ];

  const activeColor =
    options.find((o) => o.active) ?? options.find((o) => o.value === "black");

  return (
    <Menu placement="bottom">
      <IconButton
        as={MenuButton}
        icon={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <chakra.p fontSize="lg">A</chakra.p>
            <Box background={activeColor?.value} w="17px" h="3px" mt={-1.8} />
          </div>
        }
        aria-label="color-picker"
        variant={"outline"}
        colorScheme="gray"
        textAlign="center"
        fontSize="20px"
        borderWidth={0}
      />
      <MenuList width="unset" minWidth="unset">
        {options.map(({ label, value, active }, key) => (
          <MenuItem
            key={key}
            as={Button}
            isActive={active}
            onClick={(e) => {
              e.preventDefault();
              toggleMark(editor, label);
            }}
            variant="outline"
            colorScheme="gray"
            borderRadius={0}
            borderWidth={0}
            width="unset"
          >
            <Box background={value} w="20px" h="20px" borderRadius="50%" />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export function Toolbar({ options }: Pick<RichTextEditorProps, "options">) {
  return (
    <HStack
      borderWidth="0 0 1px 0"
      padding="10px 5px"
      spacing="5px"
      wrap="wrap"
    >
      {/* <BlockButton format="heading-one" icon={<MdLooksOne />} />
      <BlockButton format="heading-two" icon={<MdLooksTwo />} /> */}
      <TypographyPicker />
      <ColorPicker />
      <Divider orientation="vertical" h="25px" />
      <MarkButton format="bold" icon={<MdFormatBold />} />
      <MarkButton format="italic" icon={<MdFormatItalic />} />
      <MarkButton format="underline" icon={<MdFormatUnderlined />} />
      <MarkButton format="code" icon={<MdCode />} />
      <Divider orientation="vertical" h="25px" />
      <BlockButton format="block-quote" icon={<MdFormatQuote />} />
      <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
      <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} />
    </HStack>
  );
}

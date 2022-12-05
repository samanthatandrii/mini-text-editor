import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import {
  Editable,
  withReact,
  Slate,
  ReactEditor,
  useSlate,
  RenderElementProps,
  RenderLeafProps
} from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor
} from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import {
  LIST_TYPE,
  SHORT_KEY,
  TEXT_ALIGNMENT_TYPES
} from '../../shared/constants';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaUnderline
} from 'react-icons/fa';
import { TbChevronDown, TbSquare1, TbSquare2 } from 'react-icons/tb';
import { MdFormatListBulleted, MdFormatQuote } from 'react-icons/md';
import { BsListTask } from 'react-icons/bs';
import { VscListOrdered } from 'react-icons/vsc';
import Element from './Element';
import Leaf from './Leaf';
import { ElementType, TextAlign } from '../../module/slate';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    align: 'right',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text bold, or add a semantically rendered block quote in the middle of the page",
        bold: false,
        code: true
      }
    ]
  }
];

const blockElement = [
  'paragraph',
  'heading-one',
  'heading-two',
  'block-quote',
  'list-item',
  'numbered-list',
  'bulleted-list',
  'circle-list'
];

const TextEditor = () => {
  const [value, setValue] = useState(initialValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const isBlockActive = (
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: string,
    blockType = 'type'
  ) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        match: (n) => {
          type ObjectKey = keyof typeof n;
          const key = blockType as ObjectKey;
          return SlateElement.isElement(n) && n[key] === format;
        }
      })
    );

    return match === undefined ? false : true;
  };

  const isMarkActive = (
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: string
  ) => {
    const marks = Editor.marks(editor);
    type ObjectKey = keyof typeof marks;
    const key = format as ObjectKey;
    return marks ? marks[key] === true : false;
  };

  const toggleBlock = (format: ElementType) => {
    const isActive = isBlockActive(editor, format, 'type');
    const isList = LIST_TYPE.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPE.includes(n.type),
      split: true
    });

    const type = isActive ? 'paragraph' : isList ? 'list-item' : format;
    const newProperties: Partial<SlateElement> = {
      type
    };
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, align: undefined, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const toggleBlockAlignment = (format: TextAlign) => {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        !TEXT_ALIGNMENT_TYPES.includes(format),
      split: true
    });

    const newProperties: Partial<SlateElement> = {
      align: format
    };
    Transforms.setNodes<SlateElement>(editor, newProperties);
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toolbar = (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      flexWrap="wrap"
    >
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              rightIcon={<TbChevronDown />}
              width="150px"
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              backgroundColor="white"
              fontWeight="medium"
              mx={2}
              mb={4}
            >
              {listMenuDisplay()}
            </MenuButton>
            <MenuList>
              <MenuItem
                display="flex"
                justifyContent="space-between"
                onClick={(event) => {
                  event.preventDefault();
                  toggleBlock('paragraph');
                }}
              >
                <span>Normal Text</span>
              </MenuItem>
              <MenuItem
                display="flex"
                justifyContent="space-between"
                onClick={(event) => {
                  event.preventDefault();
                  toggleBlock('heading-one');
                }}
              >
                <span>Heading 1</span>
                <TbSquare1 />
              </MenuItem>
              <MenuItem
                display="flex"
                justifyContent="space-between"
                onClick={(event) => {
                  event.preventDefault();
                  toggleBlock('heading-two');
                }}
              >
                <span>Heading 2</span>
                <TbSquare2 />
              </MenuItem>
              <MenuItem
                display="flex"
                justifyContent="space-between"
                onClick={(event) => {
                  event.preventDefault();
                  toggleBlock('block-quote');
                }}
              >
                <span>Blockquote</span>
                <MdFormatQuote />
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
      <ButtonGroup
        size="md"
        isAttached
        variant="outline"
        display="flex"
        justifyContent="center"
        mb={4}
        mr={2}
      >
        <ToolbarButton
          type="mark"
          format="bold"
          icon={<FaBold />}
          onClick={() => toggleMark('bold')}
          isActive={isMarkActive}
        />
        <ToolbarButton
          type="mark"
          format="italic"
          icon={<FaItalic />}
          onClick={() => toggleMark('italic')}
          isActive={isMarkActive}
        />
        <ToolbarButton
          type="mark"
          format="underline"
          icon={<FaUnderline />}
          onClick={() => toggleMark('underline')}
          isActive={isMarkActive}
        />
        <ToolbarButton
          type="mark"
          format="code"
          icon={<FaCode />}
          onClick={() => toggleMark('code')}
          isActive={isMarkActive}
        />
        <ToolbarButton
          type="mark"
          format="highlight"
          icon={<FaHighlighter />}
          onClick={() => toggleMark('highlight')}
          isActive={isMarkActive}
        />
      </ButtonGroup>
      <ButtonGroup
        size="md"
        isAttached
        variant="outline"
        display="flex"
        justifyContent="center"
        mb={4}
        mr={2}
      >
        <ToolbarButton
          type="block"
          format="numbered-list"
          icon={<VscListOrdered />}
          onClick={() => toggleBlock('numbered-list')}
          isActive={isBlockActive}
        />
        <ToolbarButton
          type="block"
          format="circle-list"
          icon={<BsListTask />}
          onClick={() => toggleBlock('circle-list')}
          isActive={isBlockActive}
        />
        <ToolbarButton
          type="block"
          format="bulleted-list"
          icon={<MdFormatListBulleted />}
          onClick={() => toggleBlock('bulleted-list')}
          isActive={isBlockActive}
        />
      </ButtonGroup>
      <ButtonGroup
        size="md"
        isAttached
        variant="outline"
        display="flex"
        justifyContent="center"
        mb={4}
      >
        <ToolbarButton
          type="block"
          format="left"
          icon={<FaAlignLeft />}
          onClick={() => toggleBlockAlignment('left')}
          isActive={isBlockActive}
        />
        <ToolbarButton
          type="block"
          format="center"
          icon={<FaAlignCenter />}
          onClick={() => toggleBlockAlignment('center')}
          isActive={isBlockActive}
        />
        <ToolbarButton
          type="block"
          format="right"
          icon={<FaAlignRight />}
          onClick={() => toggleBlockAlignment('right')}
          isActive={isBlockActive}
        />
        <ToolbarButton
          type="block"
          format="justify"
          icon={<FaAlignJustify />}
          onClick={() => toggleBlockAlignment('justify')}
          isActive={isBlockActive}
        />
      </ButtonGroup>
    </Box>
  );

  const listMenuDisplay = () => {
    for (const key of blockElement) {
      if (isBlockActive(editor, key, 'type')) {
        switch (key) {
          case 'block-quote':
            return 'Blockquote';
          case 'heading-one':
            return 'Heading 1';
          case 'heading-two':
            return 'Heading 2';
          default:
            return 'Normal Text';
        }
      }
    }
    return 'Normal Text';
  };

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      {toolbar}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in SHORT_KEY) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              type ObjectKey = keyof typeof SHORT_KEY;
              const key = hotkey as ObjectKey;
              const mark = SHORT_KEY[key];
              toggleMark(mark);
            }
          }
        }}
      />
    </Slate>
  );
};

type ToolbarButtonProps = {
  type: 'block' | 'mark';
  format: string;
  icon: ReactElement;
  isActive: (
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: string,
    blockType?: string
  ) => boolean;
  onClick: () => void;
};

const ToolbarButton = (props: ToolbarButtonProps) => {
  const editor = useSlate();

  const isButtonActive = () => {
    if (props.type === 'block') {
      return props.isActive(
        editor,
        props.format,
        TEXT_ALIGNMENT_TYPES.includes(props.format) ? 'align' : 'type'
      );
    } else {
      return props.isActive(editor, props.format);
    }
  };
  return (
    <IconButton
      aria-label={props.format}
      icon={props.icon}
      isActive={isButtonActive()}
      onClick={(event) => {
        event.preventDefault();
        props.onClick();
      }}
    />
  );
};

export default TextEditor;

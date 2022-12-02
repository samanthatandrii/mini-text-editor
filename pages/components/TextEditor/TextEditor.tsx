import React, { useCallback, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, Slate, ReactEditor } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from 'slate'
import { withHistory } from 'slate-history'
import { LIST_TYPE, SHORT_KEY, TEXT_ALIGNMENT_TYPES } from '../../shared/constants'
import { ButtonGroup, Heading, ListItem, OrderedList, UnorderedList } from '@chakra-ui/react'
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaBold, FaCode, FaItalic, FaUnderline } from 'react-icons/fa'
import { TbSquare1, TbSquare2 } from 'react-icons/tb'
import { MdFormatListNumbered, MdFormatListBulleted, MdFormatQuote } from 'react-icons/md'
import { BlockButton, MarkButton } from './Buttons'

const Element = (props: any) => {
  const style = { textAlign: props.element.align }
  switch (props.element.type) {
    case 'block-quote':
      return (
        <blockquote as="mark" style={style} {...props.attributes}>
          {props.children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <UnorderedList style={style} {...props.attributes}>
          {props.children}
        </UnorderedList>
      )
    case 'heading-one':
      return (
        <Heading as="h1" size="xl" style={style} {...props.attributes}>
          {props.children}
        </Heading>
      )
    case 'heading-two':
      return (
        <Heading as="h2" size="lg" style={style} {...props.attributes}>
          {props.children}
        </Heading>
      )
    case 'list-item':
      return (
        <ListItem style={style} {...props.attributes}>
          {props.children}
        </ListItem>
      )
    case 'numbered-list':
      return (
        <OrderedList style={style} {...props.attributes}>
          {props.children}
        </OrderedList>
      )
    default:
      return (
        <p style={style} {...props.attributes}>
          {props.children}
        </p>
      )
  }
}

const Leaf = (props: any) => {
  let childComponent = props.children
  if (props.leaf.bold) {
    childComponent = <strong>{childComponent}</strong>
  }

  if (props.leaf.code) {
    childComponent = <code>{childComponent}</code>
  }

  if (props.leaf.italic) {
    childComponent = <em>{childComponent}</em>
  }

  if (props.leaf.underline) {
    childComponent = <u>{childComponent}</u>
  }

  return <span {...props.attributes}>{childComponent}</span>
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    align: 'right',
    children: [{ text: 'Since it\'s rich text, you can do things like turn a selection of text bold, or add a semantically rendered block quote in the middle of the page', bold: false, code: true }],
  },
]

const TextEditor = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const isBlockActive = (editor: BaseEditor & ReactEditor, format: string, blockType = 'type') => {
    const { selection } = editor //liat selection ada di posisi mana
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, { // cari ada di node mana
        match: n => {
          type ObjectKey = keyof typeof n;
          const key = blockType as ObjectKey
          return (
            SlateElement.isElement(n) &&
            n[key] === format)
        }
      })
    )

    return !!match
  }

  const isMarkActive = (editor: BaseEditor & ReactEditor, format: string) => {
    const marks = Editor.marks(editor) //buat dapet marks current selection, e.g bold = true atau italic = true
    type ObjectKey = keyof typeof marks;
    const key = format as ObjectKey
    return marks ? marks[key] === true : false
  }

  const toggleBlock = (format: any) => {
    const isActive = isBlockActive(
      editor,
      format,
      TEXT_ALIGNMENT_TYPES.includes(format) ? 'align' : 'type' // ganti alignment atau ganti type
    )
    const isList = LIST_TYPE.includes(format)

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPE.includes(n.type) &&
        !TEXT_ALIGNMENT_TYPES.includes(format),
      split: true,
    })

    let newProperties: Partial<SlateElement>;

    if (TEXT_ALIGNMENT_TYPES.includes(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      }
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  }

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  return (
    <Slate editor={editor} value={initialValue}>
      <ButtonGroup size="md" isAttached variant="outline" display="flex" justifyContent="center" mb={4}>
        <MarkButton format="bold" icon={<FaBold />} onClick={() => toggleMark("bold")} isActive={isMarkActive} />
        <MarkButton format="italic" icon={<FaItalic />} onClick={() => toggleMark("italic")} isActive={isMarkActive} />
        <MarkButton format="underline" icon={<FaUnderline />} onClick={() => toggleMark("underline")} isActive={isMarkActive} />
        <MarkButton format="code" icon={<FaCode />} onClick={() => toggleMark("code")} isActive={isMarkActive} />
        <BlockButton format="heading-one" icon={<TbSquare1 />} onClick={() => toggleBlock("heading-one")} isActive={isBlockActive} />
        <BlockButton format="heading-two" icon={<TbSquare2 />} onClick={() => toggleBlock("heading-two")} isActive={isBlockActive} />
        <BlockButton format="block-quote" icon={<MdFormatQuote />} onClick={() => toggleBlock("block-quote")} isActive={isBlockActive} />
        <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} onClick={() => toggleBlock("numbered-list")} isActive={isBlockActive} />
        <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} onClick={() => toggleBlock("bulleted-list")} isActive={isBlockActive} />
        <BlockButton format="left" icon={<FaAlignLeft />} onClick={() => toggleBlock("left")} isActive={isBlockActive} />
        <BlockButton format="center" icon={<FaAlignCenter />} onClick={() => toggleBlock("center")} isActive={isBlockActive} />
        <BlockButton format="right" icon={<FaAlignRight />} onClick={() => toggleBlock("right")} isActive={isBlockActive} />
        <BlockButton format="justify" icon={<FaAlignJustify />} onClick={() => toggleBlock("justify")} isActive={isBlockActive} />
      </ButtonGroup>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in SHORT_KEY) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              type ObjectKey = keyof typeof SHORT_KEY;
              const key = hotkey as ObjectKey
              const mark = SHORT_KEY[key]
              toggleMark(mark)
            }
          }
        }}
      />
    </Slate>
  )
}

export default TextEditor;
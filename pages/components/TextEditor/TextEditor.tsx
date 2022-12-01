import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
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

const TextEditor = () => {
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={initialValue}>
      {/* <Toolbar> */}
      <MarkButton format="bold" icon="format_bold" />
      <MarkButton format="italic" icon="format_italic" />
      <MarkButton format="underline" icon="format_underlined" />
      <MarkButton format="code" icon="code" />
      <BlockButton format="heading-one" icon="looks_one" />
      <BlockButton format="heading-two" icon="looks_two" />
      <BlockButton format="block-quote" icon="format_quote" />
      <BlockButton format="numbered-list" icon="format_list_numbered" />
      <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      <BlockButton format="left" icon="format_align_left" />
      <BlockButton format="center" icon="format_align_center" />
      <BlockButton format="right" icon="format_align_right" />
      <BlockButton format="justify" icon="format_align_justify" />
      {/* </Toolbar> */}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in SHORT_KEY) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = hotkey
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor: BaseEditor & ReactEditor, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGNMENT_TYPES.includes(format) ? 'align' : 'type'
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

const toggleMark = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: BaseEditor & ReactEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        type ObjectKey = keyof typeof n;
        const key = blockType as ObjectKey
        return (!Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n[key] === format)
      }
    })
  )

  return !!match
}

const isMarkActive = (editor: BaseEditor & ReactEditor, format: string) => {
  const marks = Editor.marks(editor)
  type ObjectKey = keyof typeof marks;
  const key = format as ObjectKey
  return marks ? marks[key] === true : false
}

const Element = (props: any) => {
  const style = { textAlign: props.element.align }
  switch (props.element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...props.attributes}>
          {props.children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...props.attributes}>
          {props.children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...props.attributes}>
          {props.children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...props.attributes}>
          {props.children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...props.attributes}>
          {props.children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...props.attributes}>
          {props.children}
        </ol>
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
type BlockButtonProps = {
  format: string, icon: string
}
const BlockButton = (props: BlockButtonProps) => {
  const editor = useSlate()
  return (
    <button
      disabled={isBlockActive(
        editor,
        props.format,
        TEXT_ALIGNMENT_TYPES.includes(props.format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, props.format)
      }}
    >
      {props.icon}
    </button>
  )
}
type MarkButtonProps = {
  format: string, icon: string
}
const MarkButton = (props: MarkButtonProps) => {
  const editor = useSlate()
  return (
    <button
      disabled={isMarkActive(editor, props.format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, props.format)
      }}
    >
      {props.icon}
    </button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    align: undefined,
    children: [{ text: 'Enter Text Here!', bold: true }],
  },
]

export default TextEditor
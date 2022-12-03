import { IconButton } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSlate } from 'slate-react';
import { TEXT_ALIGNMENT_TYPES } from '../../shared/constants';

type ButtonProps = {
  format: string,
  icon: ReactElement,
  isActive: (
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: string,
    blockType?: string
  ) => boolean,
  onClick: () => void,
}
export const BlockButton = (props: ButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      aria-label={props.format}
      icon={props.icon}
      isActive={props.isActive(
        editor,
        props.format,
        TEXT_ALIGNMENT_TYPES.includes(props.format) ? 'align' : 'type'
      )}
      onClick={event => {
        event.preventDefault()
        props.onClick()
      }}
    />
  )
}

export const MarkButton = (props: ButtonProps) => {
  const editor = useSlate();
  return (
    <IconButton
      aria-label={props.format}
      icon={props.icon}
      isActive={props.isActive(editor, props.format)}
      onClick={event => {
        event.preventDefault();
        props.onClick();
      }}
    />
  )
}
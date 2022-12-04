import { IconButton } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, useSlate } from 'slate-react';
import { TEXT_ALIGNMENT_TYPES } from '../../../shared/constants';

type ToolbarButtonProps = {
  // editor: BaseEditor & ReactEditor & HistoryEditor
  type: "block" | "mark"
  format: string,
  icon: ReactElement,
  isActive: (
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: string,
    blockType?: string
  ) => boolean,
  onClick: () => void,
}
const ToolbarButton = (props: ToolbarButtonProps) => {
  // const editor = useSlate();

  // const isButtonActive = () => {
  //   if (props.type === "block") {
  //     return props.isActive(
  //       editor,
  //       props.format,
  //       TEXT_ALIGNMENT_TYPES.includes(props.format) ? 'align' : 'type'
  //     )
  //   } else {
  //     return props.isActive(editor, props.format)
  //   }
  // }
  return (
    <IconButton
      aria-label={props.format}
      icon={props.icon}
      // isActive={isButtonActive()}
      onClick={event => {
        event.preventDefault()
        props.onClick()
      }}
    />
  )
}

export default ToolbarButton

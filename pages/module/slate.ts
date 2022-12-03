import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomElement =
  {
    type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'list-item' | 'numbered-list' | 'bulleted-list' | 'circle-list'
    align: string | undefined
    children: CustomText[]
  }

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}
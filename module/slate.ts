import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

type TextAlign = "start" | "end" | "left" | "right" | "center" | "justify" | "match-parent";

export type CustomElement =
  {
    type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote' | 'list-item' | 'numbered-list' | 'bulleted-list' | 'circle-list'
    align: TextAlign | undefined
    children: CustomText[]
  }

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  highlight?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}
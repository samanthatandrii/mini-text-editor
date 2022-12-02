import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type CustomElement =
  {
    type: 'paragraph' | 'heading-one' | 'heading-two' | 'block-quote'
    align?: string | undefined
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
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
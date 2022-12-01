import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type ParagraphElement = {
  type: 'paragraph'
  align?: string | undefined
  children: CustomText[]
}

export type CodeElement = {
  type: 'code'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: number
  children: CustomText[]
}

export type BlockQuoteElement = {
  type: 'block-quote'
  children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement | CodeElement | BlockQuoteElement;

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
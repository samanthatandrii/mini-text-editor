import { Heading, List, ListItem } from "@chakra-ui/react"
import { ReactNode } from "react"
import { CustomElement } from "../../../module/slate"

type ElementProps = {
  element: CustomElement,
  children: ReactNode,
}

const Element = (props: ElementProps) => {
  const textAlign = props.element?.align ?? undefined;
  const style = { textAlign: textAlign }
  switch (props.element?.type) {
    case 'block-quote':
      return (
        <blockquote style={style} >
          {props.children}
        </blockquote>
      )
    case 'heading-one':
      return (
        <Heading as="h1" size="xl" style={style} >
          {props.children}
        </Heading>
      )
    case 'heading-two':
      return (
        <Heading as="h2" size="lg" style={style} >
          {props.children}
        </Heading>
      )
    case 'list-item':
      return (
        <ListItem style={style} >
          {props.children}
        </ListItem>
      )
    case 'bulleted-list':
      return (
        <List style={style} listStyleType="disc">
          {props.children}
        </List>
      )
    case 'numbered-list':
      return (
        <List style={style} listStyleType="decimal">
          {props.children}
        </List>
      )
    case 'circle-list':
      return (
        <List style={style} listStyleType="circle">
          {props.children}
        </List>
      )
    default:
      return (
        <p style={style} >
          {props.children}
        </p>
      )
  }
}

export default Element;
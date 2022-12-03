import { Heading, List, ListItem } from "@chakra-ui/react"

export const Element = (props: any) => {
  const style = { textAlign: props.element.align }
  switch (props.element.type) {
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

export const Leaf = (props: any) => {
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

  if (props.leaf.highlight) {
    childComponent = <mark>{childComponent}</mark>
  }

  return <span {...props.attributes}>{childComponent}</span>
}
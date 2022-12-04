import { ReactNode } from "react"
import { CustomText } from "../../../module/slate"

type LeafProps = {
  leaf: CustomText,
  children: ReactNode,
  attributes: Object,
}

const Leaf = (props: LeafProps) => {
  let childComponent = props.children
  if (props.leaf?.bold) {
    childComponent = <strong>{childComponent}</strong>
  }

  if (props.leaf?.code) {
    childComponent = <code>{childComponent}</code>
  }

  if (props.leaf?.italic) {
    childComponent = <em>{childComponent}</em>
  }

  if (props.leaf?.underline) {
    childComponent = <u>{childComponent}</u>
  }

  if (props.leaf?.highlight) {
    childComponent = <mark>{childComponent}</mark>
  }

  return <span {...props.attributes}>{childComponent}</span>
}

export default Leaf;
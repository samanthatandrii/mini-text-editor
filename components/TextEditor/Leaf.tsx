import { RenderLeafProps } from 'slate-react';

const Leaf = (props: RenderLeafProps) => {
  let childComponent = props.children;
  if (props.leaf?.bold === true) {
    childComponent = <strong>{childComponent}</strong>;
  }

  if (props.leaf?.code === true) {
    childComponent = <code>{childComponent}</code>;
  }

  if (props.leaf?.italic === true) {
    childComponent = <em>{childComponent}</em>;
  }

  if (props.leaf?.underline === true) {
    childComponent = <u>{childComponent}</u>;
  }

  if (props.leaf?.highlight === true) {
    childComponent = <mark>{childComponent}</mark>;
  }

  return <span {...props.attributes}>{childComponent}</span>;
};

export default Leaf;

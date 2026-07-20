import Paragraph from "./blocks/Paragraph";
import Callout from "./blocks/Callout";

export default function BlockRenderer({ block }) {

  if (block.type === "paragraph") {
    return <Paragraph text={block.text} />;
  }

  if (block.type === "callout") {
    return (
      <Callout
        variant={block.variant}
        title={block.title}
        text={block.text}
      />
    );
  }

  return null;
}
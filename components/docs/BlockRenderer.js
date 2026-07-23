import Paragraph from "./blocks/Paragraph";
import Callout from "./blocks/Callout";
import ImageBlock from "./blocks/ImageBlock";
import Steps from "./blocks/Steps";
import ComparisonTable from "./blocks/ComparisonTable";

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

  if (block.type === "image") {
    return (
      <ImageBlock
        src={block.src}
        alt={block.alt}
        caption={block.caption}
      />
    );
  }

  if (block.type === "steps") {
    return (
      <Steps
        items={block.items}
      />
    );
  }

  if (block.type === "comparison") {
    return (
      <ComparisonTable
        headers={block.headers}
        rows={block.rows}
      />
    );
  }

  return null;
}
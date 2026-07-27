import Paragraph from "./blocks/Paragraph";
import Callout from "./blocks/Callout";
import ImageBlock from "./blocks/ImageBlock";
import Steps from "./blocks/Steps";
import ComparisonTable from "./blocks/ComparisonTable";
import Definition from "./Definition";
import SeeAlso from "./SeeAlso";
import Diagram from "./blocks/Diagram";
import TutorialInfo from "./blocks/TutorialInfo";

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

  if (block.type === "definition") {
    return (
      <Definition
        term={block.term}
        definition={block.definition}
      />
    );
  }

  if (block.type === "see-also") {
    return (
      <SeeAlso
        title={block.title}
        links={block.links}
      />
    );
  }

  if (block.type === "diagram") {
    return (
      <Diagram
        src={block.src}
        alt={block.alt}
        caption={block.caption}
      />
    );
  }

  if (block.type === "tutorial-info") {
    return (
      <TutorialInfo
        time={block.time}
        difficulty={block.difficulty}
        cost={block.cost}
        requirements={block.requirements}
      />
    );
  }

  return null;
}
import BlockRenderer from "./BlockRenderer";

export default function DocSection({ section }) {
    return (
      <div
        id={section.id}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "20px",
          borderRadius: 8,
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--text)",
          }}
        >
          {section.title}
        </h2>
  
        {section.blocks
  ? section.blocks.map((block, index) => (
      <BlockRenderer
        key={index}
        block={block}
      />
    ))

  : section.paragraphs.map((paragraph, index) => (
      <BlockRenderer
        key={index}
        block={{
          type: "paragraph",
          text: paragraph,
        }}
      />
    ))
}
      </div>
    );
  }
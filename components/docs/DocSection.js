import Callout from "./Callout";

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
  ? section.blocks.map((block, index) => {

      if (block.type === "paragraph") {
        return (
          <p
            key={index}
            style={{
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.75,
            }}
          >
            {block.text}
          </p>
        );
      }

      if (block.type === "callout") {
        return (
          <Callout
            key={index}
            variant={block.variant}
            title={block.title}
            text={block.text}
          />
        );
      }

      return null;

    })

  : section.paragraphs.map((paragraph, index) => (
      <p
        key={index}
        style={{
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.75,
        }}
      >
        {paragraph}
      </p>
    ))
}
      </div>
    );
  }
export default function Paragraph({ text }) {
    return (
      <p
        style={{
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.75,
        }}
      >
        {text}
      </p>
    );
  }
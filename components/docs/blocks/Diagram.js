export default function Diagram({
    src,
    alt,
    caption,
  }) {
    return (
      <figure
        style={{
          margin: "32px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
            background: "#0B0B0F",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>
  
        <figcaption
          style={{
            marginTop: 14,
            color: "var(--muted)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {caption}
        </figcaption>
      </figure>
    );
  }
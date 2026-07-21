export default function ImageBlock({
    src,
    alt,
    caption,
  }) {
    return (
      <figure
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid var(--border)",
          }}
        />
  
        {caption && (
          <figcaption
            style={{
              fontSize: 12,
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
export default function Steps({ title, items }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        margin: "12px 0",
      }}
    >
      {title && (
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {title}
        </h3>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--card)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              {item.emoji}
            </div>

            {index < items.length - 1 && (
              <div
                style={{
                  width: 2,
                  flex: 1,
                  minHeight: 28,
                  background: "var(--border)",
                  opacity: 0.6,
                  marginTop: 8,
                }}
              />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <strong
                style={{
                  color: "var(--text)",
                  fontSize: 14,
                }}
              >
                {item.title}
              </strong>

              {item.badge && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                    padding: "2px 8px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <p
              style={{
                margin: 0,
                color: "var(--muted)",
                lineHeight: 1.7,
                fontSize: 13,
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
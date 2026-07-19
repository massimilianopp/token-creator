export default function FAQ({ items }) {
    if (!items || items.length === 0) {
      return null;
    }
  
    return (
      <div
        style={{
          marginTop: 56,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 24,
            color: "var(--text)",
          }}
        >
          Frequently Asked Questions
        </h2>
  
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 20,
                background: "var(--card)",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  color: "var(--text)",
                }}
              >
                {item.question}
              </h3>
  
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--muted)",
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
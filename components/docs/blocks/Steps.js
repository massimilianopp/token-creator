export default function Steps({ items }) {
    return (
      <ol
        style={{
          margin: 0,
          paddingLeft: 22,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              color: "var(--text)",
              lineHeight: 1.7,
            }}
          >
            {item}
          </li>
        ))}
      </ol>
    );
  }
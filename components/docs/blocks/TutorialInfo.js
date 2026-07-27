export default function TutorialInfo({
    time,
    difficulty,
    cost,
    requirements = [],
  }) {
    return (
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          background: "var(--card)",
          padding: 24,
          margin: "32px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Time
            </div>
  
            <div
              style={{
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              ⏱ {time}
            </div>
          </div>
  
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Difficulty
            </div>
  
            <div
              style={{
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              📈 {difficulty}
            </div>
          </div>
  
          <div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              Cost
            </div>
  
            <div
              style={{
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              💰 {cost}
            </div>
          </div>
        </div>
  
        <div
          style={{
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          You'll need
        </div>
  
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {requirements.map((item) => (
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
import Link from "next/link";

export default function LearningPath() {
  const steps = [
    {
      title: "What is an SPL Token?",
      href: "/docs/what-is-spl-token",
      status: "available",
    },
    {
      title: "What is Mint Authority?",
      href: "/docs/what-is-mint-authority",
      status: "available",
    },
    {
      title: "What is Freeze Authority?",
      href: "/docs/what-is-freeze-authority",
      status: "available",
    },
    {
      title: "What is a Token Account?",
      href: "/docs/what-is-token-account",
      status: "available",
    },
    {
      title: "What is Metadata?",
      href: "/docs/what-is-token-metadata",
      status: "available",
    },
    {
      title: "Create your first token",
      href: "/docs/how-to-create-a-solana-token",
      status: "available",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 700,
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.title}
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background:
                  step.status === "available"
                    ? "var(--primary)"
                    : "var(--border)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              {index + 1}
            </div>

            {index !== steps.length - 1 && (
              <div
                style={{
                  width: 2,
                  height: 40,
                  background: "var(--border)",
                }}
              />
            )}
          </div>

          <div
            style={{
              flex: 1,
              paddingBottom: 18,
            }}
          >
            {step.status === "available" ? (
              <Link
                href={step.href}
                style={{
                  color: "var(--text)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                {step.title}
              </Link>
            ) : (
              <>
                <div
                  style={{
                    color: "var(--text)",
                    fontWeight: 600,
                    opacity: 0.6,
                  }}
                >
                  {step.title}
                </div>

                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Coming soon
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
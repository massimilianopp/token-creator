import TokenPublicPage from "@/components/TokenPublicPage";

export async function generateMetadata({ params }) {
  const { mint } = params;
  
  try {
    // Fetch token info via Helius
    const res = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAsset",
          params: { id: mint }
        })
      }
    );
    const data = await res.json();
    const token = data.result;
    const name = token?.content?.metadata?.name || "Unknown Token";
    const symbol = token?.content?.metadata?.symbol || "";
    const image = token?.content?.links?.image || "";
    const description = token?.content?.metadata?.description || 
      `${name} (${symbol}) — launched on Token Creator`;

    return {
      title: `${name} (${symbol}) — Token Creator`,
      description,
      openGraph: {
        title: `${name} (${symbol})`,
        description,
        images: [{ url: image, width: 400, height: 400 }],
        type: "website",
      },
      twitter: {
        card: "summary",
        title: `${name} (${symbol})`,
        description,
        images: [image],
      },
    };
  } catch (error) {
    // Fallback metadata if fetch fails
    return {
      title: "Token — Token Creator",
      description: "Launched on Token Creator",
      openGraph: {
        title: "Token — Token Creator",
        description: "Launched on Token Creator",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Token — Token Creator",
        description: "Launched on Token Creator",
      },
    };
  }
}

export default async function TokenPage({ params }) {
  const { mint } = params;
  return <TokenPublicPage mint={mint} />;
}

"use client";

import { use } from "react";
import TokenPublicPage from "@/components/TokenPublicPage";

export default function TokenPage({ params }) {
  const { mint } = use(params);
  return <TokenPublicPage mint={mint} />;
}

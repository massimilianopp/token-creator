import splToken from "./what-is-spl-token";
import mintAuthority from "./what-is-mint-authority";
import freezeAuthority from "./what-is-freeze-authority";
import tokenAccount from "./what-is-token-account";
import associatedTokenAccount from "./what-is-associated-token-account";
import tokenMetadata from "./what-is-token-metadata";
import solanaToken from "./how-to-create-a-solana-token";
import memecoin from "./how-to-launch-a-memecoin-on-solana";
import liquidityPool from "./how-to-create-a-liquidity-pool";
import vesting from "./how-to-create-a-vesting-contract";
import revoke from "./how-to-revoke-token-authorities";

export const articles = [
  splToken,
  mintAuthority,
  freezeAuthority,
  tokenAccount,
  associatedTokenAccount,
  tokenMetadata,
  solanaToken,
  memecoin,
  liquidityPool,
  vesting,
  revoke,
];

const docs = Object.fromEntries(
  articles.map((article) => [article.slug, article])
);

export default docs;


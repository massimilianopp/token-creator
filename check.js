const { Connection, PublicKey } = require('@solana/web3.js');
const { Metadata } = require('@metaplex-foundation/mpl-token-metadata');

async function check() {
  const conn = new Connection('https://api.mainnet-beta.solana.com');
  const mint = new PublicKey('5XGiPtqhq3EDA45Bv346NFGTPNzkeTxhjPXqr5vzdiNx');
  const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
  );
  const account = await conn.getAccountInfo(pda);
  if (!account) { console.log('Pas de metadonnees trouvees'); return; }
  const [metadata] = Metadata.deserialize(account.data);
  console.log('name:', metadata.data.name.replace(/\0/g, ''));
  console.log('symbol:', metadata.data.symbol.replace(/\0/g, ''));
  console.log('uri:', metadata.data.uri.replace(/\0/g, ''));
  console.log('updateAuthority:', metadata.updateAuthority.toBase58());
}
check();

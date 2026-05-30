import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>SellerDAO</title>
        <meta name="description" content="DAO for marketplace sellers to collectively negotiate shipping, media, and influencers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>SellerDAO</h1>
        <p>A decentralized autonomous organization for marketplace sellers to collectively negotiate shipping, media, and influencer deals.</p>
      </main>
    </div>
  );
};

export default Home;
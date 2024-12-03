import React, { useState, useEffect } from "react";
import axios from "axios";

const AllNFTsGallery = ({ ownerAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllNFTs = async () => {
      if (!ownerAddress) return;
      setLoading(true);
      setError(null);
      try {
        const API_URL = "https://api.opensea.io/api/v1/assets";
        let offset = 0;
        const limit = 50; // Max limit per request is 50
        const fetchedNFTs = [];

        while (true) {
          const { data } = await axios.get(API_URL, {
            params: {
              owner: ownerAddress,
              order_direction: "desc",
              offset: offset,
              limit: limit,
            },
            headers: {
              Accept: "application/json",
              "X-API-KEY": process.env.REACT_APP_OPENSEA_API_KEY,
            },
          });

          fetchedNFTs.push(...data.assets);

          if (data.assets.length < limit) {
            // No more assets to fetch
            break;
          } else {
            offset += limit;
          }
        }

        setNfts(fetchedNFTs);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch NFT data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [ownerAddress]);

  if (loading) return <p>Loading NFTs...</p>;
  if (error) return <p>{error}</p>;
  if (nfts.length === 0) return <p>No NFTs found for this address.</p>;

  return (
    <div className="nft-gallery">
      {nfts.map((nft, index) => (
        <div
          key={`${nft.asset_contract.address}-${nft.token_id}-${index}`}
          className="nft-card"
        >
          <img
            src={nft.image_url || "https://via.placeholder.com/150"}
            alt={nft.name || "NFT Image"}
          />
          <h3>{nft.name || "Unnamed NFT"}</h3>
        </div>
      ))}
    </div>
  );
};

export default AllNFTsGallery;



export interface Asset {
    id: number;
    token_id: string;
    num_sales: number;
    background_color: string | null;
    image_url: string;
    image_preview_url: string;
    image_thumbnail_url: string;
    image_original_url: string;
    animation_url: string | null;
    animation_original_url: string | null;
    name: string;
    description: string;
    external_link: string | null;
    asset_contract: {
      address: string;
      asset_contract_type: string;
      created_date: string;
      name: string;
      nft_version: string | null;
      opensea_version: string | null;
      owner: number;
      schema_name: string;
      symbol: string;
      total_supply: string;
      description: string;
      external_link: string;
      image_url: string;
      default_to_fiat: boolean;
      dev_buyer_fee_basis_points: number;
      dev_seller_fee_basis_points: number;
      only_proxied_transfers: boolean;
      opensea_buyer_fee_basis_points: number;
      opensea_seller_fee_basis_points: number;
      buyer_fee_basis_points: number;
      seller_fee_basis_points: number;
      payout_address: string | null;
    }
    permalink: string;
    collection: {
      banner_image_url: string;
      chat_url: string | null;
      created_date: string;
      default_to_fiat: boolean;
      description: string;
      dev_buyer_fee_basis_points: string;
      dev_seller_fee_basis_points: string;
      discord_url: string | null;
      display_data: {
        card_display_style: string;
        images: string | null;
      }
      external_url: string;
      featured: boolean;
      featured_image_url: string;
      hidden: boolean;
      safelist_request_status: string;
      image_url: string;
      is_subject_to_whitelist: boolean;
      large_image_url: string;
      medium_username: string | null;
      name: string;
      opensea_buyer_fee_basis_points: string;
      opensea_seller_fee_basis_points: string;
      owner: number;
      buyer_fee_basis_points: string;
      seller_fee_basis_points: string;
      symbol: string;
      telegram_url: string | null;
      thumbnail_url: string;
      total_supply: string;
      twitter_username: string | null;
      website_url: string | null;
    }
    traits: [
        {
          trait_type: string;
          value: string;
          display_type?: null;
          max_value?: null;
          trait_count: number;
          order?: null;
        }
    ]
    last_sale: {
        asset: {
            token_id: string;
            decimals?: null;
        }
        asset_bundle?: null;
        event_type: string;
        event_timestamp: string;
        auction_type?: null;
        total_price: string;
        payment_token: {
            symbol: string;
            address: string;
            image_url: string;
            name: string;
            decimals: number;
            eth_price: string;
            usd_price: string;
        }
        transaction: {
            block_hash: string;
            block_number: string;
            from_account: any;
            id: number;
            timestamp: string;
            to_account: any;
            transaction_hash: string;
            transaction_index: string;
        }
        created_date: string;
        quantity: string;
    }
    top_bid?: null;
    listing_date?: null;
    supports_wyvern: boolean;
    rarity_data?: null;
    transfer_fee?: null;
    transfer_fee_payment_token?: null;
  }

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface NftCollectionData {
    image_url: string;
    name: string;
    address: string;
}

export interface UserAccount {
  username: string;
  account: {
    user: { username: string },
    profile_img_url: string,
    address: string,
    config: string,
    currencies: {}
  }
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export interface IAlchemyTransaction {
  removed: boolean;
  transaction: {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    type: string;
    accessList: any[];
    chainId: string;
    v: string;
    r: string;
    s: string;
  };
}
import type { NFTItem, UserProfile } from "@/types";
import { nftsData } from "./fixtures/nfts";
const STORE_KEY = "nft-marketplace-db";

interface CartItem {
  id: string;
  name: string;
  price: string;
  currency: string;
  image: string;
  quantity: number;
}

interface MockDatabase {
  nfts: NFTItem[];
  cart: CartItem[];
  users: Array<UserProfile & { password: string }>;
  currentUser: UserProfile | null;
  token: string | null;
  favorites: string[];
  orders: any[];
}

const defaultDB: MockDatabase = {
  nfts: nftsData, // Depois vamos preencher com fixtures
  cart: [],
  users: [
    {
      id: "user-1",
      name: "Satoshi Nakamoto",
      username: "satoshi",
      email: "admin@kurio.com",
      password: "123456",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ],
  currentUser: null,
  token: null,
  favorites: [],
  orders: [],
};

export const db = {
  read(): MockDatabase {
    const data = localStorage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : defaultDB;
  },
  write(data: Partial<MockDatabase>) {
    const current = this.read();
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...current, ...data }));
  },
  reset() {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultDB));
  },
};

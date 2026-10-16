export interface NFTItem {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  currency: string;
  image: string;
  collection: string; // "Arte digital", "Fotografia", etc.
  network: string; // "Ethereum", "Polygon", "Solana"
  isNewRelease: boolean;
  isTrending: boolean;
  listedAt: string; // ISO date
  attributes?: string[];
}

export interface CartItem extends NFTItem {
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  password?: string;
}

export interface WalletItem {
  id: string;
  name: string;
  address: string;
  network: string;
  isPrimary: boolean;
}

// Tipos de Payload para as requisições do MSW
export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface RegisterRequestBody {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface UpdateProfileRequestBody {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequestBody {
  currentPassword?: string;
  newPassword?: string;
}

export interface HomeSearch {
  tab?: "all" | "new" | "trending";
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  network?: string;
  sort?: "recent" | "price_asc" | "price_desc";
  page?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  currency: string;
  image: string;
  quantity: number;
}

export interface OrderSnapshot {
  id: string; // Hash simulado da transação (ex: 0xA91F..E82C)
  idempotencyKey: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  networkFee: number;
  total: number;
  wallet: string;
  createdAt: string; // ISO String
}

export interface Quote {
  subtotal: number;
  discount: number;
  networkFee: number;
  total: number;
  validCoupon: string | null;
}

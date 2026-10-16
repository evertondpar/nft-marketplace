import { http, HttpResponse, delay } from "msw";
import { db } from "./store";
import type {
  NFTItem,
  CartItem,
  LoginRequestBody,
  RegisterRequestBody,
  UpdateProfileRequestBody,
  ChangePasswordRequestBody,
  WalletItem,
  OrderSnapshot,
} from "@/types";

export const handlers = [
  // ---------------------------------------------------------------------------
  // 1. CATALOGO & NFTS
  // ---------------------------------------------------------------------------

  // Listar todos os NFTs
  http.get("/api/nfts", async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const tab = url.searchParams.get("tab");
    const collection = url.searchParams.get("collection");
    const network = url.searchParams.get("network");
    const minPrice = parseFloat(url.searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "9999");
    const sort = url.searchParams.get("sort") || "recent";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 6;

    const data = db.read();
    let filtered = [...(data.nfts as NFTItem[])];

    // Filtro de Abas
    if (tab === "new") filtered = filtered.filter((n) => n.isNewRelease);
    if (tab === "trending") filtered = filtered.filter((n) => n.isTrending);

    // Filtros Laterais
    if (collection)
      filtered = filtered.filter((n) => n.collection === collection);
    if (network) filtered = filtered.filter((n) => n.network === network);
    filtered = filtered.filter(
      (n) => parseFloat(n.price) >= minPrice && parseFloat(n.price) <= maxPrice,
    );

    // Ordenação
    filtered.sort((a, b) => {
      if (sort === "price_asc")
        return parseFloat(a.price) - parseFloat(b.price);
      if (sort === "price_desc")
        return parseFloat(b.price) - parseFloat(a.price);
      // default: recent
      return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
    });

    // Paginação
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    return HttpResponse.json({
      items: paginatedItems,
      total,
      page,
      totalPages,
    });
  }),

  // Buscar NFT por ID
  http.get("/api/nfts/:id", async ({ params }) => {
    await delay(200);
    const { id } = params;
    const data = db.read();
    const nft = (data.nfts as NFTItem[]).find((n) => n.id === id);

    if (!nft) {
      return new HttpResponse("NFT não encontrado", { status: 404 });
    }

    return HttpResponse.json(nft);
  }),

  // ---------------------------------------------------------------------------
  // 2. AUTENTICAÇÃO E SESSÃO
  // ---------------------------------------------------------------------------

  // Login
  http.post("/api/auth/login", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as LoginRequestBody;
    const data = db.read();

    const user = data.users.find(
      (u) => u.email === body.email && u.password === body.password,
    );

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: "Credenciais inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `fake-jwt-token-${user.id}`;

    db.write({ currentUser: userWithoutPassword, token });

    return HttpResponse.json({
      user: userWithoutPassword,
      token,
      cart: data.cart,
    });
  }),

  // Cadastro (Register)
  http.post("/api/auth/register", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as RegisterRequestBody;
    const data = db.read();

    const existingUser = data.users.find(
      (u) => u.email === body.email || u.username === body.username,
    );

    if (existingUser) {
      return new HttpResponse(
        JSON.stringify({ message: "E-mail ou nome de usuário já em uso" }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: body.name || body.username || "Novo Usuário",
      username: body.username || "",
      email: body.email || "",
      password: body.password || "",
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };

    const updatedUsers = [...data.users, newUser];
    const { password: _, ...userWithoutPassword } = newUser;
    const token = `fake-jwt-token-${newUser.id}`;

    db.write({
      users: updatedUsers,
      currentUser: userWithoutPassword,
      token,
    });

    return HttpResponse.json({
      user: userWithoutPassword,
      token,
    });
  }),

  // Sessão atual (Me)
  http.get("/api/auth/me", async ({ request }) => {
    await delay(100);
    const authHeader = request.headers.get("Authorization");
    const data = db.read();

    if (!authHeader || !data.token || !data.currentUser) {
      return new HttpResponse(JSON.stringify({ message: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return HttpResponse.json({ user: data.currentUser });
  }),

  // Logout
  http.post("/api/auth/logout", async () => {
    await delay(100);
    db.write({ currentUser: null, token: null });
    return HttpResponse.json({ success: true });
  }),

  // ---------------------------------------------------------------------------
  // 3. CARRINHO
  // ---------------------------------------------------------------------------

  // Listar carrinho
  http.get("/api/cart", async () => {
    await delay(200);
    const data = db.read();
    return HttpResponse.json({ items: data.cart as CartItem[] });
  }),

  // Adicionar / Alterar item no carrinho
  http.post("/api/cart", async ({ request }) => {
    await delay(200);
    const item = (await request.json()) as CartItem;
    const data = db.read();
    const currentCart = [...(data.cart as CartItem[])];

    const existingIndex = currentCart.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += item.quantity || 1;
    } else {
      currentCart.push({ ...item, quantity: item.quantity || 1 });
    }

    db.write({ cart: currentCart });
    return HttpResponse.json({ success: true, cart: currentCart });
  }),

  // ---------------------------------------------------------------------------
  // 4. PERFIL E CARTEIRAS
  // ---------------------------------------------------------------------------

  // Atualizar Perfil
  http.put("/api/profile", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as UpdateProfileRequestBody;
    const data = db.read();

    if (!data.currentUser) {
      return new HttpResponse("Não autorizado", { status: 401 });
    }

    const updatedUser = { ...data.currentUser, ...body };
    db.write({ currentUser: updatedUser });

    return HttpResponse.json({ user: updatedUser });
  }),

  // Alterar Senha
  http.put("/api/profile/password", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as ChangePasswordRequestBody;
    const data = db.read();

    const user = data.users.find((u) => u.id === data.currentUser?.id);
    if (!user || user.password !== body.currentPassword) {
      return new HttpResponse(
        JSON.stringify({ message: "Senha atual incorreta" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    user.password = body.newPassword || "";
    db.write({ users: data.users });

    return HttpResponse.json({ success: true });
  }),

  // Carteiras
  http.get("/api/wallets", async () => {
    await delay(200);
    const data = db.read();
    const wallets =
      ((data as unknown as Record<string, unknown>).wallets as WalletItem[]) ||
      [];
    return HttpResponse.json({ wallets });
  }),

  http.post("/api/wallets", async ({ request }) => {
    await delay(300);
    const wallet = (await request.json()) as WalletItem;
    const data = db.read();
    const currentWallets =
      ((data as unknown as Record<string, unknown>).wallets as WalletItem[]) ||
      [];

    const existingIndex = currentWallets.findIndex((w) => w.id === wallet.id);
    if (existingIndex > -1) {
      currentWallets[existingIndex] = wallet;
    } else {
      currentWallets.push(wallet);
    }

    db.write({ wallets: currentWallets } as Partial<typeof data>);
    return HttpResponse.json({ wallets: currentWallets });
  }),

  http.put("/api/wallets/:id/primary", async ({ params }) => {
    await delay(200);
    const { id } = params;
    const data = db.read();
    const currentWallets =
      ((data as unknown as Record<string, unknown>).wallets as WalletItem[]) ||
      [];

    const updatedWallets = currentWallets.map((w) => ({
      ...w,
      isPrimary: w.id === id,
    }));

    db.write({ wallets: updatedWallets } as Partial<typeof data>);
    return HttpResponse.json({ wallets: updatedWallets });
  }),

  // Buscar Favoritos
  http.get("/api/favorites", async () => {
    await delay(200);
    const data = db.read();

    // Se não estiver logado, retorna array vazio silenciosamente
    if (!data.currentUser) {
      return HttpResponse.json({ favorites: [] });
    }

    return HttpResponse.json({ favorites: data.favorites || [] });
  }),

  // Alternar Favorito (Adicionar/Remover)
  http.post("/api/favorites", async ({ request }) => {
    await delay(200);
    const data = db.read();

    // Bloqueia se não estiver autenticado
    if (!data.currentUser) {
      return new HttpResponse(
        JSON.stringify({ message: "Faça login para favoritar" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const { nftId } = (await request.json()) as { nftId: string };
    let currentFavs = [...(data.favorites || [])];

    if (currentFavs.includes(nftId)) {
      // Remove se já existe
      currentFavs = currentFavs.filter((id) => id !== nftId);
    } else {
      // Adiciona se não existe
      currentFavs.push(nftId);
    }

    db.write({ favorites: currentFavs });
    return HttpResponse.json({ favorites: currentFavs });
  }),

  http.post("/api/quote", async ({ request }) => {
    await delay(300);
    const { coupon, items } = (await request.json()) as any;

    const subtotal = items.reduce(
      (acc: number, item: any) => acc + parseFloat(item.price) * item.quantity,
      0,
    );
    let discount = 0;

    // Simulação de validação de cupom ("KURIO20" dá 20% de desconto)
    if (coupon) {
      if (coupon.toUpperCase() === "KURIO20") {
        discount = subtotal * 0.2;
      } else {
        return new HttpResponse(
          JSON.stringify({ message: "Cupom inválido ou expirado" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const networkFee = 0.016; // Taxa de rede fixa para a simulação
    const total = subtotal - discount + networkFee;

    return HttpResponse.json({
      subtotal,
      discount,
      networkFee,
      total,
      validCoupon: coupon ? coupon.toUpperCase() : null,
    });
  }),

  // Criação do Pedido com Chave de Idempotência e Snapshot
  http.post("/api/orders", async ({ request }) => {
    await delay(800); // Simulando o tempo de processamento de pagamento
    const idempotencyKey = request.headers.get("Idempotency-Key");
    const body = (await request.json()) as any;
    const data = db.read();
    const currentOrders = (data as any).orders || [];

    // 1. VERIFICAÇÃO DE IDEMPOTÊNCIA
    // Se a chave já existir, devolve o pedido exato que já foi criado, prevenindo duplicidade
    const existingOrder = currentOrders.find(
      (o: OrderSnapshot) => o.idempotencyKey === idempotencyKey,
    );
    if (existingOrder) {
      return HttpResponse.json({ order: existingOrder });
    }

    // 2. CRIAÇÃO DO SNAPSHOT IMUTÁVEL
    // Copiamos os valores exatos deste milissegundo para o recibo
    const newOrder = {
      id: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`, // Simulando hash de transação
      idempotencyKey,
      items: body.items,
      subtotal: body.quote.subtotal,
      discount: body.quote.discount,
      networkFee: body.quote.networkFee,
      total: body.quote.total,
      wallet: body.wallet,
      createdAt: new Date().toISOString(),
    };

    // 3. PERSISTE E LIMPA O CARRINHO
    db.write({
      orders: [...currentOrders, newOrder],
      cart: [], // Limpa o carrinho após a compra com sucesso
    } as any);

    return HttpResponse.json({ order: newOrder });
  }),
];

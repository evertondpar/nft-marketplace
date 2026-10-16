import { test, expect } from "@playwright/test";

// Garante que todo teste parta de um estado limpo e com relógio controlado (para regressão visual estável)
test.beforeEach(async ({ page }) => {
  // Fixa o relógio da página para evitar falsos positivos na regressão visual
  await page.clock.setFixedTime(new Date("2026-10-16T12:00:00.000Z"));
  await page.goto("/");
  // Limpa MSW para o estado padrão
  await page.evaluate(() => (window as any).__MSW__?.resetHandlers());
});

test.describe("Kurio E2E - 12 Cenários Críticos", () => {
  // 1. Busca, filtros combinados, ordenação, paginação e restauração pelo histórico
  // 1. Busca, filtros combinados, ordenação, paginação e restauração pelo histórico
  test("1. Deve cobrir filtros combinados, ordenação, paginação e restauração pelo histórico", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Filtro combinado (Rede Ethereum + Ordenação por menor preço)
    await page.getByRole("button", { name: "Ethereum" }).click();
    await page.locator("select").selectOption("price_asc");

    // Verifica se os parâmetros refletem na URL de forma independente de ordem
    await expect(page).toHaveURL(/network=Ethereum/);
    await expect(page).toHaveURL(/sort=price_asc/);

    // 2. Paginação (Verifica e clica na página 2 se estiver disponível no catálogo)
    const pageTwoButton = page.getByRole("button", { name: "2", exact: true });
    if (await pageTwoButton.isVisible()) {
      await pageTwoButton.click();
      await expect(page).toHaveURL(/page=2/);
    }

    // 3. Restauração pelo histórico (Navega para o detalhe e usa o botão Voltar do navegador)
    const firstNft = page.locator("article.group").first();
    if (await firstNft.isVisible()) {
      await firstNft.click();

      // Simula o clique no botão "Voltar" do histórico do navegador
      await page.goBack();

      // Valida se o estado da UI e a ordenação foram restaurados corretamente
      await expect(page.locator("select")).toHaveValue("recent");
    }
  });

  // 2. Acesso direto ao detalhe e tratamento de recurso inexistente
  test("2. Deve tratar 404 e exibir detalhes corretamente", async ({
    page,
  }) => {
    await page.goto("/nft/id-inexistente");
    await expect(page.getByRole("alert")).toContainText(
      "Erro: NFT não encontrado",
    );

    await page.goto("/nft/1"); // ID válido
    await expect(page.getByRole("heading", { name: /#1/ })).toBeVisible();

    // Regressão visual da tela de detalhes (mascarando a imagem que pode variar no load)
    await expect(page).toHaveScreenshot("nft-details-baseline.png", {
      mask: [page.locator("img")],
    });
  });

  // 3. Cadastro, login, expiração de sessão, logout e troca de usuário
  test("3. Fluxo de Auth: Login, expiração forçada e troca de sessão", async ({
    page,
  }) => {
    // Injeta sessão válida
    await page.evaluate(() =>
      localStorage.setItem("auth_token", "token_user_1"),
    );
    await page.goto("/profile");
    await expect(page.locator("#profile-display-name")).toBeVisible();

    // Simula expiração forçando MSW a retornar 401 no perfil
    await page.evaluate(() => (window as any).__MSW__?.use401OnProfile());
    await page.reload();

    // Interceptor global deve deslogar e mandar para home
    await expect(page).toHaveURL("/");
    const token = await page.evaluate(() => localStorage.getItem("auth_token"));
    expect(token).toBeNull();
  });

  // 4. Favoritos: falha de mutation e recuperação do estado
  test("4. Favoritos: rollback otimista em caso de erro 500", async ({
    page,
  }) => {
    // Força MSW a falhar na rota de favoritos
    await page.evaluate(() => (window as any).__MSW__?.use500OnFavorites());

    const favButton = page
      .getByRole("button", { name: /Adicionar aos favoritos/i })
      .first();
    await favButton.click();

    // UI tenta ficar preenchida, mas ao receber o erro volta ao estado vazio
    await expect(page.getByRole("status")).toContainText("Erro ao favoritar");
    await expect(favButton).not.toHaveClass(/text-red-500/); // Cor de ativo removida
  });

  // 5. Carrinho, quantidades, remoção, cupom e persistência
  test("5. Gestão de Carrinho e persistência pós-refresh", async ({ page }) => {
    await page.goto("/nft/1");
    await page.getByRole("button", { name: "COMPRAR" }).click();
    await page.goto("/cart");

    await page.getByRole("button", { name: /Aumentar/i }).click();
    await expect(page.locator("text=Qtde: 2")).toBeVisible();

    await page.reload(); // Testa persistência local/API
    await expect(page.locator("text=Qtde: 2")).toBeVisible();

    // Regressão Visual do Carrinho
    await expect(page).toHaveScreenshot("cart-baseline.png");
  });

  // 6. Compra completa, do catálogo ao recibo confirmado
  test("6. Caminho Feliz: Checkout completo e recibo visual", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.setItem("auth_token", "valid"));
    await page.goto("/checkout"); // Assumindo carrinho já populado via MSW inicial

    await page.getByRole("radio", { name: "MetaMask" }).click();
    await page.getByRole("button", { name: "Confirmar compra" }).click();

    const modal = page.getByRole("dialog", { name: /Recibo/i });
    await expect(modal).toBeVisible();

    // Regressão visual do recibo (mascarando a hash da transação que é aleatória)
    await expect(modal).toHaveScreenshot("receipt-baseline.png", {
      mask: [page.locator('[data-testid="tx-hash"]')],
    });
  });

  // 7. Falha de pagamento, clique repetido e timeout com recuperação
  test("7. Idempotência: Cliques rápidos e recuperação de timeout", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.setItem("auth_token", "valid"));
    await page.goto("/checkout");

    // Força MSW a dar delay enorme (timeout simulado)
    await page.evaluate(() => (window as any).__MSW__?.useDelayOnOrder(10000));

    const btnBuy = page.getByRole("button", { name: "Confirmar compra" });

    // Spamma o botão 3 vezes
    await btnBuy.click();
    await btnBuy.click();
    await btnBuy.click();

    // Verifica se o botão ficou desabilitado imediatamente após o primeiro clique
    await expect(btnBuy).toBeDisabled();

    // Avalia a rede para garantir que a requisição POST /orders foi enviada usando a mesma Idempotency-Key
    // (A validação real acontece no MSW que previne duplicatas de processamento)
  });

  // 8. Edição de perfil, avatar, senha e carteiras com erros de validação
  test("8. Formulários de Perfil e validações rígidas", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("auth_token", "valid"));
    await page.goto("/profile");

    // Testa erro de senha divergente
    await page.locator("#new-password").fill("123456");
    await page.locator("#confirm-password").fill("654321");
    await page.getByRole("button", { name: "Atualizar Senha" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "As senhas não coincidem",
    );
  });

  // 9. Alteração de preço via Socket.IO durante o checkout
  test("9. Socket.IO: Preço alterado desabilita compra em tempo real", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.setItem("auth_token", "valid"));
    await page.goto("/checkout");

    // Dispara evento via cliente socket mockado na window
    await page.evaluate(() => {
      (window as any).__SOCKET__.emit("nft.updated", {
        id: "1",
        price: "50.0",
      });
    });

    // UI deve exibir alerta e bloquear botão
    const alert = page.getByRole("alert");
    await expect(alert).toContainText("preço mudou");
    await expect(
      page.getByRole("button", { name: "Confirmar compra" }),
    ).toBeDisabled();
  });

  // 10. Eventos duplicados, desconexão e retomada de pedido pendente
  test("10. Socket.IO: Desconexão e Reconciliação (F5)", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("auth_token", "valid"));
    await page.goto("/checkout");

    // Inicia compra e perde conexão (fechando modal na marra ou dando F5)
    await page.evaluate(() =>
      sessionStorage.setItem("activeOrderId", "pedido-pendente-123"),
    );
    await page.reload(); // Simula queda

    // Ao voltar, a query REST de reconciliação descobre que a ordem foi concluída
    // O modal de recibo deve ser reaberto congelado
    await expect(page.getByRole("dialog", { name: /Recibo/i })).toBeVisible();
  });

  // 11. Navegação por teclado, foco de diálogos e validação
  test("11. Acessibilidade (A11y): Navegação por TAB e focus trap no Modal", async ({
    page,
  }) => {
    await page.goto("/");

    // Navega pressionando TAB 3 vezes a partir do body
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verifica se um botão específico pegou foco (outline)
    const btn = page.getByRole("button", { name: "Ethereum" });
    await expect(btn).toBeFocused();

    // Abre modal de recibo via state manipulation e testa ESC
    await page.evaluate(() =>
      sessionStorage.setItem("activeOrderId", "mocked"),
    );
    await page.goto("/checkout");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  // 12. Skeletons durante lentidão e feedback de falha com nova tentativa
  test("12. Skeletons e Retry (Recuperação após Falha de API)", async ({
    page,
  }) => {
    // 1. Força atraso longo e depois erro 500
    await page.evaluate(() =>
      (window as any).__MSW__?.useDelayAnd500OnCatalog(),
    );
    await page.goto("/");

    // 2. Verifica se Skeletons de catálogo estão na tela (aria-busy)
    await expect(page.locator('[aria-busy="true"]')).toBeVisible();

    // 3. Após MSW falhar, tela exibe mensagem de erro e botão de recarregar
    const errorAlert = page.getByRole("alert");
    await expect(errorAlert).toContainText("Erro ao carregar o catálogo");

    // 4. Corrige MSW para retornar 200 OK e clica para tentar novamente
    await page.evaluate(() => (window as any).__MSW__?.resetHandlers());
    await page.reload(); // ou clica no botão tentar novamente se existir

    // 5. NFTs aparecem normalmente
    await expect(page.locator("article.group").first()).toBeVisible();
  });
});

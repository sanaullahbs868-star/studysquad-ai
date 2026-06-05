export interface ShopItem {
  id: string;
  name: string;
  price: number;
  xpRequired: number;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export class Shop {
  private items: Map<string, ShopItem> = new Map();

  constructor() {
    this.initializeItems();
  }

  private initializeItems(): void {
    const shopItems: ShopItem[] = [
      { id: "starter_hat", name: "Student Cap", price: 50, xpRequired: 0, description: "A basic student cap", rarity: "common" },
      { id: "starter_shoes", name: "Casual Shoes", price: 50, xpRequired: 0, description: "Comfortable walking shoes", rarity: "common" },
      { id: "cool_hat", name: "Cool Hat", price: 500, xpRequired: 100, description: "A stylish hat for cool students", rarity: "rare" },
      { id: "backpack", name: "Premium Backpack", price: 800, xpRequired: 150, description: "Increases inventory space", rarity: "rare" },
      { id: "flying_boots", name: "Flying Boots", price: 2000, xpRequired: 500, description: "Special boots for flying (30min duration)", rarity: "epic" },
      { id: "speed_potion", name: "Speed Potion", price: 300, xpRequired: 50, description: "Move 2x faster for 5 minutes", rarity: "rare" },
      { id: "strength_potion", name: "Strength Potion", price: 400, xpRequired: 100, description: "Increased strength for 10 minutes", rarity: "rare" },
      { id: "golden_armor", name: "Golden Armor", price: 5000, xpRequired: 1000, description: "Legendary armor set", rarity: "legendary" },
      { id: "diamond_sword", name: "Diamond Sword", price: 3000, xpRequired: 750, description: "Powerful weapon", rarity: "epic" },
      { id: "xp_booster", name: "XP Booster", price: 1500, xpRequired: 200, description: "2x XP for 1 hour (VERY EXPENSIVE for beginners!)", rarity: "epic" },
      { id: "invisibility_cloak", name: "Invisibility Cloak", price: 2500, xpRequired: 600, description: "Become invisible for 15 minutes", rarity: "epic" },
      { id: "scholar_robe", name: "Scholar Robe", price: 1200, xpRequired: 300, description: "Academic outfit with +10% XP bonus", rarity: "rare" },
    ];
    shopItems.forEach((item) => this.items.set(item.id, item));
  }

  getShopItems(role: string): ShopItem[] {
    const items = Array.from(this.items.values());
    if (role === "developer") {
      return items.map((item) => ({ ...item, price: Math.floor(item.price * 0.3) }));
    }
    if (role === "owner") {
      return items.map((item) => ({ ...item, price: Math.floor(item.price * 0.5) }));
    }
    if (role === "admin") {
      return items.map((item) => ({ ...item, price: Math.floor(item.price * 0.75) }));
    }
    return items;
  }

  buyItem(
    playerId: string,
    itemId: string,
    playerMoney: number,
    playerXP: number,
    playerRole: string
  ): { success: boolean; message: string; cost?: number } {
    const item = this.items.get(itemId);
    if (!item) return { success: false, message: "❌ Item not found in shop" };

    let price = item.price;
    if (playerRole === "developer") price = Math.floor(price * 0.3);
    else if (playerRole === "owner") price = Math.floor(price * 0.5);
    else if (playerRole === "admin") price = Math.floor(price * 0.75);

    if (playerMoney < price) {
      return { success: false, message: `❌ Insufficient money! Need $${price}, have $${playerMoney}` };
    }

    if (playerXP < item.xpRequired) {
      const currentLevel = Math.floor(playerXP / 1000) + 1;
      const requiredLevel = Math.floor(item.xpRequired / 1000) + 1;
      return { success: false, message: `❌ Insufficient level! Need Level ${requiredLevel}, you are Level ${currentLevel}` };
    }

    return { success: true, message: `✅ Purchased ${item.name} for $${price}!`, cost: price };
  }
}
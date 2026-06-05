export type UserRole = "beginner" | "admin" | "owner" | "developer";

export interface Player {
  id: string;
  username: string;
  role: UserRole;
  xp: number;
  money: number;
  level: number;
  inventory: string[];
  position: { x: number; y: number; z: number };
  avatar: string;
  joinedAt: Date;
  isMuted: boolean;
}

export class PlayerManager {
  private players: Map<string, Player> = new Map();

  createPlayer(id: string, username: string): Player {
    const player: Player = {
      id,
      username,
      role: "beginner",
      xp: 0,
      money: 100,
      level: 1,
      inventory: ["starter_hat", "starter_shoes"],
      position: { x: 0, y: 0, z: 0 },
      avatar: this.generateAvatar(),
      joinedAt: new Date(),
      isMuted: false,
    };

    this.players.set(id, player);
    return player;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  updatePlayerXP(id: string, xpGain: number): void {
    const player = this.players.get(id);
    if (player) {
      player.xp += xpGain;
      player.level = Math.floor(player.xp / 1000) + 1;
    }
  }

  updatePlayerMoney(id: string, amount: number): void {
    const player = this.players.get(id);
    if (player && player.money + amount >= 0) {
      player.money += amount;
    }
  }

  addToInventory(id: string, item: string): void {
    const player = this.players.get(id);
    if (player) {
      player.inventory.push(item);
    }
  }

  removeFromInventory(id: string, item: string): void {
    const player = this.players.get(id);
    if (player) {
      const index = player.inventory.indexOf(item);
      if (index > -1) {
        player.inventory.splice(index, 1);
      }
    }
  }

  setPlayerRole(id: string, role: UserRole): void {
    const player = this.players.get(id);
    if (player) {
      player.role = role;
    }
  }

  mutePlayer(id: string): void {
    const player = this.players.get(id);
    if (player) {
      player.isMuted = true;
    }
  }

  unmutePlayer(id: string): void {
    const player = this.players.get(id);
    if (player) {
      player.isMuted = false;
    }
  }

  updatePlayerPosition(id: string, position: { x: number; y: number; z: number }): void {
    const player = this.players.get(id);
    if (player) {
      player.position = position;
    }
  }

  removePlayer(id: string): void {
    this.players.delete(id);
  }

  private generateAvatar(): string {
    const avatars = ["🧑‍🎓", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🎨", "👩‍🎨"];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
}
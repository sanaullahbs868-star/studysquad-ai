import { PlayerManager, Player } from "./player";
import { ChatManager, ChatMessage } from "./chat";
import { CommandManager } from "./commands";
import { Shop } from "./inventory";
import { UniversityCampus } from "./university";

export class GameServer {
  private playerManager: PlayerManager;
  private chatManager: ChatManager;
  private commandManager: CommandManager;
  private shop: Shop;
  private campus: UniversityCampus;
  private isRunning: boolean = false;

  constructor() {
    this.playerManager = new PlayerManager();
    this.chatManager = new ChatManager();
    this.commandManager = new CommandManager(this.playerManager);
    this.shop = new Shop();
    this.campus = new UniversityCampus();
  }

  start(): void {
    this.isRunning = true;
    console.log("🚀 StudySquad Game Server Started!");
  }

  stop(): void {
    this.isRunning = false;
    console.log("🛑 StudySquad Game Server Stopped!");
  }

  playerJoin(userId: string, username: string): Player {
    return this.playerManager.createPlayer(userId, username);
  }

  playerLeave(playerId: string): void {
    this.playerManager.removePlayer(playerId);
  }

  playerChat(playerId: string, message: string): ChatMessage | null {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) return null;
    if (player.isMuted) return null;
    if (message.startsWith("/")) {
      this.commandManager.executeCommand(player, message);
      return null;
    }
    return this.chatManager.sendMessage(player, message);
  }

  buyItem(playerId: string, itemId: string): string {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) return "❌ Player not found";
    const result = this.shop.buyItem(playerId, itemId, player.money, player.xp, player.role);
    if (result.success && result.cost) {
      this.playerManager.updatePlayerMoney(playerId, -result.cost);
      this.playerManager.addToInventory(playerId, itemId);
    }
    return result.message;
  }

  getShop(playerId: string): any[] {
    const player = this.playerManager.getPlayer(playerId);
    return player ? this.shop.getShopItems(player.role) : [];
  }

  grantXP(playerId: string, xpAmount: number): void {
    this.playerManager.updatePlayerXP(playerId, xpAmount);
  }

  grantMoney(playerId: string, amount: number): void {
    this.playerManager.updatePlayerMoney(playerId, amount);
  }

  getCampusInfo(): string {
    return this.campus.getAllLocationsDescription();
  }

  getPlayerStats(playerId: string): Player | null {
    return this.playerManager.getPlayer(playerId) || null;
  }

  getAllPlayers(): Player[] {
    return this.playerManager.getAllPlayers();
  }

  getChatHistory(limit: number = 50): ChatMessage[] {
    return this.chatManager.getRecentMessages(limit);
  }

  getFlaggedMessages(): ChatMessage[] {
    return this.chatManager.getFlaggedMessages();
  }

  getServerStats(): any {
    const players = this.playerManager.getAllPlayers();
    return {
      playersOnline: players.length,
      admins: players.filter((p) => p.role === "admin").length,
      totalXPEarned: players.reduce((sum, p) => sum + p.xp, 0),
      totalMoneyInCirculation: players.reduce((sum, p) => sum + p.money, 0),
      chatMessagesCount: this.getChatHistory().length,
      flaggedMessagesCount: this.getFlaggedMessages().length,
    };
  }
}

export default GameServer;
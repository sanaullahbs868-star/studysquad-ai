import { Player, PlayerManager } from "./player";

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export class CommandManager {
  constructor(private playerManager: PlayerManager) {}

  executeCommand(player: Player, command: string): CommandResult {
    if (player.role !== "admin" && player.role !== "owner") {
      return { success: false, message: "❌ Only admins and owners can use commands" };
    }

    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "/fly":
        return this.flyCommand(player);
      case "/give":
        return this.giveCommand(player, args);
      case "/mute":
        return this.muteCommand(args);
      case "/unmute":
        return this.unmuteCommand(args);
      case "/promote":
        return this.promoteCommand(args);
      case "/demote":
        return this.demoteCommand(args);
      case "/announce":
        return this.announceCommand(args.join(" "));
      case "/kick":
        return this.kickCommand(args);
      case "/setxp":
        return this.setXPCommand(args);
      case "/addmoney":
        return this.addMoneyCommand(args);
      case "/teleport":
        return this.teleportCommand(player, args);
      case "/help":
        return this.helpCommand();
      default:
        return { success: false, message: `❌ Unknown command: ${cmd}. Type /help for commands` };
    }
  }

  private flyCommand(player: Player): CommandResult {
    const newPosition = { ...player.position, y: player.position.y + 10 };
    this.playerManager.updatePlayerPosition(player.id, newPosition);
    return { success: true, message: `✈️ ${player.username} is flying! Height: ${newPosition.y}`, data: newPosition };
  }

  private giveCommand(player: Player, args: string[]): CommandResult {
    const [playerName, ...itemParts] = args;
    const itemName = itemParts.join(" ");
    if (!playerName || !itemName) return { success: false, message: "❌ Usage: /give <player_name> <item_name>" };
    const targetPlayer = this.findPlayerByName(playerName);
    if (!targetPlayer) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.addToInventory(targetPlayer.id, itemName);
    return { success: true, message: `📦 Gave ${itemName} to ${playerName}` };
  }

  private muteCommand(args: string[]): CommandResult {
    const playerName = args[0];
    if (!playerName) return { success: false, message: "❌ Usage: /mute <player_name>" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.mutePlayer(player.id);
    return { success: true, message: `🔇 ${playerName} has been muted` };
  }

  private unmuteCommand(args: string[]): CommandResult {
    const playerName = args[0];
    if (!playerName) return { success: false, message: "❌ Usage: /unmute <player_name>" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.unmutePlayer(player.id);
    return { success: true, message: `🔊 ${playerName} has been unmuted` };
  }

  private promoteCommand(args: string[]): CommandResult {
    const [playerName, newRole] = args;
    if (!playerName || !newRole) return { success: false, message: "❌ Usage: /promote <player_name> <role:admin|owner|developer|beginner>" };
    const validRoles = ["admin", "owner", "developer", "beginner"];
    if (!validRoles.includes(newRole)) return { success: false, message: `❌ Invalid role. Use: ${validRoles.join(", ")}` };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.setPlayerRole(player.id, newRole as any);
    return { success: true, message: `⬆️ ${playerName} promoted to ${newRole}` };
  }

  private demoteCommand(args: string[]): CommandResult {
    const playerName = args[0];
    if (!playerName) return { success: false, message: "❌ Usage: /demote <player_name>" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.setPlayerRole(player.id, "beginner");
    return { success: true, message: `⬇️ ${playerName} demoted to beginner` };
  }

  private announceCommand(message: string): CommandResult {
    if (!message) return { success: false, message: "❌ Usage: /announce <message>" };
    return { success: true, message: `📢 [ANNOUNCEMENT] ${message}` };
  }

  private kickCommand(args: string[]): CommandResult {
    const playerName = args[0];
    if (!playerName) return { success: false, message: "❌ Usage: /kick <player_name>" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.removePlayer(player.id);
    return { success: true, message: `👋 ${playerName} has been kicked from the server` };
  }

  private setXPCommand(args: string[]): CommandResult {
    const [playerName, xpStr] = args;
    if (!playerName || !xpStr) return { success: false, message: "❌ Usage: /setxp <player_name> <xp_amount>" };
    const xpAmount = parseInt(xpStr, 10);
    if (isNaN(xpAmount)) return { success: false, message: "❌ XP amount must be a number" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    player.xp = xpAmount;
    player.level = Math.floor(xpAmount / 1000) + 1;
    return { success: true, message: `⭐ Set ${playerName}'s XP to ${xpAmount} (Level: ${player.level})` };
  }

  private addMoneyCommand(args: string[]): CommandResult {
    const [playerName, moneyStr] = args;
    if (!playerName || !moneyStr) return { success: false, message: "❌ Usage: /addmoney <player_name> <amount>" };
    const amount = parseInt(moneyStr, 10);
    if (isNaN(amount)) return { success: false, message: "❌ Amount must be a number" };
    const player = this.findPlayerByName(playerName);
    if (!player) return { success: false, message: `❌ Player "${playerName}" not found` };
    this.playerManager.updatePlayerMoney(player.id, amount);
    return { success: true, message: `💰 Added $${amount} to ${playerName} (New balance: $${player.money})` };
  }

  private teleportCommand(player: Player, args: string[]): CommandResult {
    const [xStr, yStr, zStr] = args;
    if (!xStr || !yStr || !zStr) return { success: false, message: "❌ Usage: /teleport <x> <y> <z>" };
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    const z = parseFloat(zStr);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return { success: false, message: "❌ Coordinates must be numbers" };
    const newPosition = { x, y, z };
    this.playerManager.updatePlayerPosition(player.id, newPosition);
    return { success: true, message: `🌍 Teleported to (${x}, ${y}, ${z})`, data: newPosition };
  }

  private helpCommand(): CommandResult {
    const help = `📋 **ADMIN COMMANDS** (Admin/Owner only):
  /fly - Levitate 10 blocks up
  /give <player> <item> - Give item to player
  /mute <player> - Mute a player
  /unmute <player> - Unmute a player
  /promote <player> <role> - Promote player
  /demote <player> - Demote to beginner
  /announce <message> - Server announcement
  /kick <player> - Remove player
  /setxp <player> <amount> - Set XP
  /addmoney <player> <amount> - Give money
  /teleport <x> <y> <z> - Teleport
  /help - Show this menu`;
    return { success: true, message: help };
  }

  private findPlayerByName(name: string): any {
    return this.playerManager.getAllPlayers().find((p) => p.username.toLowerCase() === name.toLowerCase());
  }
}

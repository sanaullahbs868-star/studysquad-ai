import { Player } from "./player";

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  content: string;
  timestamp: Date;
  isFlagged: boolean;
  flaggedWords: string[];
}

const BAD_WORDS = [
  "badword1",
  "badword2",
  "curse1",
  "curse2",
  "spam",
  "abuse",
  "hate",
];

export class ChatManager {
  private messages: ChatMessage[] = [];
  private messageId: number = 0;

  sendMessage(player: Player, content: string): ChatMessage {
    const { flaggedWords, isClean } = this.checkContent(content);

    const message: ChatMessage = {
      id: `msg-${++this.messageId}`,
      playerId: player.id,
      username: player.username,
      content: isClean ? content : this.censorContent(content),
      timestamp: new Date(),
      isFlagged: !isClean,
      flaggedWords,
    };

    this.messages.push(message);

    if (!isClean) {
      console.log(
        `⚠️ ${player.username} sent flagged message for: ${flaggedWords.join(", ")}`
      );
    }

    return message;
  }

  private checkContent(text: string): {
    flaggedWords: string[];
    isClean: boolean;
  } {
    const flaggedWords = BAD_WORDS.filter((word) =>
      text.toLowerCase().includes(word.toLowerCase())
    );
    return {
      flaggedWords,
      isClean: flaggedWords.length === 0,
    };
  }

  private censorContent(text: string): string {
    let censored = text;
    BAD_WORDS.forEach((word) => {
      const regex = new RegExp(word, "gi");
      censored = censored.replace(regex, "***");
    });
    return censored;
  }

  getRecentMessages(limit: number = 50): ChatMessage[] {
    return this.messages.slice(-limit);
  }

  getFlaggedMessages(): ChatMessage[] {
    return this.messages.filter((m) => m.isFlagged);
  }

  clearMessages(): void {
    this.messages = [];
    this.messageId = 0;
  }
}

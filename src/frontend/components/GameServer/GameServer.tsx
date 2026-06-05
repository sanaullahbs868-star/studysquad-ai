"use client";

import React, { useState, useEffect, useRef } from "react";
import GameServer from "@/game-server/server";
import styles from "./GameServer.module.css";

const GameServerPage: React.FC = () => {
  const [server] = useState(() => new GameServer());
  const [players, setPlayers] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [campusInfo, setCampusInfo] = useState("");
  const [shop, setShop] = useState<any[]>([]);
  const [serverStats, setServerStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "chat" | "shop" | "players" | "campus" | "stats"
  >("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    server.start();

    // Create demo players
    const player1 = server.playerJoin("p1", "Alice");
    const player2 = server.playerJoin("p2", "Bob");
    const player3 = server.playerJoin("p3", "Charlie");

    // Promote some to admins
    server.playerChat("p1", "Hello everyone!");
    server.playerChat("p2", "Hey! Welcome to StudySquad!");

    // Grant some XP
    server.grantXP("p1", 500);
    server.grantXP("p2", 1000);
    server.grantXP("p3", 250);

    // Grant money
    server.grantMoney("p1", 100);
    server.grantMoney("p2", 200);

    setCampusInfo(server.getCampusInfo());
    updateGameState();

    return () => {
      server.stop();
    };
  }, [server]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Update game state
  const updateGameState = () => {
    setPlayers(server.getAllPlayers());
    setChat(server.getChatHistory(30));
    setPlayerStats(server.getPlayerStats("p1"));
    setShop(server.getShop("p1"));
    setServerStats(server.getServerStats());
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      server.playerChat("p1", message);
      setMessage("");
      updateGameState();
    }
  };

  const handleBuyItem = (itemId: string) => {
    const result = server.buyItem("p1", itemId);
    console.log(result);
    updateGameState();
  };

  const handleCommand = (cmd: string) => {
    server.playerChat("p1", cmd);
    updateGameState();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🎮 StudySquad Game Server</h1>
          <div className={styles.serverStatus}>
            <span className={styles.online}>● Online</span>
            <span>{serverStats?.playersOnline} Players</span>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar - Player Stats */}
        <aside className={styles.sidebar}>
          <div className={styles.playerCard}>
            <h3>Your Profile</h3>
            {playerStats && (
              <>
                <div className={styles.statRow}>
                  <span>Avatar:</span>
                  <span className={styles.emoji}>{playerStats.avatar}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Name:</span>
                  <span>{playerStats.username}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Level:</span>
                  <span className={styles.level}>⭐ {playerStats.level}</span>
                </div>
                <div className={styles.statRow}>
                  <span>XP:</span>
                  <span>{playerStats.xp}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Money:</span>
                  <span className={styles.money}>💰 ${playerStats.money}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Role:</span>
                  <span className={styles.role}>{playerStats.role}</span>
                </div>
                <div className={styles.inventory}>
                  <strong>Inventory:</strong>
                  <div className={styles.items}>
                    {playerStats.inventory.map((item: string, i: number) => (
                      <span key={i} className={styles.item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className={styles.statsCard}>
            <h4>Server Stats</h4>
            {serverStats && (
              <>
                <div className={styles.stat}>
                  <span>👥 Players:</span>
                  <span>{serverStats.playersOnline}</span>
                </div>
                <div className={styles.stat}>
                  <span>⭐ Total XP:</span>
                  <span>{serverStats.totalXPEarned}</span>
                </div>
                <div className={styles.stat}>
                  <span>💰 Total Money:</span>
                  <span>${serverStats.totalMoneyInCirculation}</span>
                </div>
                <div className={styles.stat}>
                  <span>💬 Messages:</span>
                  <span>{serverStats.chatMessagesCount}</span>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "chat" ? styles.active : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              💬 Chat
            </button>
            <button
              className={`${styles.tab} ${activeTab === "shop" ? styles.active : ""}`}
              onClick={() => setActiveTab("shop")}
            >
              🛍️ Shop
            </button>
            <button
              className={`${styles.tab} ${activeTab === "players" ? styles.active : ""}`}
              onClick={() => setActiveTab("players")}
            >
              👥 Players
            </button>
            <button
              className={`${styles.tab} ${activeTab === "campus" ? styles.active : ""}`}
              onClick={() => setActiveTab("campus")}
            >
              🏫 Campus
            </button>
            <button
              className={`${styles.tab} ${activeTab === "stats" ? styles.active : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              📊 Stats
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className={styles.section}>
              <h2>💬 Server Chat</h2>
              <div className={styles.chatBox}>
                {chat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${msg.isFlagged ? styles.flagged : ""}`}
                  >
                    <strong>{msg.username}:</strong>
                    <span>{msg.content}</span>
                    {msg.isFlagged && <span className={styles.flag}>⚠️</span>}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder='Type message or command (e.g., /fly, /help)'
                  className={styles.input}
                />
                <button onClick={handleSendMessage} className={styles.sendBtn}>
                  Send
                </button>
              </div>

              {/* Quick Commands */}
              <div className={styles.quickCommands}>
                <h4>Quick Commands</h4>
                <div className={styles.commandGrid}>
                  <button onClick={() => handleCommand("/fly")}>✈️ /fly</button>
                  <button onClick={() => handleCommand("/help")}>❓ /help</button>
                  <button onClick={() => handleCommand("/announce Welcome!")}>
                    📢 /announce
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shop Tab */}
          {activeTab === "shop" && (
            <div className={styles.section}>
              <h2>🛍️ Item Shop</h2>
              <div className={styles.shopGrid}>
                {shop.map((item) => (
                  <div key={item.id} className={`${styles.shopItem} ${styles[item.rarity]}`}>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <div className={styles.itemStats}>
                      <div>💰 ${item.price}</div>
                      <div>⭐ Lvl {Math.floor(item.xpRequired / 1000) + 1}</div>
                    </div>
                    <span className={styles.rarity}>{item.rarity}</span>
                    <button
                      onClick={() => handleBuyItem(item.id)}
                      className={styles.buyBtn}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === "players" && (
            <div className={styles.section}>
              <h2>👥 Online Players</h2>
              <div className={styles.playersList}>
                {players.map((p) => (
                  <div key={p.id} className={styles.playerRow}>
                    <span className={styles.playerAvatar}>{p.avatar}</span>
                    <div className={styles.playerInfo}>
                      <strong>{p.username}</strong>
                      <small>
                        Level {p.level} • {p.role.toUpperCase()}
                      </small>
                    </div>
                    <div className={styles.playerStats_}>
                      <span>XP: {p.xp}</span>
                      <span>💰 ${p.money}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campus Tab */}
          {activeTab === "campus" && (
            <div className={styles.section}>
              <h2>🏫 Campus Map</h2>
              <pre className={styles.campusMap}>{campusInfo}</pre>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className={styles.section}>
              <h2>📊 Server Statistics</h2>
              {serverStats && (
                <div className={styles.statsGrid}>
                  <div className={styles.statCard_}>
                    <h4>👥 Players Online</h4>
                    <p className={styles.bigNumber}>{serverStats.playersOnline}</p>
                  </div>
                  <div className={styles.statCard_}>
                    <h4>🔑 Admins</h4>
                    <p className={styles.bigNumber}>{serverStats.admins}</p>
                  </div>
                  <div className={styles.statCard_}>
                    <h4>⭐ Total XP Earned</h4>
                    <p className={styles.bigNumber}>{serverStats.totalXPEarned}</p>
                  </div>
                  <div className={styles.statCard_}>
                    <h4>💰 Total Money</h4>
                    <p className={styles.bigNumber}>${serverStats.totalMoneyInCirculation}</p>
                  </div>
                  <div className={styles.statCard_}>
                    <h4>💬 Chat Messages</h4>
                    <p className={styles.bigNumber}>{serverStats.chatMessagesCount}</p>
                  </div>
                  <div className={styles.statCard_}>
                    <h4>⚠️ Flagged Messages</h4>
                    <p className={styles.bigNumber}>{serverStats.flaggedMessagesCount}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GameServerPage;

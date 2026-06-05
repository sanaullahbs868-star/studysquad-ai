# 🎮 StudySquad Game Server - QUICK START GUIDE

## 🚀 **Step 1: Open Terminal**

Copy & paste these commands ONE BY ONE:

### **Step 1a: Navigate to Project**
```
cd studysquad-ai
```

### **Step 1b: Switch to Game Server Branch**
```
git checkout feature/game-server
```

### **Step 1c: Update Code**
```
git pull origin feature/game-server
```

---

## 📦 **Step 2: Install Dependencies**

```
pnpm install
```

Wait for it to finish (takes 2-3 minutes)

---

## ▶️ **Step 3: Start the Game Server**

```
pnpm -r run dev
```

Or go to `src/frontend` folder first:
```
cd src/frontend
pnpm dev
```

---

## 🌐 **Step 4: Open in Browser**

When you see:
```
Local:   http://localhost:5173
```

**Click the link or paste it in browser** ✨

---

## 🎮 **Step 5: Use the Game Server**

### **Tabs at the Top:**

1. **💬 Chat**
   - Type messages
   - Type `/help` to see admin commands
   - Type `/fly` (if you're admin)

2. **🛍️ Shop**
   - Browse 12 items
   - Click "Buy" to purchase items
   - Items cost money & need XP level

3. **👥 Players**
   - See all players online
   - Alice, Bob, Charlie are demo players

4. **🏫 Campus**
   - See university map
   - 8 locations with info
   - Basketball court at Gym

5. **📊 Stats**
   - Server statistics
   - Players count
   - Total XP & Money

---

## 🎯 **Admin Commands (Type in Chat)**

Only **Admins & Owners** can use:

```
/fly                    → Fly up 10 blocks
/give bob sword         → Give item to player
/mute alice             → Mute a player
/unmute alice           → Unmute a player
/promote alice admin    → Make someone admin
/demote alice           → Remove admin
/announce Hello!        → Server announcement
/kick bob               → Remove player
/setxp alice 1000       → Set XP
/addmoney bob 500       → Give money
/teleport 0 0 0         → Teleport
/help                   → Show commands
```

---

## 🛑 **Stop the Server**

Press `CTRL + C` in terminal

---

## 📝 **Troubleshooting**

### **Error: Port 5173 already in use?**
```
pnpm dev -- --port 3000
```

### **Error: Cannot find module?**
```
pnpm install
```

### **Need to go back to main branch?**
```
git checkout main
```

---

## ✅ **You're Done!**

The game server is running! Test all features and let me know if you need any changes.

**Next step: Merge to main when ready!**

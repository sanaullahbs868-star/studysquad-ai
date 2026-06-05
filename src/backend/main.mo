import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

actor StudySquadServer {

    // Define what data we store for each player
    public type PlayerProfile = {
        username : Text;
        role : Text;        // "beginner", "developer", "admin", "owner"
        money : Nat;
        xp : Nat;
        isFlying : Bool;
    };

    // Store players using their unique Web3 Principal ID
    stable var entries : [(Principal, PlayerProfile)] = [];
    let players = HashMap.fromIter<Principal, PlayerProfile>(entries.vals(), 10, Principal.equal, Principal.hash);

    // Simple backend word filter
    private func filterChat(msg : Text) : Text {
        // Simple demonstration: replace a target bad word
        if (Text.contains(msg, #text "badword")) {
            "####";
        } else {
            msg;
        };
    };

    // 1. Join / Register Player
    public shared (msg) func joinGame(chosenName : Text) : async PlayerProfile {
        let caller = msg.caller;
        switch (players.get(caller)) {
            case (?profile) profile;
            case (null) {
                let newProfile : PlayerProfile = {
                    username = chosenName;
                    role = "beginner";
                    money = 1000; // Starting money
                    xp = 0;
                    isFlying = false;
                };
                players.put(caller, newProfile);
                newProfile;
            };
        };
    };

    // 2. Chat and Command Processing
    public shared (msg) func sendChatMessage(textMessage : Text) : async Text {
        let caller = msg.caller;
        let player = switch (players.get(caller)) {
            case (?p) p;
            case (null) return "Error: Please join the game first.";
        };

        // Check for Admin Commands
        if (Text.startsWith(textMessage, #text "/")) {
            if (textMessage == "/fly") {
                if (player.role == "admin" or player.role == "owner" or player.role == "developer") {
                    player.isFlying := not player.isFlying;
                    players.put(caller, player);
                    return "System: Flying mode toggled!";
                } else {
                    return "System: Denied. Only Admins/Owners can fly.";
                };
            };
            return "System: Unknown command.";
        };

        // If regular chat, filter it
        let safeMessage = filterChat(textMessage);
        return "[" ^ player.role ^ "] " ^ player.username ^ ": " ^ safeMessage;
    };

    // 3. Economy System: Buy XP
    public shared (msg) func buyXP() : async Text {
        let caller = msg.caller;
        let player = switch (players.get(caller)) {
            case (?p) p;
            case (null) return "Player profile not found.";
        };

        let xpCost : Nat = 500; // Expensive for beginners

        if (player.role == "developer" or player.role == "owner") {
            player.xp += 100;
            players.put(caller, player);
            return "Success: Developer granted free XP!";
        } else if (player.money >= xpCost) {
            player.money -= xpCost;
            player.xp += 10;
            players.put(caller, player);
            return "Success: Bought 10 XP. Balance: " ^ Nat.toText(player.money);
        } else {
            return "Failed: XP costs " ^ Nat.toText(xpCost) ^ " cash. You need more money!";
        };
    };
}

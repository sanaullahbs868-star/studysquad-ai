import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  geminiKeys : Map.Map<Common.UserId, Text>,
) {
  /// Check if caller has configured their Gemini key.
  public query ({ caller }) func isMyGeminiConfigured() : async Bool {
    geminiKeys.containsKey(caller);
  };

  /// Store caller's Gemini API key.
  public shared ({ caller }) func setMyGeminiApiKey(key : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    geminiKeys.add(caller, key);
  };

  /// Remove caller's Gemini API key.
  public shared ({ caller }) func clearMyGeminiApiKey() : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    geminiKeys.remove(caller);
  };
};

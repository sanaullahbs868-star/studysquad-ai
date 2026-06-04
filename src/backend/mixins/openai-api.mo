import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  openAIKeys : Map.Map<Common.UserId, Text>,
) {
  /// Check if caller has configured their OpenAI key.
  public query ({ caller }) func isMyOpenAIConfigured() : async Bool {
    openAIKeys.containsKey(caller);
  };

  /// Store caller's OpenAI API key.
  public shared ({ caller }) func setMyOpenAIApiKey(key : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    openAIKeys.add(caller, key);
  };

  /// Remove caller's OpenAI API key.
  public shared ({ caller }) func clearMyOpenAIApiKey() : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    openAIKeys.remove(caller);
  };
};

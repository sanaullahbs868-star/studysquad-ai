import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Nat64 "mo:core/Nat64";

module {
  /// Call Gemini REST API and return the generated text.
  /// Uses IC HTTP outcalls (management canister http_request).
  public func generateContent(apiKey : Text, prompt : Text) : async Text {
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # apiKey;

    // Escape the prompt for JSON string embedding
    let escapedPrompt = prompt
      .replace(#text "\\\\", "\\\\\\\\")
      .replace(#text "\"", "\\\\\"")
      .replace(#text "\n", "\\\\n")
      .replace(#text "\r", "\\\\r")
      .replace(#text "\t", "\\\\t");

    let body = "{\"contents\":[{\"parts\":[{\"text\":\"" # escapedPrompt # "\"}]}]}";
    let bodyBytes = body.encodeUtf8();

    let httpRequest = {
      url;
      max_response_bytes = ?(50_000 : Nat64);
      headers = [
        { name = "Content-Type"; value = "application/json" },
        { name = "Accept"; value = "application/json" },
      ];
      body = ?bodyBytes;
      method = #post;
      transform = null;
    };

    let ic : actor {
      http_request : ({
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        method : { #get; #post; #head };
        transform : ?{
          function : shared query ({ response : HttpResponse; context : Blob }) -> async HttpResponse;
          context : Blob;
        };
      }) -> async HttpResponse;
    } = actor ("aaaaa-aa");

    let response = await ic.http_request(httpRequest);

    let responseText = switch (response.body.decodeUtf8()) {
      case (?t) t;
      case null { return "" };
    };

    // Parse candidates[0].content.parts[0].text
    parseGeminiResponse(responseText);
  };

  private type HttpResponse = {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  };

  /// Extract the text value from Gemini JSON response.
  /// Looks for candidates[0].content.parts[0].text
  private func parseGeminiResponse(json : Text) : Text {
    // Find "text": in the response
    let textMarker = "\"text\":\"";
    let parts = json.split(#text textMarker).toArray();
    if (parts.size() < 2) return "";
    // The second element contains the text value followed by closing quote
    let after = parts[1];
    // Find the closing unescaped quote — split on '"' to get the value
    let chunks = after.split(#text "\"").toArray();
    if (chunks.size() == 0) return "";
    let raw = chunks[0];
    // Unescape \n -> newline, \" -> ", \\ -> \
    raw
      .replace(#text "\\n", "\n")
      .replace(#text "\\r", "\r")
      .replace(#text "\\t", "\t")
      .replace(#text "\\\"", "\"")
      .replace(#text "\\\\", "\\")
  };
};

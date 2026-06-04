import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/quizzes";
import StudentTypes "../types/students";
import QuizLib "../lib/quizzes";
import StudentLib "../lib/students";
import Gemini "../lib/gemini";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.UserId, StudentTypes.Student>,
  quizzes : Map.Map<Common.QuizId, Types.Quiz>,
  quizState : { var nextQuizId : Nat },
  attempts : Map.Map<Nat, Types.QuizAttempt>,
  attemptState : { var nextAttemptId : Nat },
  geminiKeys : Map.Map<Common.UserId, Text>,
) {
  // Minimal JSON parser for quiz generation output.
  private func parseQuizJson(raw : Text) : [Types.QuizQuestion] {
    // Split on "question":" to find each question block
    let parts = raw.split(#text "\"question\":\"").toArray();
    var qId : Common.QuestionId = 0;
    parts.filterMap<Text, Types.QuizQuestion>(
      func(part) {
        // Find closing quote of question text by splitting on '"'
        let chunks = part.split(#text "\"").toArray();
        if (chunks.size() == 0) return null;
        let questionText = chunks[0];
        if (questionText.size() == 0) return null;
        let opts = extractOptions(part);
        let correctIdx = extractCorrectIndex(part);
        if (opts.size() < 2) return null;
        let question : Types.QuizQuestion = {
          id = qId;
          questionText;
          options = opts.mapEntries<Text, Types.QuizOption>(
            func(optText, i) = { text = optText; isCorrect = (i == correctIdx) },
          );
        };
        qId += 1;
        ?question;
      },
    );
  };

  private func extractOptions(block : Text) : [Text] {
    let marker = "\"options\":";
    if (not block.contains(#text marker)) return [];
    // Split on the marker to get the part after it
    let afterMarker = block.split(#text marker).toArray();
    if (afterMarker.size() < 2) return [];
    let after = afterMarker[1];
    // Extract items between [ and ] by splitting on ","
    let inner = after.split(#text "\",\"").toArray();
    inner.filterMap<Text, Text>(
      func(s) {
        // Strip common JSON delimiters
        let stripped1 = switch (s.stripStart(#text "[")) {
          case (?t) t; case null s;
        };
        let stripped2 = switch (stripped1.stripStart(#text "\"")) {
          case (?t) t; case null stripped1;
        };
        // Stop at ] or whitespace
        let chunks = stripped2.split(#text "\"").toArray();
        let val = if (chunks.size() > 0) chunks[0] else stripped2;
        let trimmed = val.trim(#text " \t\n\r[]");
        if (trimmed.size() > 0) ?trimmed else null;
      },
    );
  };

  private func extractCorrectIndex(block : Text) : Nat {
    let marker = "\"correctIndex\":";
    if (not block.contains(#text marker)) return 0;
    let afterMarker = block.split(#text marker).toArray();
    if (afterMarker.size() < 2) return 0;
    let after = afterMarker[1].trim(#text " \t\n\r");
    // Take first character as digit
    let chars = after.toIter().toArray();
    if (chars.size() == 0) return 0;
    switch (Nat.fromText(Text.fromChar(chars[0]))) {
      case (?n) n;
      case null 0;
    };
  };

  /// The subjects map is accessed via the quizzes mixin for context.
  /// Admin: generate a quiz for a subject via AI.
  public shared ({ caller }) func generateQuiz(subjectId : Common.SubjectId) : async Types.QuizView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    let ?key = geminiKeys.get(caller) else Runtime.trap("Set your Gemini API key first");
    let prompt = "Generate a quiz with exactly 7 multiple choice questions for Grade 9 students. Format your response as a JSON array: [{\"question\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0},...]. Return only the JSON array, no other text.";
    let raw = await Gemini.generateContent(key, prompt);
    let questions = parseQuizJson(raw);
    QuizLib.createQuiz(quizzes, quizState, subjectId, questions, Time.now());
  };

  /// Get the quiz for a subject (without correct-answer reveal).
  public query func getQuiz(subjectId : Common.SubjectId) : async ?Types.QuizView {
    switch (QuizLib.getQuizForSubject(quizzes, subjectId)) {
      case (?qv) {
        let sanitized : Types.QuizView = {
          qv with
          questions = qv.questions.map<Types.QuizQuestion, Types.QuizQuestion>(
            func(q) {
              {
                q with
                options = q.options.map<Types.QuizOption, Types.QuizOption>(
                  func(o) = { o with isCorrect = false },
                )
              }
            },
          )
        };
        ?sanitized;
      };
      case null null;
    };
  };

  /// Submit quiz answers; returns attempt with score.
  public shared ({ caller }) func submitQuizAttempt(quizId : Common.QuizId, answers : [Nat]) : async Types.QuizAttempt {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    let attempt = QuizLib.submitAttempt(quizzes, attempts, attemptState, quizId, caller, answers, Time.now());
    if (attempt.score > 0) {
      switch (students.get(caller)) {
        case (?_) StudentLib.addPoints(students, caller, attempt.score);
        case null {};
      };
    };
    attempt;
  };

  /// Get my quiz attempts.
  public query ({ caller }) func getMyQuizAttempts() : async [Types.QuizAttempt] {
    if (caller.isAnonymous()) return [];
    QuizLib.getMyAttempts(attempts, caller);
  };
};

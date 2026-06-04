import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/subjects";
import SubjectLib "../lib/subjects";
import Gemini "../lib/gemini";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  subjects : Map.Map<Common.SubjectId, Types.Subject>,
  subjectState : { var activeSubjectId : ?Common.SubjectId; var nextSubjectId : Nat },
  qna : Map.Map<Nat, Types.QnAEntry>,
  qnaState : { var nextQnAId : Nat },
  geminiKeys : Map.Map<Common.UserId, Text>,
) {
  /// Admin: set the active subject (with AI-generated description).
  public shared ({ caller }) func setActiveSubject(
    title : Text,
    startDate : Common.Timestamp,
    endDate : Common.Timestamp,
  ) : async Types.SubjectView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    let ?key = geminiKeys.get(caller) else Runtime.trap("Set your Gemini API key first");
    let prompt = "Write a concise, engaging 2-3 sentence description for a Grade 9 school subject titled '" # title # "'. Make it educational and interesting for students.";
    let description = await Gemini.generateContent(key, prompt);
    SubjectLib.setActiveSubject(subjects, subjectState, title, description, startDate, endDate, Time.now());
  };

  /// Get the current active subject.
  public query func getActiveSubject() : async ?Types.SubjectView {
    SubjectLib.getActiveSubject(subjects, subjectState);
  };

  /// Ask AI a question about the active subject. Stores Q+A pair.
  public shared ({ caller }) func askQuestion(subjectId : Common.SubjectId, question : Text) : async Types.QnAEntry {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    let ?key = geminiKeys.get(caller) else Runtime.trap("Set your Gemini API key first");
    let subjectContext = switch (subjects.get(subjectId)) {
      case (?s) "Subject: " # s.title # ". ";
      case null "";
    };
    let prompt = subjectContext # "A Grade 9 student asks: " # question # " Please give a clear, accurate, age-appropriate answer.";
    let answer = await Gemini.generateContent(key, prompt);
    SubjectLib.addQnA(qna, qnaState, subjectId, caller, question, answer, Time.now());
  };

  /// Get all Q&A for a subject by the caller.
  public query ({ caller }) func getMyQnA(subjectId : Common.SubjectId) : async [Types.QnAEntry] {
    if (caller.isAnonymous()) return [];
    SubjectLib.getQnAForSubject(qna, subjectId, caller);
  };
};

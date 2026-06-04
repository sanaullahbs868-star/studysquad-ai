import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CommonTypes "types/common";
import StudentTypes "types/students";
import VotingTypes "types/voting";
import SubjectTypes "types/subjects";
import QuizTypes "types/quizzes";
import MixinStudents "mixins/students-api";
import MixinVoting "mixins/voting-api";
import MixinSubjects "mixins/subjects-api";
import MixinQuizzes "mixins/quizzes-api";
import MixinGemini "mixins/gemini-api";
import Time "mo:core/Time";
import SubjectLib "lib/subjects";



actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Per-user Gemini keys ---
  let geminiKeys : Map.Map<CommonTypes.UserId, Text> = Map.empty();
  include MixinGemini(accessControlState, geminiKeys);

  // --- Students ---
  let students : Map.Map<CommonTypes.UserId, StudentTypes.Student> = Map.empty();
  include MixinStudents(accessControlState, students);

  // --- Voting ---
  let votingEvents : Map.Map<CommonTypes.EventId, VotingTypes.VotingEvent> = Map.empty();
  let votingState = { var nextEventId : Nat = 0 };
  include MixinVoting(accessControlState, students, votingEvents, votingState);

  // --- Subjects ---
  let subjects : Map.Map<CommonTypes.SubjectId, SubjectTypes.Subject> = Map.empty();
  let subjectState = { var activeSubjectId : ?CommonTypes.SubjectId = null; var nextSubjectId : Nat = 0 };
  let qna : Map.Map<Nat, SubjectTypes.QnAEntry> = Map.empty();
  let qnaState = { var nextQnAId : Nat = 0 };
  include MixinSubjects(accessControlState, subjects, subjectState, qna, qnaState, geminiKeys);

  // --- Quizzes ---
  let quizzes : Map.Map<CommonTypes.QuizId, QuizTypes.Quiz> = Map.empty();
  let quizState = { var nextQuizId : Nat = 0 };
  let attempts : Map.Map<Nat, QuizTypes.QuizAttempt> = Map.empty();
  let attemptState = { var nextAttemptId : Nat = 0 };
  include MixinQuizzes(accessControlState, students, quizzes, quizState, attempts, attemptState, geminiKeys);

  // --- Math subject initialization ---
  let mathInitState = { var initialized : Bool = false };
  if (not mathInitState.initialized) {
    let now = Time.now();
    ignore SubjectLib.setActiveSubject(subjects, subjectState, "Mathematics", "Grade 9 Mathematics — the active subject for this month.", now, now + 2_592_000_000_000_000, now);
    mathInitState.initialized := true;
  };
};

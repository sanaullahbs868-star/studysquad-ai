import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import Types "../types/quizzes";
import Nat "mo:core/Nat";

module {
  public func createQuiz(
    quizzes : Map.Map<Common.QuizId, Types.Quiz>,
    state : { var nextQuizId : Nat },
    subjectId : Common.SubjectId,
    questions : [Types.QuizQuestion],
    now : Common.Timestamp,
  ) : Types.QuizView {
    let id = state.nextQuizId;
    state.nextQuizId += 1;
    let quiz : Types.Quiz = {
      id;
      subjectId;
      var questions = questions;
      var createdAt = now;
    };
    quizzes.add(id, quiz);
    toView(quiz);
  };

  public func getQuizForSubject(
    quizzes : Map.Map<Common.QuizId, Types.Quiz>,
    subjectId : Common.SubjectId,
  ) : ?Types.QuizView {
    var result : ?Types.Quiz = null;
    for ((_, quiz) in quizzes.entries()) {
      if (quiz.subjectId == subjectId) {
        switch (result) {
          case null result := ?quiz;
          case (?current) {
            if (quiz.id > current.id) result := ?quiz;
          };
        };
      };
    };
    switch (result) {
      case (?q) ?toView(q);
      case null null;
    };
  };

  public func submitAttempt(
    quizzes : Map.Map<Common.QuizId, Types.Quiz>,
    attempts : Map.Map<Nat, Types.QuizAttempt>,
    state : { var nextAttemptId : Nat },
    quizId : Common.QuizId,
    studentId : Common.UserId,
    answers : [Nat],
    now : Common.Timestamp,
  ) : Types.QuizAttempt {
    let ?quiz = quizzes.get(quizId) else Runtime.trap("Quiz not found");
    let (score, isPerfect) = scoreAttempt(quiz, answers);
    let id = state.nextAttemptId;
    state.nextAttemptId += 1;
    let attempt : Types.QuizAttempt = {
      id; quizId; studentId; answers; score; isPerfect; attemptedAt = now;
    };
    attempts.add(id, attempt);
    attempt;
  };

  public func getMyAttempts(
    attempts : Map.Map<Nat, Types.QuizAttempt>,
    studentId : Common.UserId,
  ) : [Types.QuizAttempt] {
    attempts.values().filter(func(a) = a.studentId == studentId).toArray();
  };

  public func scoreAttempt(
    quiz : Types.Quiz,
    answers : [Nat],
  ) : (score : Nat, isPerfect : Bool) {
    var correct = 0;
    let questions = quiz.questions;
    var i = 0;
    while (i < questions.size() and i < answers.size()) {
      let q = questions[i];
      let answerIdx = answers[i];
      if (answerIdx < q.options.size()) {
        if (q.options[answerIdx].isCorrect) {
          correct += 1;
        };
      };
      i += 1;
    };
    let base = correct * 5;
    let isPerfect = correct == questions.size() and questions.size() > 0;
    let bonus = if (isPerfect) 10 else 0;
    (base + bonus, isPerfect);
  };

  public func toView(self : Types.Quiz) : Types.QuizView {
    { id = self.id; subjectId = self.subjectId; questions = self.questions; createdAt = self.createdAt };
  };
};

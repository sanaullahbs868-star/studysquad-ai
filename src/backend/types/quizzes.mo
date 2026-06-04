import Common "common";

module {
  public type QuizOption = {
    text : Text;
    isCorrect : Bool;
  };

  public type QuizQuestion = {
    id : Common.QuestionId;
    questionText : Text;
    options : [QuizOption];
  };

  public type Quiz = {
    id : Common.QuizId;
    subjectId : Common.SubjectId;
    var questions : [QuizQuestion];
    var createdAt : Common.Timestamp;
  };

  public type QuizView = {
    id : Common.QuizId;
    subjectId : Common.SubjectId;
    questions : [QuizQuestion];
    createdAt : Common.Timestamp;
  };

  public type QuizAttempt = {
    id : Nat;
    quizId : Common.QuizId;
    studentId : Common.UserId;
    answers : [Nat]; // index of selected option per question
    score : Nat;
    isPerfect : Bool;
    attemptedAt : Common.Timestamp;
  };
};

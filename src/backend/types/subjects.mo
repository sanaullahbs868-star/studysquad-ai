import Common "common";

module {
  public type Subject = {
    id : Common.SubjectId;
    var title : Text;
    var description : Text; // AI-generated
    var startDate : Common.Timestamp;
    var endDate : Common.Timestamp;
  };

  public type SubjectView = {
    id : Common.SubjectId;
    title : Text;
    description : Text;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
  };

  public type QnAEntry = {
    id : Nat;
    subjectId : Common.SubjectId;
    studentId : Common.UserId;
    question : Text;
    answer : Text;
    createdAt : Common.Timestamp;
  };
};

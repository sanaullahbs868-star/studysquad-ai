import Map "mo:core/Map";
import Common "../types/common";
import Types "../types/subjects";
import Nat "mo:core/Nat";

module {
  public func setActiveSubject(
    subjects : Map.Map<Common.SubjectId, Types.Subject>,
    state : { var activeSubjectId : ?Common.SubjectId; var nextSubjectId : Nat },
    title : Text,
    description : Text,
    startDate : Common.Timestamp,
    endDate : Common.Timestamp,
    _now : Common.Timestamp,
  ) : Types.SubjectView {
    let id = state.nextSubjectId;
    state.nextSubjectId += 1;
    let subject : Types.Subject = {
      id;
      var title = title;
      var description = description;
      var startDate = startDate;
      var endDate = endDate;
    };
    subjects.add(id, subject);
    state.activeSubjectId := ?id;
    toView(subject);
  };

  public func getActiveSubject(
    subjects : Map.Map<Common.SubjectId, Types.Subject>,
    state : { var activeSubjectId : ?Common.SubjectId },
  ) : ?Types.SubjectView {
    switch (state.activeSubjectId) {
      case (?id) {
        switch (subjects.get(id)) {
          case (?s) ?toView(s);
          case null null;
        };
      };
      case null null;
    };
  };

  public func addQnA(
    qna : Map.Map<Nat, Types.QnAEntry>,
    state : { var nextQnAId : Nat },
    subjectId : Common.SubjectId,
    studentId : Common.UserId,
    question : Text,
    answer : Text,
    now : Common.Timestamp,
  ) : Types.QnAEntry {
    let id = state.nextQnAId;
    state.nextQnAId += 1;
    let entry : Types.QnAEntry = { id; subjectId; studentId; question; answer; createdAt = now };
    qna.add(id, entry);
    entry;
  };

  public func getQnAForSubject(
    qna : Map.Map<Nat, Types.QnAEntry>,
    subjectId : Common.SubjectId,
    studentId : Common.UserId,
  ) : [Types.QnAEntry] {
    qna.values().toArray().filter<Types.QnAEntry>(
      func(e) = e.subjectId == subjectId and e.studentId == studentId,
    );
  };

  public func toView(self : Types.Subject) : Types.SubjectView {
    { id = self.id; title = self.title; description = self.description; startDate = self.startDate; endDate = self.endDate };
  };
};

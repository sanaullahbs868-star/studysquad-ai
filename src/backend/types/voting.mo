import Common "common";

module {
  public type VotingEvent = {
    id : Common.EventId;
    var proposedSubjects : [Text];
    var votes : [(Common.UserId, Text)]; // (voter, subject)
    var isLocked : Bool;
    var winnerSubject : ?Text;
    var createdAt : Common.Timestamp;
  };

  public type VotingEventView = {
    id : Common.EventId;
    proposedSubjects : [Text];
    voteCounts : [(Text, Nat)];
    isLocked : Bool;
    winnerSubject : ?Text;
    createdAt : Common.Timestamp;
    hasVoted : Bool;
  };
};

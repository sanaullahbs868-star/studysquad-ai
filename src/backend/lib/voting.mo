import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import Types "../types/voting";
import StudentTypes "../types/students";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  func countVotes(event : Types.VotingEvent) : Map.Map<Text, Nat> {
    let counts : Map.Map<Text, Nat> = Map.empty();
    for (subject in event.proposedSubjects.values()) {
      counts.add(subject, 0);
    };
    for ((_, subject) in event.votes.values()) {
      switch (counts.get(subject)) {
        case (?n) counts.add(subject, n + 1);
        case null {};
      };
    };
    counts;
  };

  public func createEvent(
    events : Map.Map<Common.EventId, Types.VotingEvent>,
    state : { var nextEventId : Nat },
    proposedSubjects : [Text],
    now : Common.Timestamp,
  ) : Types.VotingEventView {
    let id = state.nextEventId;
    state.nextEventId += 1;
    let event : Types.VotingEvent = {
      id;
      var proposedSubjects = proposedSubjects;
      var votes = [];
      var isLocked = false;
      var winnerSubject = null;
      var createdAt = now;
    };
    events.add(id, event);
    toViewForCaller(event, Principal.anonymous());
  };

  public func castVote(
    events : Map.Map<Common.EventId, Types.VotingEvent>,
    students : Map.Map<Common.UserId, StudentTypes.Student>,
    eventId : Common.EventId,
    caller : Common.UserId,
    subject : Text,
  ) : () {
    let ?event = events.get(eventId) else Runtime.trap("Voting event not found");
    if (event.isLocked) Runtime.trap("Voting is locked");
    let alreadyVoted = event.votes.any(
      func((voter, _)) = voter == caller,
    );
    if (alreadyVoted) Runtime.trap("Already voted");
    let validSubject = event.proposedSubjects.any(
      func(s) = s == subject,
    );
    if (not validSubject) Runtime.trap("Subject not in proposals");
    event.votes := event.votes.concat<(Common.UserId, Text)>([(caller, subject)]);
  };

  public func lockAndAnnounce(
    events : Map.Map<Common.EventId, Types.VotingEvent>,
    eventId : Common.EventId,
    _caller : Common.UserId,
  ) : ?Text {
    let ?event = events.get(eventId) else Runtime.trap("Voting event not found");
    if (event.isLocked) Runtime.trap("Already locked");
    event.isLocked := true;
    let counts = countVotes(event);
    var winner : ?Text = null;
    var best = 0;
    for ((subject, count) in counts.entries()) {
      if (count > best) {
        best := count;
        winner := ?subject;
      };
    };
    event.winnerSubject := winner;
    winner;
  };

  public func getActiveEvent(
    events : Map.Map<Common.EventId, Types.VotingEvent>,
    caller : Common.UserId,
  ) : ?Types.VotingEventView {
    getActiveEventForCaller(events, caller);
  };

  public func getActiveEventForCaller(
    events : Map.Map<Common.EventId, Types.VotingEvent>,
    caller : Common.UserId,
  ) : ?Types.VotingEventView {
    var result : ?Types.VotingEvent = null;
    for ((_, event) in events.entries()) {
      switch (result) {
        case null result := ?event;
        case (?current) {
          if (event.id > current.id) result := ?event;
        };
      };
    };
    switch (result) {
      case (?event) ?toViewForCaller(event, caller);
      case null null;
    };
  };

  public func toViewForCaller(
    self : Types.VotingEvent,
    caller : Common.UserId,
  ) : Types.VotingEventView {
    let counts = countVotes(self);
    let voteCounts = counts.entries().toArray();
    let hasVoted = self.votes.any(
      func((voter, _)) = voter == caller,
    );
    {
      id = self.id;
      proposedSubjects = self.proposedSubjects;
      voteCounts;
      isLocked = self.isLocked;
      winnerSubject = self.winnerSubject;
      createdAt = self.createdAt;
      hasVoted;
    };
  };
};

import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import StudentTypes "../types/students";
import VotingTypes "../types/voting";
import VotingLib "../lib/voting";
import StudentLib "../lib/students";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.UserId, StudentTypes.Student>,
  votingEvents : Map.Map<Common.EventId, VotingTypes.VotingEvent>,
  votingState : { var nextEventId : Nat },
) {
  /// Admin: create a new monthly voting event.
  public shared ({ caller }) func createVotingEvent(proposedSubjects : [Text]) : async VotingTypes.VotingEventView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    VotingLib.createEvent(votingEvents, votingState, proposedSubjects, Time.now());
  };

  /// Topper-only: cast a vote for a subject.
  public shared ({ caller }) func castVote(eventId : Common.EventId, subject : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    if (not StudentLib.isTopper(students, caller)) {
      Runtime.trap("Only top 10 students by points can vote");
    };
    VotingLib.castVote(votingEvents, students, eventId, caller, subject);
  };

  /// Admin: lock voting and announce winner.
  public shared ({ caller }) func lockVoting(eventId : Common.EventId) : async ?Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    VotingLib.lockAndAnnounce(votingEvents, eventId, caller);
  };

  /// Get the current active voting event.
  public query ({ caller }) func getActiveVotingEvent() : async ?VotingTypes.VotingEventView {
    VotingLib.getActiveEventForCaller(votingEvents, caller);
  };
};

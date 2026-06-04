import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/students";
import StudentLib "../lib/students";

mixin (
  accessControlState : AccessControl.AccessControlState,
  students : Map.Map<Common.UserId, Types.Student>,
) {
  /// Register or update the caller's profile.
  public shared ({ caller }) func registerStudent(displayName : Text) : async Types.StudentView {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    StudentLib.register(students, caller, displayName);
  };

  /// Get my own profile.
  public query ({ caller }) func getMyProfile() : async ?Types.StudentView {
    if (caller.isAnonymous()) return null;
    let rank = StudentLib.getRank(students, caller);
    StudentLib.getStudent(students, caller, rank, accessControlState);
  };

  /// Get a student's public profile.
  public query func getStudentProfile(id : Common.UserId) : async ?Types.StudentView {
    let rank = StudentLib.getRank(students, id);
    StudentLib.getStudent(students, id, rank, accessControlState);
  };

  /// Update display name.
  public shared ({ caller }) func updateMyDisplayName(name : Text) : async () {
    if (caller.isAnonymous()) Runtime.trap("Sign in first");
    StudentLib.updateDisplayName(students, caller, name);
  };

  /// Top 20 leaderboard.
  public query func getLeaderboard() : async [Types.StudentView] {
    StudentLib.getLeaderboard(students, 20, accessControlState);
  };

  /// Get my rank.
  public query ({ caller }) func getMyRank() : async Nat {
    if (caller.isAnonymous()) return 0;
    StudentLib.getRank(students, caller);
  };

  /// Register with special owner/admin password.
  public shared ({ caller }) func registerWithPassword(displayName : Text, password : Text) : async { #ok : Types.StudentView; #err : Text } {
    if (caller.isAnonymous()) return #err("Sign in first");
    if (password != "1029384746") return #err("Invalid password");
    // Register or get existing student
    let rank = StudentLib.getRank(students, caller);
    let view = switch (students.get(caller)) {
      case (?existing) {
        existing.displayName := displayName;
        existing.toView(rank, StudentLib.computeRoleLabel(displayName, true));
      };
      case null {
        let student : Types.Student = {
          id = caller;
          var displayName = displayName;
          var totalPoints = 0;
        };
        students.add(caller, student);
        student.toView(students.size(), StudentLib.computeRoleLabel(displayName, true));
      };
    };
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    #ok(view);
  };

  /// Get role info for a principal.
  public query func getRoleInfo(id : Principal) : async { isOwner : Bool; isAdmin : Bool; displayName : Text } {
    let isAdmin = AccessControl.hasPermission(accessControlState, id, #admin);
    let displayName = switch (students.get(id)) {
      case (?s) s.displayName;
      case null "";
    };
    let isOwner = isAdmin and displayName == "Sanaullah";
    { isOwner; isAdmin; displayName };
  };
};

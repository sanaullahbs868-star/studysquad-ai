import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import Types "../types/students";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  // Returns the 1-based rank of a student by points (0 if not found).
  public func getRank(students : Map.Map<Common.UserId, Types.Student>, id : Common.UserId) : Nat {
    let all = students.values().toArray();
    let sorted = all.sort(
      func(a, b) = Nat.compare(b.totalPoints, a.totalPoints),
    );
    var rank = 0;
    var i = 0;
    while (i < sorted.size()) {
      if (sorted[i].id == id) { rank := i + 1 };
      i += 1;
    };
    rank;
  };

  public func register(
    students : Map.Map<Common.UserId, Types.Student>,
    caller : Common.UserId,
    displayName : Text,
  ) : Types.StudentView {
    switch (students.get(caller)) {
      case (?existing) {
        // Return existing student's view with rank
        let rank = getRank(students, caller);
        toView(existing, rank, "");
      };
      case null {
        let student : Types.Student = {
          id = caller;
          var displayName = displayName;
          var totalPoints = 0;
        };
        students.add(caller, student);
        toView(student, students.size(), "");
      };
    };
  };

  public func getStudent(
    students : Map.Map<Common.UserId, Types.Student>,
    id : Common.UserId,
    rank : Nat,
    accessControlState : AccessControl.AccessControlState,
  ) : ?Types.StudentView {
    switch (students.get(id)) {
      case (?s) {
        let isAdmin = AccessControl.hasPermission(accessControlState, id, #admin);
        let roleLabel = computeRoleLabel(s.displayName, isAdmin);
        ?toView(s, rank, roleLabel);
      };
      case null null;
    };
  };

  public func updateDisplayName(
    students : Map.Map<Common.UserId, Types.Student>,
    caller : Common.UserId,
    name : Text,
  ) : () {
    switch (students.get(caller)) {
      case (?s) s.displayName := name;
      case null Runtime.trap("Student not found");
    };
  };

  public func addPoints(
    students : Map.Map<Common.UserId, Types.Student>,
    id : Common.UserId,
    points : Nat,
  ) : () {
    switch (students.get(id)) {
      case (?s) s.totalPoints := s.totalPoints + points;
      case null Runtime.trap("Student not found");
    };
  };

  public func getLeaderboard(
    students : Map.Map<Common.UserId, Types.Student>,
    limit : Nat,
    accessControlState : AccessControl.AccessControlState,
  ) : [Types.StudentView] {
    let all = students.values().toArray();
    let sorted = all.sort(
      func(a, b) = Nat.compare(b.totalPoints, a.totalPoints),
    );
    let count = if (sorted.size() < limit) sorted.size() else limit;
    Array.tabulate<Types.StudentView>(
      count,
      func(i) {
        let s = sorted[i];
        let isAdmin = AccessControl.hasPermission(accessControlState, s.id, #admin);
        let roleLabel = computeRoleLabel(s.displayName, isAdmin);
        toView(s, i + 1, roleLabel);
      },
    );
  };

  public func isTopper(
    students : Map.Map<Common.UserId, Types.Student>,
    id : Common.UserId,
  ) : Bool {
    let rank = getRank(students, id);
    rank > 0 and rank <= 10;
  };

  public func computeRoleLabel(displayName : Text, isAdmin : Bool) : Text {
    if (isAdmin and displayName == "Sanaullah") "Developer, Owner"
    else if (isAdmin and displayName == "Syed Shabbir Hussain") "Admin"
    else "";
  };

  public func toView(
    self : Types.Student,
    rank : Nat,
    roleLabel : Text,
  ) : Types.StudentView {
    { id = self.id; displayName = self.displayName; totalPoints = self.totalPoints; rank; roleLabel };
  };
};

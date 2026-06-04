import Common "common";

module {
  public type Student = {
    id : Common.UserId;
    var displayName : Text;
    var totalPoints : Nat;
  };

  // Shared (immutable) version for API boundaries
  public type StudentView = {
    id : Common.UserId;
    displayName : Text;
    totalPoints : Nat;
    rank : Nat;
    roleLabel : Text;
  };
};

import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Error "mo:core/Error";
import Int "mo:core/Int";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module Interest {
    public func compare(i1 : ResearchInterest, i2 : ResearchInterest) : Order.Order {
      Text.compare(i1.name, i2.name);
    };
  };

  module Publish {
    public func compare(p1 : Publication, p2 : Publication) : Order.Order {
      switch (Text.compare(p1.title, p2.title)) {
        case (#equal) {
          Int.compare(p1.timestamp, p2.timestamp);
        };
        case (other) { other };
      };
    };
  };

  type ResearcherProfile = {
    name : Text;
    biography : Text;
    photo : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type ResearchInterest = {
    id : Text;
    name : Text;
  };

  type Publication = {
    id : Text;
    title : Text;
    description : Text;
    link : ?Text;
    pdf : ?Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  type ContactInfo = {
    email : Text;
    affiliation : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  var owner : ?Principal = null;
  var profile : ?ResearcherProfile = null;
  let interests = Map.empty<Text, ResearchInterest>();
  let publications = Map.empty<Text, Publication>();
  var contactInfo : ?ContactInfo = null;
  let userProfiles = Map.empty<Principal, UserProfile>();

  type ProfileData = {
    name : Text;
    biography : Text;
    photo : ?Storage.ExternalBlob;
  };

  // User profile management required by authorization system
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Authorization check: Only authenticated users (not guests) can access their own profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Authorization check: Users can only view their own profile, admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(userProfile : UserProfile) : async () {
    // Authorization check: Only authenticated users (not guests) can save their profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, userProfile);
  };

  // Owner check for researcher profile management
  public query ({ caller }) func isOwner() : async Bool {
    switch (owner) {
      case (null) { false };
      case (?currentOwner) { caller == currentOwner };
    };
  };

  func assertOwner(caller : Principal) {
    // Anonymous principals cannot be owners
    if (caller.isAnonymous()) {
      Runtime.trap("Access denied. Anonymous users cannot modify data.");
    };

    switch (owner) {
      case (null) {
        // First write sets the owner
        owner := ?caller;
      };
      case (?existingOwner) {
        if (caller != existingOwner) {
          Runtime.trap("Access denied. Only the owner can modify this data.");
        };
      };
    };
  };

  public shared ({ caller }) func setProfile(name : Text, biography : Text, photo : ?Storage.ExternalBlob) : async () {
    assertOwner(caller);
    profile := ?{
      name;
      biography;
      photo;
      timestamp = Time.now();
    };
  };

  public query func getProfile() : async ?ProfileData {
    // Public read access - no authentication required
    switch (profile) {
      case (null) { null };
      case (?p) {
        ?{
          name = p.name;
          biography = p.biography;
          photo = p.photo;
        };
      };
    };
  };

  public shared ({ caller }) func addResearchInterest(name : Text) : async Text {
    assertOwner(caller);
    let id = generateId(name);
    interests.add(id, { id; name });
    id;
  };

  public query func getResearchInterests() : async [ResearchInterest] {
    // Public read access - no authentication required
    interests.values().toArray().sort();
  };

  public shared ({ caller }) func deleteResearchInterest(interestId : Text) : async () {
    assertOwner(caller);
    switch (interests.get(interestId)) {
      case (null) {
        Runtime.trap("Interest with id [" # interestId # "] does not exist and cannot be deleted.");
      };
      case (_) {
        interests.remove(interestId);
      };
    };
  };

  public shared ({ caller }) func addPublication(title : Text, description : Text, link : ?Text, pdf : ?Storage.ExternalBlob) : async Text {
    assertOwner(caller);
    let id = generateId(title);
    publications.add(id, {
      id;
      title;
      description;
      link;
      pdf;
      timestamp = Time.now();
    });
    id;
  };

  public query func getPublication(id : Text) : async Publication {
    // Public read access - no authentication required
    switch (publications.get(id)) {
      case (null) {
        Runtime.trap("Publication with id [" # id # "] does not exist and cannot be retrieved");
      };
      case (?publication) { publication };
    };
  };

  public query func getPublications() : async [Publication] {
    // Public read access - no authentication required
    publications.values().toArray().sort();
  };

  public shared ({ caller }) func deletePublication(publicationId : Text) : async () {
    assertOwner(caller);
    switch (publications.get(publicationId)) {
      case (null) {
        Runtime.trap("Publication with id [" # publicationId # "] does not exist and cannot be deleted.");
      };
      case (_) {
        publications.remove(publicationId);
      };
    };
  };

  public shared ({ caller }) func updatePublication(publicationId : Text, title : Text, description : Text, link : ?Text, pdf : ?Storage.ExternalBlob) : async () {
    assertOwner(caller);
    switch (publications.get(publicationId)) {
      case (null) {
        Runtime.trap("Publication with id [" # publicationId # "] does not exist and cannot be updated.");
      };
      case (_) {
        publications.add(publicationId, {
          id = publicationId;
          title;
          description;
          link;
          pdf;
          timestamp = Time.now();
        });
      };
    };
  };

  public shared ({ caller }) func setContactInfo(email : Text, affiliation : Text) : async () {
    assertOwner(caller);
    if (not isValidEmail(email)) {
      Runtime.trap("Invalid email address: " # email);
    };
    contactInfo := ?{ email; affiliation };
  };

  public query func getContactInfo() : async ?ContactInfo {
    // Public read access - no authentication required
    contactInfo;
  };

  public shared ({ caller }) func clearData() : async () {
    assertOwner(caller);
    profile := null;
    interests.clear();
    publications.clear();
    contactInfo := null;
  };

  func isValidEmail(email : Text) : Bool {
    let validLength = email.size() >= 5 and email.size() <= 254;
    let atSymbol = email.chars().find(
      func(char) {
        char == '@';
      }
    );
    let atCount = email.chars().foldLeft(0, func(acc, char) { if (char == '@') { acc + 1 } else { acc } });
    validLength and atSymbol != null and atCount == 1 and email.contains(#char('.')) and email.contains(#char('@'));
  };

  func generateId(_ : Text) : Text {
    Time.now().toText();
  };
};

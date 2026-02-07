# Specification

## Summary
**Goal:** Let the site owner securely edit the researcher profile (name/bio/photo), research interests, publications (including links/PDFs), and contact info via an authenticated admin UI.

**Planned changes:**
- Add canister-level single-owner authorization (Internet Identity principal) for all write methods; first successful write sets the owner; non-owner writes are rejected with a clear error.
- Add a public query method to check whether the current caller is the owner for frontend gating; keep existing read-only queries publicly accessible.
- Build an authenticated frontend “Edit” experience using Internet Identity login and React Query mutations to add/update profile (name, bio, optional photo), research interests, publications (title, description, optional link, optional PDF), and contact info (email, affiliation).
- Add owner-only content management for ongoing maintenance: delete individual research interests and publications, and remove/replace uploaded blobs (profile photo, publication PDF), with corresponding backend methods and frontend wiring.
- After successful edits, invalidate relevant queries so the homepage updates immediately without a full page reload and display validation/authorization errors in a user-friendly way.

**User-visible outcome:** The owner can sign in with Internet Identity to manage the full researcher profile (including uploads, updates, and deletions), while non-owners can still view the public profile but cannot access editing controls.

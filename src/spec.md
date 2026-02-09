# Specification

## Summary
**Goal:** Let authenticated non-owner users view and update their own personal info (UserProfile name) via a dedicated Personal Info UI, using existing backend endpoints.

**Planned changes:**
- Add a Personal Info editor UI for authenticated users to view the currently saved name (or empty state) and submit updates.
- Implement React Query hooks to fetch the caller’s UserProfile and to mutate it via saveCallerUserProfile, invalidating the existing `['currentUserProfile']` cache key on success.
- Add a non-owner authenticated entry point (e.g., in the header near login) to open the Personal Info editor, while keeping the owner-only Admin Edit panel behavior unchanged.
- Show success and error feedback via the existing toast system, including clear handling of authorization errors.

**User-visible outcome:** Logged-in non-owner users can open a Personal Info screen, see their current name, update it, and immediately see the updated name reflected in the UI without a full page refresh; errors (including authorization failures) are shown as clear messages.

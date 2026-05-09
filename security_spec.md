# Cyber Octagon Run Security Specification

## Data Invariants
1. User profile can only be modified by the owner.
2. High scores can only be updated if the new score is greater than the existing one.
3. Users cannot give themselves credits (coins) freely (in a real production app, this would be server-side, but here we enforce client-side with limits).

## The Dirty Dozen (Attack Vectors)
1. Spoofing another user's UID in a profile update.
2. Manually setting `highScore` to a negative number.
3. Adding millions of `coins` in a single update.
4. Accessing other users' private email if stored.
5. Deleting the leaderboard collection.
6. Injecting huge strings into the `displayName`.
7. Updating the `highScore` of another player.
8. Bypassing the `updatedAt` timestamp.
9. Modifying the `unlockedSkins` array without enough coins.
10. Creating a profile without mandatory fields.
11. Large payload attacks (denial of wallet).
12. Unauthorized read of all user profiles.

## Firestore Rules
Drafting in `firestore.rules`...

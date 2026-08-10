# Vocab World — Google Play Privacy & Account Deletion Remediation

Prepared: 10 August 2026. This is an implementation-based Play Console worksheet, not a Play Console submission.

## Account-deletion result

The only permanent account-deletion entry point is:

`Settings → Account & Privacy → Delete account and data → warning → Continue → type DELETE → Google re-authentication → Permanently delete account and data`

No Firebase data is modified before typed confirmation and recent authentication. Realtime Database cleanup is submitted as one multi-location update; if validation or permission fails, the RTDB write is rejected as a whole. Firebase Authentication is deleted only after that cleanup succeeds. If final Auth deletion fails unexpectedly after RTDB cleanup, the app keeps the signed-in session and a finalize-only retry marker; it does not claim success.

### Data action matrix

| Data/root | Action on deletion |
|---|---|
| `/users/<uid>`, `/pphoto/<uid>` | Delete save, profile, progress, learning history, pets/items, optional profile photo |
| `/presence`, `/leaderboard`, `/examRank`, `/bandRank`, `/f1Rank`, monthly award rows | Delete the departing user's row(s) |
| Friend code, friends, requests, follows, gifts, invites, notifications | Delete owned rows and known reciprocal references; notification lookup is restricted to rows authored by the deleting UID |
| Private chat | Delete messages authored by the departing user; retain the other participant's messages in the shared conversation |
| Feed/global feed | Delete the user's feed/profile assets and own posts/comments; remove own likes/reactions on others' content |
| Market and billboard | Delete listings/signage owned by the UID; aggregated `/sales` counts are retained because they contain no UID |
| Multiplayer presence/signaling | Delete UID-keyed legacy/world/room/presence/inbox records across known maps and rooms |
| Active online quiz room | If the user owns the active ephemeral room, close that room; otherwise delete only the user's member, score, answer, chat, and voice-member portions |
| Shared game state (`/hauntedHotel`, shared class/run state) | Retain where it is not a UID-indexed personal record; remove matching UID rows from active podium data |
| Other players' content and limited service/security records | Retain only where deleting it would erase another player's content or where Firebase/service operations require limited retention; policy and deletion page disclose this |

Known limitation: historical outbound records that are neither UID-indexed nor discoverable under privacy-preserving RTDB Rules (for example, already-consumed transient signaling or an inaccessible old shared-room record) cannot be enumerated safely by a browser client. The implemented cleanup covers deterministic paths, current save indexes, known contacts, public owner-indexed content, and the active room. A future privileged deletion backend can perform a complete server-side UID scan without broadening client read access.

## Proposed Google Play Data Safety mapping

Google defines “collected” as transmitted off device, including SDK transmission. It treats service-provider transfers and qualifying user-initiated transfers as sharing exceptions. The “Shared” recommendations below assume Firebase is used as the developer's service provider and user-to-user disclosure is expected within the feature; verify those assumptions in the final Play Console form.

| Play data type | Collected? | Shared? | Required / optional | Purpose | Encrypted in transit? | Deletion available? |
|---|---:|---:|---|---|---:|---:|
| Name (nickname) | Yes | No* | Required for online profile | App functionality, account management | Yes | Yes |
| Email address | Yes | No | Required for Google/Firebase account | Authentication, account management, authorized role/access management, security | Yes | Yes |
| User IDs | Yes | No* | Required for account/online features | Account management, app functionality, security | Yes | Yes |
| Other personal info (grade level) | Yes | No* | Required for grade-matched learning/profile | App functionality, personalization | Yes | Yes |
| Photos | Yes | No* | Optional | Profile/social functionality | Yes | Yes |
| Contacts (device address book) | No | No | Not used | Vocab World does not request or upload the device contact list | — | — |
| Friends/social relationships | Yes | No* | Optional | In-app friends, follows, requests, gifting, and chat access | Yes | Yes; declare under the closest Play Console category shown (typically other personal info or app activity), not device Contacts |
| Other in-app messages | Yes | No* | Optional | Private and room chat | Yes | Yes; user's messages are removed where safely isolatable |
| Other user-generated content | Yes | No* | Optional | Posts, comments, pet names, profile/feed content, in-world signage | Yes | Yes |
| App interactions | Yes | No* | Core progress automatic; social interactions optional | Save/restore progress, learning and game functionality | Yes | Yes |
| Other actions | Yes | No* | Core gameplay automatic; likes/gifts/social actions optional | Gameplay, leaderboards, multiplayer/social functionality | Yes | Yes |
| Voice or sound recordings | **Yes — processed ephemerally when a call is used** | No* | Optional, user initiated | Real-time voice | WebRTC encrypted transport | Audio is not stored, so there is no retained recording to delete; signaling/inbox data is deleted |
| Approximate/precise location | No direct application collection; **review Firebase IP processing in the current Play form** | No | Not used by Vocab World | Firebase processes IP addresses for security/service operation; the app does not request GPS or use IP to infer physical location | Yes | Provider retention applies |
| Device or other IDs | Not evidenced in current Web/TWA code | No | — | Firebase Auth UID is declared under User IDs; no Analytics/FCM/Installations SDK is loaded by the web app | — | — |

`No*` means Firebase processing as a service provider and expected user-initiated disclosure are not normally declared as “sharing” under Play's exceptions. Because leaderboard, presence, profile, and default-on feed activity can be visible to other players, confirm the exact Play Console interpretation; use a conservative “Shared: Yes” answer if the final reviewer does not accept the exception for those automatic disclosures.

### Ephemeral processing

- WebRTC voice audio is not recorded or written to Firebase. It is transmitted in real time using encrypted WebRTC transport and is available to call peers only during the call.
- Firebase stores only call/ring and WebRTC connection-signaling records needed to establish the session; deletion removes the user's inbox paths and transient records are also consumed by clients.
- Firebase Authentication, Realtime Database, and Hosting process IP addresses/user-agent data for authentication, security, abuse prevention, service delivery, and short operational retention. Vocab World does not use IP addresses to infer location or for advertising.

## Required Play Console actions

1. Publish the reviewed Firebase Rules block before releasing the deletion UI; otherwise the flow fails safely because comment/award/friend-code/notification cleanup is not authorized by the old rules.
2. Build and deploy the hosting release, then enter `https://vocabworld.web.app/delete-account.html` in the Account deletion URL field.
3. Update the Privacy policy URL to `https://vocabworld.web.app/privacy.html` and submit the matching Data Safety answers.
4. Confirm target-audience/Families configuration and the product decision about parental/school supervision. The app does not implement verified parental consent or age verification.
5. Review the final AAB dependency report. This repository uses Firebase Web SDKs inside a TWA and does not include Analytics, Crashlytics, FCM, Ads, or Firebase Installations in the web code; a native wrapper dependency could change the Device ID/diagnostics mapping.

## Readiness gate

Implementation and documentation are prepared locally, but the release is not Play-ready until Firebase Rules are published and the built pages/deletion flow are verified on production hosting with an isolated test account.

# Vocab Arena audio sources

## User-supplied Arena background music (round 1392)

Source: `C:\Users\rober\english-pet-game\sound\arena\Arena_bgmusic.mp3`, supplied and requested for Arena by the user; not a Kenney/CC0 asset. No external license was supplied or inferred.

Runtime derivatives (118.72 seconds, stereo; embedded artwork/metadata removed):
- `sound/arena/bgmusic-b6b49f8fdc7aeb2f.ogg`: Opus VBR 80 kbps, 1,284,092 bytes.
- `sound/arena/bgmusic-e450dce94058763f.mp3`: MP3 128 kbps compatibility fallback, 1,900,416 bytes.

The browser selects one supported format, not both. Fetched only after an Arena gesture with music enabled; stored in the existing content-hash asset cache across reloads/deployments. Loops from the cached compressed Blob without repeated network requests or decoding the full song to PCM. Cache eviction/private browsing can require a later download. Original file (2,787,323 bytes) is preserved locally, not added to the runtime build.

The earlier Kenney SFX system and its 11 runtime clips were removed at the user's request in round 1392. The user subsequently approved five new MEGA activation, elemental cast, shield impact, healing and lightning clips in round 1393; no old SFX restored.

## User-approved MEGA activation (round 1393)

Source: `C:\Users\rober\english-pet-game\sound\arena\1.mp3` supplied by user and explicitly assigned to MEGA. No external license supplied or inferred. Runtime: `sound/arena/mega-5583f203fe74a126.mp3`, 58,080 bytes; 2.4135 seconds, stereo 48 kHz. Audio frames copied without re-encoding; artwork/metadata removed (source 86,212 bytes). Preserves the supplied sound quality. Quiet preload when MEGA becomes ready; playback only on successful activation. One reusable player, shared sound setting, persistent content-hash cache, no looping or stacking.

## User-approved successful elemental power cast (round 1393)

Source: `C:\Users\rober\english-pet-game\sound\arena\2.mp3`, explicitly supplied and assigned by the user. No external license supplied or inferred. Runtime: `sound/arena/element-91011ad1b87d230d.mp3`, 55,170 bytes, identical original MP3 audio with no lossy re-encoding. Quiet preload after the first Arena gesture, persistent content-hash cache, one reusable player and a 250 ms retrigger guard. Shared sound mute and immediate background/exit cleanup. Original is preserved locally and excluded from the runtime build.

## User-approved shield absorbing incoming damage (round 1393)

Source: `C:\Users\rober\english-pet-game\sound\arena\3.mp3`, explicitly supplied and assigned by the user. No external license supplied or inferred. Runtime: `sound/arena/shield-2a738b9421347bc6.mp3`, 49,920 bytes, identical original MP3 audio with no lossy re-encoding. Quiet preload after the first Arena gesture, persistent content-hash cache, one reusable player and a 250 ms retrigger guard. Shared sound mute and immediate background/exit cleanup. Original is preserved locally and excluded from the runtime build.

## User-approved healing (round 1393)

Source: `C:\Users\rober\english-pet-game\sound\arena\4.mp3`, explicitly supplied and assigned by the user. No external license supplied or inferred. Runtime: `sound/arena/heal-f5beb28f8a0c7708.mp3`, 25,920 bytes, identical original MP3 (1.296 seconds, stereo 24 kHz). Quiet first-gesture preload and persistent cache as above. Plays only for actual HP restored by spells, home recovery, passive regeneration or revival; no sound for full HP, stat upgrades or round resets. Retrigger guard 1.8 seconds bounds continuous healing and avoids overlap.

## User-approved lightning (round 1393)

Source: `C:\Users\rober\english-pet-game\sound\arena\5.mp3`, explicitly supplied for lightning. No external license supplied or inferred. Runtime: `sound/arena/lightning-261c63b74d97a82f.mp3`, 35,108 bytes, identical original MP3 (1.097125 seconds, stereo 44.1 kHz). Replaces the generic elemental cast cue for ARC and all five extended arc-family spells, without playing both cues. Quiet first-gesture preload, persistent cache and reusable player as above.

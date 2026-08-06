#!/usr/bin/env python3
"""Generate original, file-backed hotel footsteps and reward cues.

The haunted world intentionally loads these WAV files from sound/ghost instead of
reusing the game's legacy effects or synthesising sounds at runtime.
"""

from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path


RATE = 44_100
OUT = Path(__file__).resolve().parents[1] / "sound" / "ghost"


def write_wav(name: str, samples: list[float]) -> None:
    peak = max(1e-9, max(abs(v) for v in samples))
    scale = 0.92 / peak
    data = b"".join(struct.pack("<h", int(max(-1, min(1, v * scale)) * 32767)) for v in samples)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / name), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(data)


def low_noise(rng: random.Random, n: int, smooth: float = 0.92) -> list[float]:
    y = 0.0
    out = []
    for _ in range(n):
        y = smooth * y + (1 - smooth) * rng.uniform(-1, 1)
        out.append(y)
    return out


def footstep(seed: int) -> list[float]:
    rng = random.Random(seed)
    dur = 0.36
    n = int(RATE * dur)
    noise = low_noise(rng, n, 0.84)
    out = []
    f0 = 78 + seed * 4
    creak = 285 + seed * 17
    for i in range(n):
        t = i / RATE
        impact = math.exp(-t * 31) * math.sin(2 * math.pi * (f0 - 45 * t) * t)
        sole = noise[i] * math.exp(-t * 23)
        wood = math.sin(2 * math.pi * creak * t + 3.8 * math.sin(2 * math.pi * 7 * t))
        wood *= math.exp(-max(0.0, t - 0.025) * 19) * min(1.0, t / 0.025)
        heel = math.exp(-((t - 0.018) / 0.012) ** 2) * rng.uniform(-0.8, 0.8)
        out.append(0.67 * impact + 0.34 * sole + 0.12 * wood + 0.18 * heel)
    return out


def letter_collect() -> list[float]:
    dur = 0.46
    n = int(RATE * dur)
    rng = random.Random(7401)
    out = []
    for i in range(n):
        t = i / RATE
        env = min(1, t / 0.008) * math.exp(-t * 8.5)
        glass = sum(math.sin(2 * math.pi * f * t) * a for f, a in ((742, .55), (1113, .3), (1489, .16)))
        dust = rng.uniform(-1, 1) * math.exp(-t * 30)
        out.append(env * glass + .055 * dust)
    return out


def reward_coins() -> list[float]:
    dur = 1.7
    n = int(RATE * dur)
    rng = random.Random(500)
    notes = [(0.00, 988), (0.12, 1319), (0.24, 1568), (0.43, 1976), (0.70, 2637)]
    out = [0.0] * n
    for at, freq in notes:
        start = int(at * RATE)
        for i in range(start, n):
            t = (i - start) / RATE
            env = min(1, t / .005) * math.exp(-t * 5.2)
            out[i] += .42 * env * (math.sin(2 * math.pi * freq * t) + .28 * math.sin(2 * math.pi * freq * 2.01 * t))
    for i in range(n):
        t = i / RATE
        out[i] += rng.uniform(-1, 1) * .025 * math.exp(-t * 12)
    return out


def main() -> None:
    for i in range(1, 5):
        write_wav(f"player_step_wood_{i}.wav", footstep(i))
    write_wav("letter_collect.wav", letter_collect())
    write_wav("reward_500_coins.wav", reward_coins())


if __name__ == "__main__":
    main()

# Fitness Tracker — Intent

## What this is

A personal workout logger built as a single HTML file (plus a tiny service worker for offline). No server, no account, no subscription. Data lives in the browser's IndexedDB. The whole thing lives at fit-logs.vercel.app and works like a native app on a phone.

## Who it's for

Tim is the guinea pig. The app must earn its keep through his own real workouts first. Once it's validated by actual use, the goal is for more people to benefit from it — which is why onboarding groundwork (tour engine, demo seed data) exists, but always sequenced *behind* real personal usage, never ahead of it.

## The one job

Make it fast and frictionless to log a set while you're standing at a machine. Two taps after picking an exercise: weight, reps. Done. Everything else is secondary to that.

## Core principles

- **Auto-save always.** No save button. No lost data. Close mid-workout, reopen, pick up where you left off.
- **"Last time" is king.** The most useful thing the app can show is what weight and reps you hit last time on this exercise.
- **Suggestions, not mandates.** Named splits (Push Day, Pull Day) are labels, not locked lists. The app proposes, you decide.
- **Phone-first, always.** Every touch target is 44px minimum. Every interaction is thumb-reachable. Never tested on desktop.

## What it is not

- Not a social app. No sharing, no leaderboards, no coach features.
- Not a program builder. It logs what you did — it doesn't tell you what to do.
- Not a nutrition tracker. Workouts only.
- Not cross-device synced. Data is local. CSV export is the backup strategy.

## What "done" looks like

Done means Tim uses it for real workouts and stops thinking about it as a project. The app disappears and the workout data accumulates. Done is not a feature count — it's a habit formed.

## Key constraints

- One HTML file + one service worker (sw.js, for offline at the gym). No build step, no npm at runtime, no server code. The single-file rule's purpose was zero deploy complexity; sw.js preserves that purpose. (Amended 2026-07-16.)
- No external dependencies at runtime — truly, as of 2026-07-16: React 18.3.1 is vendored inline, nothing loads from a CDN. (The June 2026 outage was caused by violating this rule.)
- IndexedDB for all persistence. CSV export for portability.
- Deployed on Vercel. No environment variables, no server-side code.

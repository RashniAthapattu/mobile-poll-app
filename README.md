# Polling

A cross-platform mobile app for creating polls and voting on them, built with **React Native (Expo)**, **TypeScript** and **Supabase**.

Users can create a poll with a question and several options, browse all polls, vote, and change their vote later. It runs on iOS, Android and the web from one codebase.

## Features

- **Create polls** with a question and two or more answer options (add or remove options as you go)
- **Browse and delete polls** in a list that refreshes whenever you return to the screen
- **Vote and change your vote:** your previous choice is loaded and updated, so each user has one vote per poll
- **Accounts with Supabase Auth:** sign up or log in with email and password
- **Anonymous guest sessions:** new visitors are signed in anonymously so they can try the app straight away
- **Persistent sessions** stored with AsyncStorage, with automatic token refresh
- **Protected screens** using Expo Router route groups for `(auth)` and `(protected)` pages
- **Type-safe database access** with TypeScript types generated from the Supabase schema
- **Styled with NativeWind** (Tailwind CSS for React Native)

## Tech stack

| Area       | Tools |
|------------|-------|
| App        | React Native, Expo SDK 54, Expo Router, TypeScript |
| Styling    | NativeWind (Tailwind CSS) |
| Backend    | Supabase (PostgreSQL, Auth) |
| Storage    | AsyncStorage for sessions |

## Project structure

```
src/
  app/
    (auth)/login.tsx        sign in and sign up
    (protected)/profile.tsx profile and sign out
    index.tsx               list of polls
    newPoll.tsx             create a poll
    [id].tsx                poll details and voting
  components/modals/        vote confirmation modal
  lib/supaBase.ts           Supabase client
  providers/AuthProvider.tsx session and auth state
  types/                    generated database types
supabase/config.toml        local Supabase setup
```

## Database

Two tables in Supabase:

| Table   | Columns |
|---------|---------|
| `polls` | `id`, `question`, `options` (text array), `created_at` |
| `votes` | `id`, `poll_id` → `polls.id`, `user_id`, `option`, `created_at` |

## Getting started

### Requirements

- Node.js 18 or newer
- A Supabase project (free tier is fine), with the two tables above and anonymous sign-ins turned on
- The Expo Go app on your phone, or an iOS/Android simulator

### 1. Set up environment variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 2. Install and run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` (iOS), `a` (Android) or `w` (web).

## Author

**Rashni Athapattu**, Full-Stack Software Engineer, Stockholm

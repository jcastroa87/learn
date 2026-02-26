# API Contracts: Kids Learning Platform

**Branch**: `001-kids-learning-platform` | **Date**: 2026-02-26

All endpoints return the standard JSON envelope per Constitution IV:
```json
{ "success": true, "data": {}, "error": null }
{ "success": false, "data": null, "error": "Error message" }
```

All authenticated endpoints require a valid session cookie. Unauthenticated requests return `401`.

## Authentication (Fortify + Sanctum)

### CSRF Token
```
GET /sanctum/csrf-cookie
→ Sets XSRF-TOKEN cookie
```

### Register
```
POST /register
Body: { "email": string, "password": string, "password_confirmation": string }
→ 201: { success: true, data: { id, email } }
→ 422: { success: false, error: "Validation failed", data: { errors: {...} } }
```

### Login
```
POST /login
Body: { "email": string, "password": string }
→ 200: { success: true, data: { id, email } }
→ 422: { success: false, error: "Invalid email or password" }
```

### Logout
```
POST /logout
→ 200: { success: true, data: null }
```

### Email Verification
```
POST /email/verification-notification
→ 200: { success: true, data: { message: "Verification link sent" } }

GET /email/verify/{id}/{hash}
→ 302: Redirect to frontend verification success page
```

### Password Reset
```
POST /forgot-password
Body: { "email": string }
→ 200: { success: true, data: { message: "Reset link sent" } }

POST /reset-password
Body: { "token": string, "email": string, "password": string, "password_confirmation": string }
→ 200: { success: true, data: null }
→ 422: { success: false, error: "Invalid or expired token" }
```

### Current User
```
GET /api/user
→ 200: { success: true, data: { id, email, email_verified_at } }
→ 401: Unauthenticated
```

## Child Profiles

### List Profiles
```
GET /api/children
→ 200: { success: true, data: [ { id, name, age, avatar, language, bananas } ] }
```

### Create Profile
```
POST /api/children
Body: { "name": string, "age": int, "avatar": string, "language": "es"|"ru"|"en" }
→ 201: { success: true, data: { id, name, age, avatar, language, bananas: 0 } }
→ 422: Validation error (max 5 profiles reached, invalid language, etc.)
```

### Update Profile
```
PUT /api/children/{id}
Body: { "name"?: string, "age"?: int, "avatar"?: string, "language"?: "es"|"ru"|"en" }
→ 200: { success: true, data: { id, name, age, avatar, language, bananas } }
→ 403: Not your child profile
→ 404: Profile not found
```

### Delete Profile
```
DELETE /api/children/{id}
→ 200: { success: true, data: null }
→ 403: Not your child profile
```

## Progress

### Get Progress (by module)
```
GET /api/children/{childId}/progress?module={module_type}&page={n}&per_page={n}
→ 200: { success: true, data: [ { item_identifier, status, metadata, updated_at } ], meta: { current_page, total, per_page } }
```

### Get All Progress (summary)
```
GET /api/children/{childId}/progress/summary
→ 200: { success: true, data: {
    bananas: int,
    modules: {
      letter_tracing: { attempted: int, completed: int, total: int },
      number_tracing: { attempted: int, completed: int, total: int },
      ...
    }
  }
}
```

### Record Progress
```
POST /api/children/{childId}/progress
Body: { "module_type": string, "item_identifier": string, "status": "attempted"|"completed", "metadata"?: object, "duration_seconds"?: int }
→ 200: { success: true, data: { item_identifier, status, bananas_awarded: int, new_banana_total: int } }
→ 422: Invalid module_type or status
```

**Note**: `duration_seconds` is the active time (in seconds) the child spent on this item in the current session, tracked by the frontend. Stored in `progress_records.metadata.duration_seconds` (accumulated across sessions). Used by the dashboard to compute `time_spent`.

## Artwork

### List Artwork
```
GET /api/children/{childId}/artworks?page={n}&per_page={n}
→ 200: { success: true, data: [ { id, activity_type, thumbnail_url, created_at } ], meta: { current_page, total, per_page } }
```

### Upload Artwork
```
POST /api/children/{childId}/artworks
Body: FormData { file: Blob (WebP/PNG), activity_type: "coloring"|"free_drawing" }
→ 201: { success: true, data: { id, file_url, bananas_awarded: int, new_banana_total: int } }
→ 422: Invalid file type, size, or file too large
```

### Get Artwork (full size)
```
GET /api/children/{childId}/artworks/{id}
→ 200: { success: true, data: { id, activity_type, file_url, created_at } }
```

### Delete Artwork
```
DELETE /api/children/{childId}/artworks/{id}
→ 200: { success: true, data: null }
```

## Cosmetics Shop

### List All Cosmetics
```
GET /api/cosmetics?category={avatar|sticker|background}&page={n}&per_page={n}
→ 200: { success: true, data: [ { id, slug, category, name_key, preview_url, banana_cost } ], meta: { current_page, total, per_page } }
```

### List Child's Unlocked Cosmetics
```
GET /api/children/{childId}/cosmetics?page={n}&per_page={n}
→ 200: { success: true, data: [ { id, slug, category, name_key, preview_url, unlocked_at } ], meta: { current_page, total, per_page } }
```

### Purchase Cosmetic
```
POST /api/children/{childId}/cosmetics/{cosmeticId}/purchase
→ 200: { success: true, data: { cosmetic_id, new_banana_total: int } }
→ 400: { success: false, error: "Insufficient bananas" }
→ 422: { success: false, error: "Already owned" }
```

## Session Config

### Get Config
```
GET /api/children/{childId}/session-config
→ 200: { success: true, data: { time_limit_minutes: int, sound_enabled: bool } }
```

### Update Config
```
PUT /api/children/{childId}/session-config
Body: { "time_limit_minutes"?: int, "sound_enabled"?: bool }
→ 200: { success: true, data: { time_limit_minutes, sound_enabled } }
```

## Parent Dashboard

### Get Dashboard Stats
```
GET /api/children/{childId}/dashboard
→ 200: { success: true, data: {
    child: { name, age, avatar, language, bananas },
    progress_summary: { ...per module stats },
    recent_activity: [ { module_type, item_identifier, status, created_at } ],
    daily_activity: [ { date: "YYYY-MM-DD", modules: { [module_type]: { count: int, minutes: int } } } ],
    time_spent: { today_minutes: int, week_minutes: int }
  }
}
```

**Note**: `time_spent` is derived from `SUM(metadata->>'duration_seconds')` in progress_records, filtered by date for today/week. `daily_activity` provides the last 7 days of date-grouped activity counts and minutes per module, enabling daily/weekly chart rendering on the frontend.

## Parent Account

### Delete Account
```
DELETE /api/user
→ 200: { success: true, data: null }
```
Cascades soft-delete to all child profiles and associated data (FR-054).

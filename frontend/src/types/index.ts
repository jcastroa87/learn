// API envelope
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    total: number;
    per_page: number;
  };
  error: string | null;
}

// Auth
export interface User {
  id: number;
  email: string;
  email_verified_at: string | null;
}

// Child Profile
export interface ChildProfile {
  id: number;
  name: string;
  age: number;
  avatar: string;
  language: Language;
  bananas: number;
}

export type Language = "es" | "ru" | "en";

// Progress
export type ModuleType =
  | "letter_tracing"
  | "number_tracing"
  | "matching"
  | "coloring"
  | "free_drawing"
  | "memory_cards"
  | "puzzles"
  | "fill_the_gaps"
  | "sorting"
  | "abc_puzzles"
  | "cooking";

export type ProgressStatus = "attempted" | "completed";

export interface ProgressRecord {
  item_identifier: string;
  status: ProgressStatus;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface ProgressSummary {
  bananas: number;
  modules: Record<ModuleType, ModuleProgress>;
}

export interface ModuleProgress {
  attempted: number;
  completed: number;
  total: number;
}

export interface ProgressResult {
  item_identifier: string;
  status: ProgressStatus;
  bananas_awarded: number;
  new_banana_total: number;
}

// Artwork
export interface Artwork {
  id: number;
  activity_type: "coloring" | "free_drawing";
  thumbnail_url?: string;
  file_url?: string;
  created_at: string;
}

export interface ArtworkUploadResult {
  id: number;
  file_url: string;
  bananas_awarded: number;
  new_banana_total: number;
}

// Cosmetics
export type CosmeticCategory = "avatar" | "sticker" | "background";

export interface CosmeticItem {
  id: number;
  slug: string;
  category: CosmeticCategory;
  name_key: string;
  preview_url: string;
  banana_cost: number;
}

export interface UnlockedCosmetic extends CosmeticItem {
  unlocked_at: string;
}

export interface PurchaseResult {
  cosmetic_id: number;
  new_banana_total: number;
}

// Session Config
export interface SessionConfig {
  time_limit_minutes: number;
  sound_enabled: boolean;
}

// Dashboard
export interface DashboardData {
  child: ChildProfile;
  progress_summary: Record<ModuleType, ModuleProgress>;
  recent_activity: RecentActivity[];
  daily_activity: DailyActivity[];
  time_spent: {
    today_minutes: number;
    week_minutes: number;
  };
}

export interface RecentActivity {
  module_type: ModuleType;
  item_identifier: string;
  status: ProgressStatus;
  created_at: string;
}

export interface DailyActivity {
  date: string;
  modules: Record<string, { count: number; minutes: number }>;
}

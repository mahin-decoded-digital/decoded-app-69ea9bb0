export type UserRole = 'Founder' | 'Editor' | 'Contributor' | 'Subscriber';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  compensationModel?: 'salary' | 'retainer' | 'per-article';
  baseRate?: number; // Base rate for per-article or monthly for salary/retainer
}

export type ContentStatus = 'draft' | 'peer-review' | 'editor-review' | 'copyedit' | 'published' | 'flagged';
export type ContentType = 'article' | 'podcast' | 'video' | 'bulletin';

export interface EmojiRating {
  heart: number;
  fire: number;
  mind_blown: number;
  clap: number;
  thinking: number;
  sad: number;
  angry: number;
}

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  type: ContentType;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags: string[];
  coverImageUrl?: string;
  
  // Podcast specific
  audioUrl?: string;
  duration?: number;
  showNotes?: string;
  
  // Video specific
  videoUrl?: string;
  externalPlatform?: 'youtube' | 'facebook' | 'vimeo' | 'none';
  
  // Bulletin specific
  templateId?: string;
  
  // Metrics & Compliance
  reads: number;
  timeOnPage: number; // in seconds
  ratings: EmojiRating;
  complianceChecked: boolean;
  syndicationAllowed: boolean;
}

export interface FlaggedItem {
  id: string;
  contentId: string;
  reason: string;
  status: 'pending' | 'escalated' | 'resolved' | 'dismissed';
  reportedBy?: string;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  authorId: string;
  period: string; // e.g., '2023-10'
  baseAmount: number;
  bonusAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid';
}

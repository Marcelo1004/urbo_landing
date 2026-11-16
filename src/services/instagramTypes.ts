/**
 * URBO — Instagram Types & Contracts
 * Fully compliant with Meta Graph API schema
 */

export interface InstagramPost {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl: string;
  caption: string;
  permalink: string;
  timestamp: string;
  isReel: boolean;
  formattedDate?: string;
  category?: string;
}

export interface InstagramFeedResponse {
  success: boolean;
  authenticated?: boolean;
  source: 'meta_graph_api' | 'pending_authorization' | 'cached_official_feed';
  account: string;
  profileUrl?: string;
  lastUpdated: string;
  expiresInSeconds?: number;
  message?: string;
  requiredPermissions?: string[];
  posts?: InstagramPost[];
  data?: InstagramPost[];
}

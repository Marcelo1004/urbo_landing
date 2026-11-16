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
  source: 'meta_graph_api' | 'cached_official_feed';
  account: string;
  lastUpdated: string;
  expiresInSeconds: number;
  data: InstagramPost[];
}

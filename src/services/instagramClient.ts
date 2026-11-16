/**
 * URBO — Client Instagram Feed Service
 * Consumes GET /api/instagram/feed with strict authenticity compliance:
 * - When authenticated with Meta Graph API, serves live posts with verified permalinks.
 * - When pending token/authorization, reports status transparently without mockups.
 */

import { InstagramPost, InstagramFeedResponse } from './instagramTypes';

export interface FeedResult {
  posts: InstagramPost[];
  authenticated: boolean;
  source: 'meta_graph_api' | 'pending_authorization' | 'offline_fallback';
  lastUpdated: string;
  message?: string;
  account: string;
  profileUrl: string;
}

export async function fetchInstagramFeed(): Promise<FeedResult> {
  const defaultPending: FeedResult = {
    posts: [],
    authenticated: false,
    source: 'pending_authorization',
    lastUpdated: new Date().toISOString(),
    account: '@urbo.corp',
    profileUrl: 'https://www.instagram.com/urbo.corp/',
    message: 'Integración oficial Meta Graph API en espera de INSTAGRAM_ACCESS_TOKEN en el servidor.',
  };

  try {
    const res = await fetch('/api/instagram/feed');
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json: InstagramFeedResponse = await res.json();
    const postsList = json.posts || json.data || [];

    if (json.authenticated && Array.isArray(postsList) && postsList.length > 0) {
      return {
        posts: postsList,
        authenticated: true,
        source: 'meta_graph_api',
        lastUpdated: json.lastUpdated || new Date().toISOString(),
        account: json.account || '@urbo.corp',
        profileUrl: json.profileUrl || 'https://www.instagram.com/urbo.corp/',
      };
    }

    return {
      posts: [],
      authenticated: false,
      source: 'pending_authorization',
      lastUpdated: json.lastUpdated || new Date().toISOString(),
      account: json.account || '@urbo.corp',
      profileUrl: json.profileUrl || 'https://www.instagram.com/urbo.corp/',
      message: json.message || defaultPending.message,
    };
  } catch (err: any) {
    console.warn('[Instagram Client] API request notice:', err.message);
    return defaultPending;
  }
}

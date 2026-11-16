import https from 'https';

// In-memory cache for Instagram posts (15 min TTL)
let cache = {
  data: [],
  timestamp: 0,
  source: 'none',
  authenticated: false,
};

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function fetchFromMetaGraph(token) {
  return new Promise((resolve, reject) => {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}`;

    https.get(url, { headers: { 'User-Agent': 'URBO-Instagram-Service/2.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'Meta API returned error'));
          } else {
            resolve(parsed.data || []);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

export async function getInstagramFeed() {
  const now = Date.now();

  // 1. Return fresh memory cache if within TTL and authenticated
  if (cache.authenticated && cache.data && cache.data.length > 0 && now - cache.timestamp < CACHE_TTL_MS) {
    const remaining = Math.round((CACHE_TTL_MS - (now - cache.timestamp)) / 1000);
    return {
      success: true,
      authenticated: true,
      source: cache.source,
      account: '@urbo.corp',
      profileUrl: 'https://www.instagram.com/urbo.corp/',
      lastUpdated: new Date(cache.timestamp).toISOString(),
      expiresInSeconds: remaining,
      posts: cache.data,
    };
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  // 2. If Meta token is provided in server environment, fetch live from Meta Graph API
  if (token && token.trim() !== '') {
    try {
      console.log('[Instagram Service] Fetching fresh posts from Meta Graph API...');
      const rawPosts = await fetchFromMetaGraph(token.trim());

      const normalized = rawPosts.map((p) => {
        const isReel = p.media_type === 'VIDEO';
        const dateObj = p.timestamp ? new Date(p.timestamp) : new Date();
        const formattedDate = dateObj.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        return {
          id: p.id,
          mediaType: p.media_type || (isReel ? 'VIDEO' : 'IMAGE'),
          isReel,
          category: isReel ? 'REEL OFICIAL' : 'PUBLICACIÓN',
          caption: p.caption || '',
          permalink: p.permalink || 'https://www.instagram.com/urbo.corp/',
          mediaUrl: p.media_url || p.thumbnail_url || '',
          thumbnailUrl: p.thumbnail_url || p.media_url || '',
          timestamp: p.timestamp || new Date().toISOString(),
          formattedDate,
        };
      });

      // Sort descending by timestamp
      normalized.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      cache = {
        data: normalized,
        timestamp: now,
        source: 'meta_graph_api',
        authenticated: true,
      };

      return {
        success: true,
        authenticated: true,
        source: 'meta_graph_api',
        account: '@urbo.corp',
        profileUrl: 'https://www.instagram.com/urbo.corp/',
        lastUpdated: new Date(now).toISOString(),
        expiresInSeconds: Math.round(CACHE_TTL_MS / 1000),
        posts: normalized,
      };
    } catch (err) {
      console.warn('[Instagram Service] Meta Graph API fetch notice:', err.message);
    }
  }

  // 3. Strict Compliance: When credentials are not yet configured on the server,
  // do NOT serve simulated stock photos. Report pending authorization so the UI
  // renders an authentic, sober hub directing users to @urbo.corp.
  return {
    success: true,
    authenticated: false,
    source: 'pending_authorization',
    account: '@urbo.corp',
    profileUrl: 'https://www.instagram.com/urbo.corp/',
    message: 'Integración oficial Meta Graph API en espera de INSTAGRAM_ACCESS_TOKEN en variables de entorno del servidor (Railway/Local).',
    requiredPermissions: [
      'instagram_business_basic',
      'instagram_basic',
      'pages_show_list'
    ],
    lastUpdated: new Date(now).toISOString(),
    posts: [],
  };
}

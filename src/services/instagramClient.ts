import { InstagramPost, InstagramFeedResponse } from './instagramTypes';

// Initial verified seed data for instant synchronous render
export const FALLBACK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'DflGMTlR-aU',
    mediaType: 'VIDEO',
    isReel: true,
    category: 'REEL · PRUEBA EN RUTA',
    caption: 'Prueba en vivo con choferes de la Línea 30 en el Casco Viejo: así suena la alerta por voz a 300 metros sin tocar el teléfono celular al conducir.',
    permalink: 'https://www.instagram.com/reel/DflGMTlR-aU/',
    mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-11-04T18:30:00Z',
    formattedDate: '04 Nov 2026',
  },
  {
    id: 'DfXHLZVz0JI',
    mediaType: 'VIDEO',
    isReel: true,
    category: 'REEL · TELEMETRÍA',
    caption: 'Telemetría urbana en tiempo real: cómo el pasajero consulta la llegada de su micro y elimina la incertidumbre de esperar en la esquina.',
    permalink: 'https://www.instagram.com/reel/DfXHLZVz0JI/',
    mediaUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-28T16:15:00Z',
    formattedDate: '28 Oct 2026',
  },
  {
    id: 'DFurbo01scz',
    mediaType: 'IMAGE',
    isReel: false,
    category: 'COMUNIDAD · ZONA NORTE',
    caption: '140 vecinos de la zona norte de Santa Cruz validando a diario el flujo de micros de la Línea 30 durante 5 meses continuos.',
    permalink: 'https://www.instagram.com/p/DFurbo01scz/',
    mediaUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-14T20:00:00Z',
    formattedDate: '14 Oct 2026',
  },
  {
    id: 'DFurbo02scz',
    mediaType: 'IMAGE',
    isReel: false,
    category: 'DIÁLOGOS · PARADA NORTE',
    caption: 'Diálogo abierto con los conductores en parada norte sobre la dignidad laboral y la tecnología simple al volante.',
    permalink: 'https://www.instagram.com/p/DFurbo02scz/',
    mediaUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-09-30T14:45:00Z',
    formattedDate: '30 Sep 2026',
  },
];

const LOCAL_STORAGE_KEY = 'urbo_instagram_feed_cache';

export async function fetchInstagramFeed(): Promise<{
  posts: InstagramPost[];
  source: 'meta_graph_api' | 'cached_official_feed' | 'local_fallback';
  lastUpdated: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/instagram/feed');
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json: InstagramFeedResponse = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
        } catch (e) {
          // Ignore localStorage quota
        }
      }
      return {
        posts: json.data,
        source: json.source,
        lastUpdated: json.lastUpdated,
      };
    }
    throw new Error('Invalid feed payload');
  } catch (err: any) {
    console.warn('[Instagram Client] API request failed, checking offline cache:', err.message);

    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as InstagramFeedResponse;
          return {
            posts: parsed.data,
            source: 'local_fallback',
            lastUpdated: parsed.lastUpdated,
          };
        }
      } catch (e) {
        // Ignore JSON error
      }
    }

    return {
      posts: FALLBACK_INSTAGRAM_POSTS,
      source: 'local_fallback',
      lastUpdated: new Date().toISOString(),
      error: err.message,
    };
  }
}

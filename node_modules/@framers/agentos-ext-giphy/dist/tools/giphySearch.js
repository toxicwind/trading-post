/**
 * Giphy GIF Search Tool — ITool implementation for Giphy API.
 */
export class GiphySearchTool {
    id = 'giphy-search-v1';
    name = 'giphy_search';
    displayName = 'Giphy GIF Search';
    description = 'Search for animated GIFs and stickers via the Giphy API. ' +
        'Returns GIF URLs that can be embedded in posts using markdown: ![desc](url).';
    category = 'media';
    version = '1.0.0';
    hasSideEffects = false;
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'Search query for GIFs.' },
            limit: { type: 'integer', minimum: 1, maximum: 10, default: 3 },
            rating: { type: 'string', enum: ['g', 'pg', 'pg-13', 'r'], default: 'pg' },
            type: { type: 'string', enum: ['gifs', 'stickers'], default: 'gifs' },
        },
        required: ['query'],
    };
    requiredCapabilities = ['capability:media_search'];
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.GIPHY_API_KEY || '';
    }
    async execute(args, _context) {
        if (!this.apiKey) {
            return { success: false, error: 'GIPHY_API_KEY not configured.' };
        }
        const limit = args.limit || 3;
        const rating = args.rating || 'pg';
        const type = args.type || 'gifs';
        try {
            const params = new URLSearchParams({
                api_key: this.apiKey,
                q: args.query,
                limit: String(limit),
                rating,
            });
            const response = await fetch(`https://api.giphy.com/v1/${type}/search?${params}`);
            if (!response.ok) {
                return { success: false, error: `Giphy API error (${response.status})` };
            }
            const data = await response.json();
            const results = (data.data || []).map((gif) => ({
                id: gif.id,
                title: gif.title || '',
                url: gif.images?.original?.url || gif.url,
                embedUrl: gif.embed_url,
                previewUrl: gif.images?.fixed_width?.url || '',
                width: parseInt(gif.images?.original?.width || '0', 10),
                height: parseInt(gif.images?.original?.height || '0', 10),
            }));
            return {
                success: true,
                output: { query: args.query, results, totalCount: data.pagination?.total_count || results.length },
            };
        }
        catch (err) {
            return { success: false, error: `Giphy search failed: ${err.message}` };
        }
    }
}
//# sourceMappingURL=giphySearch.js.map
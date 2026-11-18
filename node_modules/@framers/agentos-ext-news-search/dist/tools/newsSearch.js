/**
 * News Search Tool — search news articles via NewsAPI.
 */
export class NewsSearchTool {
    id = 'news-search-v1';
    name = 'news_search';
    displayName = 'News Search';
    description = 'Search for recent news articles via NewsAPI. Returns headlines, descriptions, and links.';
    category = 'research';
    version = '1.0.0';
    hasSideEffects = false;
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'News search query.' },
            sortBy: { type: 'string', enum: ['relevancy', 'publishedAt', 'popularity'], default: 'publishedAt' },
            language: { type: 'string', default: 'en' },
            pageSize: { type: 'integer', minimum: 1, maximum: 20, default: 5 },
        },
        required: ['query'],
    };
    requiredCapabilities = ['capability:web_search'];
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.NEWSAPI_API_KEY || '';
    }
    async execute(args, _context) {
        if (!this.apiKey)
            return { success: false, error: 'NEWSAPI_API_KEY not configured.' };
        try {
            const params = new URLSearchParams({
                q: args.query,
                sortBy: args.sortBy || 'publishedAt',
                language: args.language || 'en',
                pageSize: String(args.pageSize || 5),
                apiKey: this.apiKey,
            });
            const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                return { success: false, error: `NewsAPI error (${response.status}): ${err.message || response.statusText}` };
            }
            const data = await response.json();
            const articles = (data.articles || []).map((a) => ({
                title: a.title || '',
                description: a.description || '',
                url: a.url,
                source: a.source?.name || 'Unknown',
                publishedAt: a.publishedAt,
                imageUrl: a.urlToImage,
                author: a.author,
            }));
            return { success: true, output: { query: args.query, articles, totalResults: data.totalResults || articles.length } };
        }
        catch (err) {
            return { success: false, error: `News search failed: ${err.message}` };
        }
    }
}
//# sourceMappingURL=newsSearch.js.map
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiDocs = {
      version: '1.0.0',
      title: 'BookVerse API',
      description: 'Public REST API for BookVerse platform',
      baseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
      endpoints: {
        books: {
          listBooks: {
            method: 'GET',
            path: '/books',
            description: 'List all books with pagination',
            query: { page: 'number', limit: 'number' },
            auth: false,
          },
          getBook: {
            method: 'GET',
            path: '/books/{bookId}',
            description: 'Get book details including reviews',
            params: { bookId: 'string' },
            auth: false,
          },
          purchaseBook: {
            method: 'POST',
            path: '/books/{bookId}/purchase',
            description: 'Purchase a paid book',
            params: { bookId: 'string' },
            auth: true,
          },
        },
        stories: {
          listStories: {
            method: 'GET',
            path: '/stories',
            description: 'List all stories with filters',
            query: { genre: 'string', sort: 'string', page: 'number' },
            auth: false,
          },
          getStory: {
            method: 'GET',
            path: '/stories/{storyId}',
            description: 'Get story details with chapters',
            params: { storyId: 'string' },
            auth: false,
          },
          createStory: {
            method: 'POST',
            path: '/stories',
            description: 'Create new story',
            auth: true,
            body: { title: 'string', description: 'string', genre: 'string' },
          },
          getAnalytics: {
            method: 'GET',
            path: '/stories/{storyId}/analytics-detailed',
            description: 'Get detailed story analytics with drop-off rates',
            params: { storyId: 'string' },
            auth: true,
          },
        },
        authors: {
          getAuthor: {
            method: 'GET',
            path: '/users/{userId}',
            description: 'Get author profile and works',
            params: { userId: 'string' },
            auth: false,
          },
          getAuthorAnalytics: {
            method: 'GET',
            path: '/author/analytics',
            description: 'Get author dashboard analytics',
            auth: true,
          },
        },
        annotations: {
          getAnnotations: {
            method: 'GET',
            path: '/books/{bookId}/annotations',
            description: 'Get user annotations for a book',
            params: { bookId: 'string' },
            auth: true,
          },
          createAnnotation: {
            method: 'POST',
            path: '/books/{bookId}/annotations',
            description: 'Create new annotation (highlight/bookmark/note)',
            params: { bookId: 'string' },
            auth: true,
            body: { type: 'string', pageNumber: 'number', content: 'string' },
          },
        },

      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer {token}',
        description: 'All authenticated endpoints require Firebase ID token',
      },
      rateLimit: '100 requests per minute per API key',
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Server Error',
      },
    };

    return NextResponse.json(apiDocs);
  } catch (error) {
    console.error('Error generating API docs:', error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}

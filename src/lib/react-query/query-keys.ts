export const QUERY_KEYS = {
  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.users.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.users.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.users.details(), id] as const,
    current: () => [...QUERY_KEYS.users.all, 'current'] as const,
    profile: (id: string) => [...QUERY_KEYS.users.details(), id, 'profile'] as const,
    instructors: () => [...QUERY_KEYS.users.all, 'instructors'] as const,
  },

  // Course queries
  courses: {
    all: ['courses'] as const,
    lists: () => [...QUERY_KEYS.courses.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.courses.lists(), { filters }] as const,
    details: () => [...QUERY_KEYS.courses.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.courses.details(), id] as const,
    byInstructor: (instructorId: string) =>
      [...QUERY_KEYS.courses.all, 'instructor', instructorId] as const,
    enrolled: (userId: string) => [...QUERY_KEYS.courses.all, 'enrolled', userId] as const,
    analytics: (id: string) => [...QUERY_KEYS.courses.detail(id), 'analytics'] as const,
    reviews: (id: string) => [...QUERY_KEYS.courses.detail(id), 'reviews'] as const,
    lessons: (id: string) => [...QUERY_KEYS.courses.detail(id), 'lessons'] as const,
    categories: () => [...QUERY_KEYS.courses.all, 'categories'] as const,
    featured: () => [...QUERY_KEYS.courses.all, 'featured'] as const,
  },

  // Cart & Wishlist queries
  cart: {
    all: ['cart'] as const,
    user: (userId: string) => [...QUERY_KEYS.cart.all, userId] as const,
    count: (userId: string) => [...QUERY_KEYS.cart.user(userId), 'count'] as const,
  },

  wishlist: {
    all: ['wishlist'] as const,
    user: (userId: string) => [...QUERY_KEYS.wishlist.all, userId] as const,
    count: (userId: string) => [...QUERY_KEYS.wishlist.user(userId), 'count'] as const,
  },

  // Chat queries
  chat: {
    all: ['chat'] as const,
    conversations: () => [...QUERY_KEYS.chat.all, 'conversations'] as const,
    conversation: (id: string) => [...QUERY_KEYS.chat.conversations(), id] as const,
    messages: (conversationId: string) =>
      [...QUERY_KEYS.chat.conversation(conversationId), 'messages'] as const,
    unreadCount: () => [...QUERY_KEYS.chat.all, 'unreadCount'] as const,
  },

  // Admin queries
  admin: {
    all: ['admin'] as const,
    dashboard: () => [...QUERY_KEYS.admin.all, 'dashboard'] as const,
    analytics: () => [...QUERY_KEYS.admin.all, 'analytics'] as const,
    reports: (type: string, filters?: any) =>
      [...QUERY_KEYS.admin.all, 'reports', type, { filters }] as const,
    users: (filters: any) => [...QUERY_KEYS.admin.all, 'users', { filters }] as const,
  },
} as const;

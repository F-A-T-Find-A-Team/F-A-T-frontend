export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type ProjectStage = 'IDEA' | 'IN_PROGRESS' | 'COMPLETED';

export interface ProjectSummary {
  id: number;
  title: string;
  summary?: string;
  stage: ProjectStage;
  recruitmentStatus: 'OPEN' | 'CLOSED';
  requiredMajors: string[];
  techStacks: string[];
  deadline: string;
  memberCount: number;
  capacity: number;
  viewCount?: number;
  pm?: { id: number; nickname: string };
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  members: Array<{ userId: number; nickname: string; role: 'PM' | 'MEMBER' }>;
  myRelation: {
    isPm: boolean;
    isMember: boolean;
    applicationStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
    canApply: boolean;
    canChangeStage: boolean;
  };
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  name: string;
  studentId: string;
  gender: Gender;
  bio: string;
  majors: string[];
  techStacks: string[];
  avatarUrl?: string;
  projectStats: { inProgress: number; completed: number };
  feedbackStats: { averageRating: number; count: number };
}

export interface ChatRoom {
  id: number;
  type: 'DIRECT' | 'TEAM';
  name: string;
  projectId: number;
  lastMessage: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string | number;
  roomId: number;
  sender: { id: number; nickname: string };
  type: 'TEXT';
  content: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: { id: number; nickname: string; majors: string[] };
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: { code?: string; message?: string };
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '');
const accessTokenKey = 'accessToken';
let refreshRequest: Promise<string | null> | null = null;

export function getAccessToken() {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(accessTokenKey);
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(accessTokenKey, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(accessTokenKey);
}

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${apiBaseUrl}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  });
  return url.toString();
}
async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      try {
        const response = await fetch(buildUrl('/auth/refresh'), {
          method: 'POST',
          credentials: 'include',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const result = await response.json() as ApiEnvelope<{ accessToken: string }>;
        if (!response.ok || !result.success || !result.data?.accessToken) {
          clearAccessToken();
          return null;
        }
        setAccessToken(result.data.accessToken);
        return result.data.accessToken;
      } catch {
        clearAccessToken();
        return null;
      } finally {
        refreshRequest = null;
      }
    })();
  }
  return refreshRequest;
}

async function request<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | number | undefined>;
    auth?: boolean;
    formData?: FormData;
  } = {},
  retry = true,
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' });
  const token = options.auth === false ? null : getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers,
    body,
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401 && retry && options.auth !== false && path !== '/auth/refresh' && path !== '/auth/login') {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) return request<T>(path, options, false);
  }

  if (response.status === 204) return undefined as T;

  let result: ApiEnvelope<T>;
  try {
    result = await response.json() as ApiEnvelope<T>;
  } catch {
    throw new ApiError('서버 응답을 읽을 수 없습니다.', response.status);
  }

  if (!response.ok || result.success === false) {
    throw new ApiError(
      result.error?.message ?? '요청 처리에 실패했습니다.',
      response.status,
      result.error?.code,
    );
  }

  return result.data;
}

export const authApi = {
  sendVerification: (email: string) => request<{ verificationId: string; expiresInSeconds: number; resendAfterSeconds: number }>(
    '/auth/email/send', { method: 'POST', auth: false, body: { email, purpose: 'SIGNUP' } },
  ),
  verifyEmail: (verificationId: string, code: string) => request<{ verified: boolean; signupToken: string }>(
    '/auth/email/verify', { method: 'POST', auth: false, body: { verificationId, code } },
  ),
  signup: (body: {
    signupToken: string;
    email: string;
    password: string;
    nickname: string;
    studentId: string;
    name: string;
    gender: Gender;
    bio: string;
    majors: string[];
    techStacks: string[];
    avatarFileId: string | null;
  }) => request<{ userId: number; email: string; nickname: string; emailVerified: boolean }>(
    '/auth/signup', { method: 'POST', auth: false, body },
  ),
  login: (email: string, password: string) => request<LoginResponse>('/auth/login', { method: 'POST', auth: false, body: { email, password } }),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
};

export const usersApi = {
  me: () => request<UserProfile>('/users/me'),
  updateMe: (body: Pick<UserProfile, 'nickname' | 'gender' | 'bio' | 'majors' | 'techStacks'>) =>
    request<UserProfile>('/users/me', { method: 'PATCH', body }),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ avatarUrl: string }>('/users/me/avatar', { method: 'POST', formData });
  },
  publicProfile: (userId: number) => request<Omit<UserProfile, 'email' | 'studentId'>>(`/users/${userId}`),
  projects: (query: { stage?: ProjectStage; page?: number; size?: number } = {}) =>
    request<{ items: Array<{ id: number; title: string; stage: ProjectStage; role: string; memberCount: number; capacity: number }>; page: number; size: number; totalElements: number; totalPages: number }>(
      '/users/me/projects', { query },
    ),
  applications: (query: { page?: number; size?: number } = {}) =>
    request<{ items: Array<{ id: number; project: { id: number; title: string }; position: string; status: string; createdAt: string }>; page: number; size: number; totalElements: number }>(
      '/users/me/applications', { query },
    ),
  feedback: (query: { page?: number; size?: number } = {}) =>
    request<{ averageRating: number; totalReviews: number; items: Array<{ id: number; reviewer: { id: number; nickname: string }; project: { id: number; title: string }; rating: number; comment: string; createdAt: string }> }>(
      '/users/me/feedback', { query },
    ),
};

export const projectsApi = {
  search: (query: { query?: string; recruitmentStatus?: string; major?: string; techStack?: string; page?: number; size?: number } = {}) =>
    request<{ items: ProjectSummary[]; page: number; size: number; totalElements: number; totalPages: number }>('/projects', { query }),
  recommended: (size = 5) => request<{ items: ProjectSummary[]; recommendationType: string }>('/projects/recommended', { query: { size } }),
  detail: (projectId: number) => request<ProjectDetail>(`/projects/${projectId}`),
  create: (body: { title: string; description: string; requiredMajors: string[]; techStacks: string[]; deadline: string; capacity: number }) =>
    request<ProjectSummary>('/projects', { method: 'POST', body }),
  update: (projectId: number, body: Partial<{ title: string; description: string; requiredMajors: string[]; techStacks: string[]; deadline: string; capacity: number }>) =>
    request<ProjectDetail>(`/projects/${projectId}`, { method: 'PATCH', body }),
  changeStage: (projectId: number, stage: ProjectStage) =>
    request<{ id: number; stage: ProjectStage; completedAt?: string; feedbackRequired?: boolean }>(`/projects/${projectId}/stage`, { method: 'PATCH', body: { stage } }),
  members: (projectId: number) => request<{ items: Array<{ userId: number; nickname: string; role: 'PM' | 'MEMBER'; majors: string[] }>; capacity: number }>(`/projects/${projectId}/members`),
  apply: (projectId: number, position: string, reason: string) =>
    request<{ id: number; projectId: number; position: string; reason: string; status: string; createdAt: string }>(`/projects/${projectId}/applications`, { method: 'POST', body: { position, reason } }),
  applicants: (projectId: number, query: { status?: string; page?: number; size?: number } = {}) =>
    request<{ items: Array<{ id: number; applicant: { id: number; nickname: string }; position: string; reason: string; status: string }>; page?: number; size?: number }>(`/projects/${projectId}/applications`, { query }),
  feedbackStatus: (projectId: number) =>
    request<{ projectId: number; isCompleted: boolean; reviewedUserIds: number[]; pendingUserIds: number[] }>(`/projects/${projectId}/feedback-status`),
  submitFeedback: (projectId: number, reviews: Array<{ revieweeId: number; rating: number; comment: string }>) =>
    request<{ projectId: number; submittedCount: number; submittedAt: string }>(`/projects/${projectId}/feedback`, { method: 'POST', body: { reviews } }),
};

export const applicationsApi = {
  review: (applicationId: number, status: 'ACCEPTED' | 'REJECTED') =>
    request<{ id: number; status: string; projectId: number; memberId?: number; teamRoomId?: number }>(`/applications/${applicationId}`, { method: 'PATCH', body: { status } }),
  cancel: (applicationId: number) => request<void>(`/applications/${applicationId}`, { method: 'DELETE' }),
};

export const chatApi = {
  rooms: () => request<{ items: ChatRoom[] }>('/chat-rooms'),
  startDirect: (projectId: number) => request<{ roomId: number; type: 'DIRECT'; created: boolean }>('/chat-rooms/direct', { method: 'POST', body: { projectId } }),
  messages: (roomId: number, query: { before?: string; size?: number } = {}) =>
    request<{ items: ChatMessage[]; nextCursor: string | null; hasMore: boolean }>(`/chat-rooms/${roomId}/messages`, { query }),
  sendMessage: (roomId: number, content: string, clientMessageId: string) =>
    request<Omit<ChatMessage, 'sender'>>(`/chat-rooms/${roomId}/messages`, { method: 'POST', body: { type: 'TEXT', content, clientMessageId } }),
};

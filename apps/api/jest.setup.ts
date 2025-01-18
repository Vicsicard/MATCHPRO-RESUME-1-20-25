import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock auth middleware
jest.mock('./src/middleware/auth');

// Mock pdf-parse
jest.mock('pdf-parse', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    text: 'Mocked PDF content',
    numpages: 1,
    info: { Title: 'Test PDF' },
  }),
}));

// Mock mammoth
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({
    value: 'Mocked DOCX content',
    messages: [],
  }),
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mockData = {
    applications: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        jobId: '123e4567-e89b-12d3-a456-426614174002',
        resumeId: '123e4567-e89b-12d3-a456-426614174003',
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    profiles: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'Test User',
        title: 'Software Engineer',
        skills: ['JavaScript', 'TypeScript'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    resumes: [
      {
        id: '123e4567-e89b-12d3-a456-426614174003',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Resume',
        content: 'Test content',
        fileUrl: 'test-file-url',
        fileType: 'PDF',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  let insertData: any[] = [];

  return {
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              email: 'test@example.com',
              role: 'user',
            },
          },
          error: null,
        }),
      },
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({
            data: { path: 'test-file-path' },
            error: null,
          }),
          remove: jest.fn().mockResolvedValue({
            data: {},
            error: null,
          }),
        })),
      },
      from: jest.fn((table) => {
        const mockSelect = jest.fn().mockReturnThis();
        const mockInsert = jest.fn().mockImplementation((data: any[]) => {
          const newItem = {
            ...data[0],
            id: `${Date.now()}-${Math.random()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          insertData = [newItem];
          return {
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: newItem, error: null }),
          };
        });
        const mockUpdate = jest.fn().mockImplementation((data: any) => {
          return {
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ 
              data: { ...mockData.applications[0], ...data },
              error: null 
            }),
          };
        });
        const mockDelete = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockOrder = jest.fn().mockReturnThis();

        const mockSingle = jest.fn().mockImplementation(() => {
          if (table === 'resumes') {
            const id = mockEq.mock.calls[0]?.[1];
            const userId = mockEq.mock.calls[1]?.[1];
            const resume = mockData.resumes.find(r => r.id === id && r.userId === userId);
            return Promise.resolve({ data: resume || null, error: null });
          }
          if (table === 'job_applications') {
            const id = mockEq.mock.calls[0]?.[1];
            const userId = mockEq.mock.calls[1]?.[1];
            const application = mockData.applications.find(a => a.id === id && a.userId === userId);
            return Promise.resolve({ data: application || null, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        });

        const mockThen = jest.fn().mockImplementation((callback) => {
          if (table === 'resumes') {
            const userId = mockEq.mock.calls[0]?.[1];
            const resumes = mockData.resumes.filter(r => r.userId === userId);
            return Promise.resolve(callback({ data: resumes, error: null }));
          }
          if (table === 'job_applications') {
            const userId = mockEq.mock.calls[0]?.[1];
            const applications = mockData.applications.filter(a => a.userId === userId);
            return Promise.resolve(callback({ data: applications, error: null }));
          }
          return Promise.resolve(callback({ data: [], error: null }));
        });

        return {
          select: mockSelect,
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
          eq: mockEq,
          order: mockOrder,
          single: mockSingle,
          then: mockThen,
        };
      }),
    })),
  };
});

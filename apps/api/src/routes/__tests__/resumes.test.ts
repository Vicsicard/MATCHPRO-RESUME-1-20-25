import request from 'supertest';
import express from 'express';
import resumesRouter from '../resumes';

const app = express();
app.use(express.json());
app.use('/api/resumes', resumesRouter);

describe('Resume Routes', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'user',
  };

  const mockResume = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    userId: mockUser.id,
    title: 'Test Resume',
    content: 'Test content',
    fileUrl: 'test-file-url',
    fileType: 'PDF',
  };

  beforeEach(() => {
    // Mock authenticate middleware
    app.use((req: any, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /api/resumes', () => {
    it('should return all resumes for the authenticated user', async () => {
      const response = await request(app).get('/api/resumes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/resumes/upload', () => {
    it('should upload a new resume', async () => {
      const response = await request(app)
        .post('/api/resumes/upload')
        .attach('file', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .field('title', 'Test Resume');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Test Resume');
    });

    it('should return 400 if no file is provided', async () => {
      const response = await request(app)
        .post('/api/resumes/upload')
        .field('title', 'Test Resume');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/resumes/:id', () => {
    it('should return a specific resume', async () => {
      const response = await request(app).get(`/api/resumes/${mockResume.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockResume.id);
    });

    it('should return 404 for non-existent resume', async () => {
      const response = await request(app).get('/api/resumes/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/resumes/:id', () => {
    it('should delete a resume', async () => {
      const response = await request(app).delete(`/api/resumes/${mockResume.id}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent resume', async () => {
      const response = await request(app).delete('/api/resumes/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});

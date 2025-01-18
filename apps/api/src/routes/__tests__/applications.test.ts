import request from 'supertest';
import express from 'express';
import applicationsRouter from '../applications';

const app = express();
app.use(express.json());
app.use('/api/applications', applicationsRouter);

describe('Job Applications Routes', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'user',
  };

  const mockApplication = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    userId: mockUser.id,
    jobId: '123e4567-e89b-12d3-a456-426614174002',
    resumeId: '123e4567-e89b-12d3-a456-426614174003',
    coverLetter: 'Test cover letter',
    status: 'SUBMITTED',
  };

  beforeEach(() => {
    // Mock authenticate middleware
    app.use((req: any, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /api/applications', () => {
    it('should return all applications for the authenticated user', async () => {
      const response = await request(app).get('/api/applications');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/applications', () => {
    it('should create a new job application', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          jobId: mockApplication.jobId,
          resumeId: mockApplication.resumeId,
          coverLetter: mockApplication.coverLetter,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'SUBMITTED');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send({
          jobId: mockApplication.jobId,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/applications/:id', () => {
    it('should return a specific application', async () => {
      const response = await request(app)
        .get(`/api/applications/${mockApplication.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockApplication.id);
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .get('/api/applications/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/applications/:id/status', () => {
    it('should update application status', async () => {
      const response = await request(app)
        .patch(`/api/applications/${mockApplication.id}/status`)
        .send({ status: 'ACCEPTED' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ACCEPTED');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/applications/${mockApplication.id}/status`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/applications/:id', () => {
    it('should withdraw an application', async () => {
      const response = await request(app)
        .delete(`/api/applications/${mockApplication.id}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .delete('/api/applications/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});

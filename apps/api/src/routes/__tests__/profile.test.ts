import request from 'supertest';
import express from 'express';
import profileRouter from '../profile';

const app = express();
app.use(express.json());
app.use('/api/profile', profileRouter);

describe('User Profile Routes', () => {
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'user',
  };

  const mockProfile = {
    id: mockUser.id,
    email: mockUser.email,
    fullName: 'Test User',
    title: 'Software Engineer',
    bio: 'Experienced developer',
    skills: ['JavaScript', 'TypeScript', 'React'],
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        startDate: '2020-01',
        endDate: '2023-12',
        description: 'Led development team',
      },
    ],
    education: [
      {
        degree: 'Computer Science',
        school: 'Tech University',
        graduationDate: '2019-05',
        description: 'Focus on software engineering',
      },
    ],
  };

  beforeEach(() => {
    // Mock authenticate middleware
    app.use((req: any, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /api/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app).get('/api/profile');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockUser.id);
      expect(response.body).toHaveProperty('email', mockUser.email);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send(mockProfile);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fullName', mockProfile.fullName);
      expect(response.body).toHaveProperty('title', mockProfile.title);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({
          title: 'Software Engineer',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/profile/experience', () => {
    it('should add new experience', async () => {
      const newExperience = {
        title: 'Lead Developer',
        company: 'New Corp',
        startDate: '2024-01',
        description: 'Leading new projects',
      };

      const response = await request(app)
        .post('/api/profile/experience')
        .send(newExperience);

      expect(response.status).toBe(200);
      expect(response.body.experience).toContainEqual(expect.objectContaining(newExperience));
    });

    it('should return 400 if required experience fields are missing', async () => {
      const response = await request(app)
        .post('/api/profile/experience')
        .send({
          title: 'Lead Developer',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/profile/education', () => {
    it('should add new education', async () => {
      const newEducation = {
        degree: 'Master of Science',
        school: 'Tech Institute',
        graduationDate: '2023-12',
        description: 'Advanced computing',
      };

      const response = await request(app)
        .post('/api/profile/education')
        .send(newEducation);

      expect(response.status).toBe(200);
      expect(response.body.education).toContainEqual(expect.objectContaining(newEducation));
    });

    it('should return 400 if required education fields are missing', async () => {
      const response = await request(app)
        .post('/api/profile/education')
        .send({
          degree: 'Master of Science',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/profile/skills', () => {
    it('should update skills', async () => {
      const newSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js'];

      const response = await request(app)
        .put('/api/profile/skills')
        .send({ skills: newSkills });

      expect(response.status).toBe(200);
      expect(response.body.skills).toEqual(expect.arrayContaining(newSkills));
    });

    it('should return 400 if skills is not an array', async () => {
      const response = await request(app)
        .put('/api/profile/skills')
        .send({ skills: 'JavaScript' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});

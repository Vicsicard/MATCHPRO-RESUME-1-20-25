import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MatchPro API',
      version: '1.0.0',
      description: 'API documentation for MatchPro - Resume and Job Application Platform',
      license: {
        name: 'Private',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Auth: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            fileUrl: { type: 'string', format: 'uri' },
            fileType: { type: 'string', enum: ['PDF', 'DOCX'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        JobApplication: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            jobId: { type: 'string', format: 'uuid' },
            resumeId: { type: 'string', format: 'uuid' },
            coverLetter: { type: 'string' },
            status: {
              type: 'string',
              enum: ['DRAFT', 'SUBMITTED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Resumes',
        description: 'Resume management endpoints',
      },
      {
        name: 'Applications',
        description: 'Job application management endpoints',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

const request = require('supertest');
const app = require('../server');
const Document = require('../models/Document');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Document API', () => {
  beforeAll(async () => {
    const db = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let token;

  beforeEach(async () => {
    const admin = await User.findOne({ email: 'admin@example.com' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: admin.email, password: 'password' });
    token = res.body.token;
  });

  it('should create a new document', async () => {
    const res = await request(app)
      .post('/documents/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Document')
      .field('description', 'This is a test document')
      .attach('file', 'path/to/file.pdf');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Document');
  });

  it('should get all documents', async () => {
    const res = await request(app)
      .get('/documents')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('documents');
    expect(res.body.documents.length).toBeGreaterThan(0);
  });
});

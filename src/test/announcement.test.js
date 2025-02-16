const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Announcement = require('../models/Announcement');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Announcements API', () => {
  it('should return a test response', async () => {
    const res = await request(app).get('/api/announcements/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hi, this is announcement');
  });

  it('should create a new announcement', async () => {
    const res = await request(app)
      .post('/api/announcements')
      .send({
        school_id: new mongoose.Types.ObjectId(),
        announcement: 'This is a test announcement',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('announcement_id');
    expect(res.body).toHaveProperty('announcement', 'This is a test announcement');
  });

  it('should fetch all announcements', async () => {
    const res = await request(app).get('/api/announcements');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a specific announcement by ID', async () => {
    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .send({
        school_id: new mongoose.Types.ObjectId(),
        announcement: 'Another test announcement',
      });

    const announcementId = newAnnouncement.body.announcement_id;

    const res = await request(app).get(`/api/announcements/${announcementId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('announcement_id', announcementId);
  });

  it('should update an existing announcement', async () => {
    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .send({
        school_id: new mongoose.Types.ObjectId(),
        announcement: 'To be updated',
      });

    const announcementId = newAnnouncement.body.announcement_id;

    const res = await request(app)
      .put(`/api/announcements/${announcementId}`)
      .send({ announcement: 'Updated announcement' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('announcement', 'Updated announcement');
  });

  it('should delete an announcement', async () => {
    const newAnnouncement = await request(app)
      .post('/api/announcements')
      .send({
        school_id: new mongoose.Types.ObjectId(),
        announcement: 'To be deleted',
      });

    const announcementId = newAnnouncement.body.announcement_id;

    const res = await request(app).delete(`/api/announcements/${announcementId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Announcement deleted successfully');
  });
});

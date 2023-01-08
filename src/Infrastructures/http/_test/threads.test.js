const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const LoginTestHelper = require('../../../../tests/LoginTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

/* eslint-disable no-undef */
describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        title: 'new title',
        body: 'new body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
    });

    it('should response 401 when no access token is provided', async () => {
      // Assert
      const server = await createServer(container);
      const requestPayload = {
        title: 'new title',
        body: 'new body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        title: 'new title',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan title, body, dan owner');
    });

    it('should response 400 when payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        title: 'new title',
        body: 1,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and and get thread detail with comments', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'Jhon' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'Jene' });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-1' });

      await CommentsTableTestHelper.addComment({ id: 'comment-1', owner: 'user-1', threadId });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', owner: 'user-2', threadId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should response 200 and and get thread detail with not comments', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'Jhon' });

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-1' });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should response 404 if thread does not exists', async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = 'thread-123';

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});

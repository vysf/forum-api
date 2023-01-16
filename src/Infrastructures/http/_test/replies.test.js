/* eslint-disable no-undef */
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const LoginTestHelper = require('../../../../tests/LoginTestHelper');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when post /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 200 and persisted replay', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        content: 'sebuah replay',
      };

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReplay).toBeDefined();
      expect(responseJson.data.addedReplay.content).toBeDefined();
      expect(responseJson.data.addedReplay.owner).toBeDefined();
      expect(responseJson.data.addedReplay.id).toBeDefined();
    });

    it('should response 400 when replay payload not containe needed property', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {};

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when replay payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        content: 1,
      };

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});

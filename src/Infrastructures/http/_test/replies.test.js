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
    it('should response 200 and persisted reply', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        content: 'sebuah reply',
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
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });
      const requestPayload = {
        content: 'sebuah reply',
      };

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 400 when reply payload not containe needed property', async () => {
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

    it('should response 400 when reply payload not meet data type specification', async () => {
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

  describe('when post /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await LoginTestHelper.getAccessToken({ server });

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const replyId = 'reply-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, threadId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when not reply owner', async () => {
      // Arrange
      const server = await createServer(container);

      const {
        userId: jhonId,
      } = await LoginTestHelper.getAccessToken({ server, username: 'Jhon' });

      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const replyId = 'reply-1';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: jhonId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: jhonId, threadId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: jhonId });

      const {
        accessToken: jeneToken,
      } = await LoginTestHelper.getAccessToken({ server, username: 'Jene' });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${jeneToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});

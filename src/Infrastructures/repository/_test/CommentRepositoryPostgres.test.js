/* eslint-disable no-undef */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

beforeAll(async () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
  await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
});

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => 'Sat Dec 24 2022 14:38:54 GMT+0700 (Indochina Time)';
      }

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(addedComment.id);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
      expect(comment).toBeDefined();
    });
  });

  describe('getCommentByThareadId funtion', () => {
    it('should get all comments from a thread', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // buat komentar
      const firstComment = {
        id: 'comment-1',
        date: '10-10-2021',
        content: 'comment 1',
      };

      const secondComment = {
        id: 'comment-2',
        date: '11-10-2021',
        content: 'comment 2',
      };

      const expectedComments = [
        { ...firstComment, username: 'dicoding' },
        { ...secondComment, username: 'dicoding', content: '**komentar telah dihapus**' },
      ];
      secondComment.isDelete = true;
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThareadId('thread-123');
      expect(comments).toEqual(expectedComments);
    });
  });

  describe('checkCommentIsExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentIsExist('thread-123', 'comment-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentIsExist(threadId, commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should throw AuthorizationError when access denied', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      // const owner = 'user-xxx';
      // const commentId = 'comment-123';

      // await CommentsTableTestHelper.addComment({ id: commentId, owner: 'user-123' });
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess(commentId, 'user-xxx'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when access accepted', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      // const owner = 'user-123';
      // const commentId = 'comment-123';

      // await CommentsTableTestHelper.addComment({ id: commentId, owner });

      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess(commentId, userId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment that want to delete is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should be able to delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
      // const commentId = 'comment-123';

      // await CommentsTableTestHelper.addComment({ id: commentId });

      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId });

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.getCommentById(commentId);

      // Assert
      expect(comment[0].is_delete).toEqual(true);
    });
  });
});

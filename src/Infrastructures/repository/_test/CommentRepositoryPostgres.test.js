/* eslint-disable no-undef */
const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  describe('behavior testing', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
    });

    afterEach(async () => {
      await CommentsTableHelper.cleanTable();
    });

    afterAll(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await CommentsTableHelper.cleanTable();
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
        const comment = await CommentsTableHelper.getCommentById(addedComment.id);

        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        }));
        expect(comment).toBeDefined();
      });
    });
  });
});

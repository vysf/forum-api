/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

// masih error di before all
describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    const userId = 'user-1';
    const threadId = 'thread-1';
    await UsersTableTestHelper.addUser({ id: userId, username: 'Jhon' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    // await CommentsTableTestHelper.addComment({ id: 'comment-321', threadId, owner: userId });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add new reply and return added reply correctly', async () => {
      // Arrange
      const userId = 'user-2';
      const threadId = 'thread-1';
      await UsersTableTestHelper.addUser({ id: userId, username: 'Jene' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', content: 'balasan thread 1', threadId, owner: userId,
      });

      const newReply = new NewReply({
        content: 'balasan baru nih',
        owner: 'user-1',
        commentId: 'comment-1',
      });

      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => 'Sat Dec 24 2022 14:38:54 GMT+0700 (Indochina Time)';
      }

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.getReplyById(addedReply.id);

      expect(reply).toBeDefined();
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: newReply.owner,
      }));
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should get all replies from a comment', async () => {
      // Arrange
      const userId = 'user-2';
      const threadId = 'thread-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', content: 'balasan thread 1', threadId, owner: userId,
      });

      const firstReply = {
        id: 'reply-1',
        date: '10-10-2021',
        content: 'reply 1',
      };

      const secondReply = {
        id: 'reply-2',
        date: '11-10-2021',
        content: 'reply 2',
      };

      const expectedReplies = [
        { ...firstReply, username: 'Jhon' },
        { ...secondReply, username: 'Jene', content: '**balasan telah dihapus**' },
      ];
      secondReply.isDelete = true;
      await RepliesTableTestHelper.addReply({ ...secondReply, owner: userId, commentId: 'comment-1' });
      await RepliesTableTestHelper.addReply({ ...firstReply, owner: 'user-1', commentId: 'comment-1' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-1');
      expect(replies).toEqual(expectedReplies);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should get all replies in the thread', async () => {
      // Arrange
      // await UsersTableTestHelper.addUser({ id: 'user-2', username: 'Jene' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-2' });

      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-1', owner: 'user-2' });

      const firstReply = {
        id: 'reply-1',
        date: '10-10-2021',
        content: 'reply pada komen 1',
        commentId: 'comment-1',
      };

      const secondReply = {
        id: 'reply-2',
        date: '11-10-2021',
        content: 'reply pada komen 2',
        commentId: 'comment-2',
      };

      const expectedReplies = [
        { ...firstReply, username: 'Jhon' },
        { ...secondReply, username: 'Jene', content: '**balasan telah dihapus**' },
      ];
      secondReply.isDelete = true;
      await RepliesTableTestHelper.addReply({ ...secondReply, owner: 'user-2' });
      await RepliesTableTestHelper.addReply({ ...firstReply, owner: 'user-1' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId('thread-1');
      expect(replies).toEqual(expectedReplies);
    });
  });

  describe('checkReplyIsExist function', () => {
    it('should throw NotFoundError when reply is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.checkReplyIsExist('comment-1', 'reply-1'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply is exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // const user = await UsersTableTestHelper.findUsersById('user-1');
      // console.log(user);

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      // Action and Assert
      await expect(replyRepositoryPostgres.checkReplyIsExist(threadId, commentId, replyId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyAccess function', () => {
    it('should throw AuthorizationError when access denied', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyAccess(replyId, 'user-xxx'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when access accepted', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyReplyAccess(replyId, userId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply that want to delete is not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(replyRepositoryPostgres.deleteReplyById('reply-xxx'))
        .rejects.toThrow(NotFoundError);
    });

    it('should be able to delete reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replyId, commentId, owner: userId });

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);
      const reply = await RepliesTableTestHelper.getReplyById(replyId);

      // Assert
      expect(reply[0].is_delete).toEqual(true);
    });
  });
});

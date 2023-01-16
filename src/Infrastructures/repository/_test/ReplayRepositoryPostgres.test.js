/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReplay = require('../../../Domains/replies/entities/NewReplay');
const AddedReplay = require('../../../Domains/replies/entities/AddedReplay');
const ReplayRepositoryPostgres = require('../ReplayRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

// masih error di before all
describe('ReplayRepositoryPostgres', () => {
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

  describe('addReplay function', () => {
    it('should add new replay and return added replay correctly', async () => {
      // Arrange
      const userId = 'user-2';
      const threadId = 'thread-1';
      await UsersTableTestHelper.addUser({ id: userId, username: 'Jene' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', content: 'balasan thread 1', threadId, owner: userId,
      });

      const newReplay = new NewReplay({
        content: 'balasan baru nih',
        owner: 'user-1',
        commentId: 'comment-1',
      });

      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => 'Sat Dec 24 2022 14:38:54 GMT+0700 (Indochina Time)';
      }

      const replayRepositoryPostgres = new ReplayRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedReplay = await replayRepositoryPostgres.addReplay(newReplay);

      // Assert
      const replay = await RepliesTableTestHelper.getReplyById(addedReplay.id);

      expect(replay).toBeDefined();
      expect(addedReplay).toStrictEqual(new AddedReplay({
        id: 'replay-123',
        content: newReplay.content,
        owner: newReplay.owner,
      }));
    });
  });

  describe('getReplayByCommentId function', () => {
    it('should get all replies from a comment', async () => {
      // Arrange
      const userId = 'user-2';
      const threadId = 'thread-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', content: 'balasan thread 1', threadId, owner: userId,
      });

      const firstReplay = {
        id: 'replay-1',
        date: '10-10-2021',
        content: 'replay 1',
      };

      const secondReplay = {
        id: 'replay-2',
        date: '11-10-2021',
        content: 'replay 2',
      };

      const expectedReplies = [
        { ...firstReplay, username: 'Jhon' },
        { ...secondReplay, username: 'Jene', content: '**balasan telah dihapus**' },
      ];
      secondReplay.isDelete = true;
      await RepliesTableTestHelper.addReply({ ...secondReplay, owner: userId, commentId: 'comment-1' });
      await RepliesTableTestHelper.addReply({ ...firstReplay, owner: 'user-1', commentId: 'comment-1' });

      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      // Action
      const replies = await replayRepositoryPostgres.getReplayByCommentId('comment-1');
      expect(replies).toEqual(expectedReplies);
    });
  });

  describe('checkReplayIsExist function', () => {
    it('should throw NotFoundError when replay is not exist', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(replayRepositoryPostgres.checkReplayIsExist('comment-1', 'replay-1'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when replay is exist', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      // const user = await UsersTableTestHelper.findUsersById('user-1');
      // console.log(user);

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replayId = 'replay-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replayId, commentId, owner: userId });

      // Action and Assert
      await expect(replayRepositoryPostgres.checkReplayIsExist(threadId, commentId, replayId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplayAccess function', () => {
    it('should throw AuthorizationError when access denied', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replayId = 'replay-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replayId, commentId, owner: userId });

      // Action and Assert
      await expect(replayRepositoryPostgres.verifyReplayAccess(replayId, 'user-xxx'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when access accepted', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replayId = 'replay-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replayId, commentId, owner: userId });

      // Action and Assert
      await expect(replayRepositoryPostgres.verifyReplayAccess(replayId, userId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplayById function', () => {
    it('should throw NotFoundError when replay that want to delete is not exist', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(replayRepositoryPostgres.deleteReplayById('replay-xxx'))
        .rejects.toThrow(NotFoundError);
    });

    it('should be able to delete replay', async () => {
      // Arrange
      const replayRepositoryPostgres = new ReplayRepositoryPostgres(pool, {}, {});

      const userId = 'user-1';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replayId = 'replay-1';
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
      await RepliesTableTestHelper.addReply({ id: replayId, commentId, owner: userId });

      // Action
      await replayRepositoryPostgres.deleteReplayById(replayId);
      const replay = await RepliesTableTestHelper.getReplyById(replayId);

      // Assert
      expect(replay[0].is_delete).toEqual(true);
    });
  });
});

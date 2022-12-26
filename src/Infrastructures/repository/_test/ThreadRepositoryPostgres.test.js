const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

/* eslint-disable no-undef */
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        fullname: 'Dicoding Indonesia',
        password: 'secret',
        username: 'dicoding',
      });

      const newThread = new NewThread({
        title: 'new title',
        body: 'new lorem ipsum',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      function fakeDateGenerator() {
        this.toISOString = () => 'Sat Dec 24 2022 14:38:54 GMT+0700 (Indochina Time)';
      }
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'new title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const newThread = {
        id: 'thread-123',
        title: 'new title',
        body: 'lorem ipsum',
        owner: 'user-123',
        date: 'today',
      };

      const expectedThread = {
        id: 'thread-123',
        title: 'new title',
        body: 'lorem ipsum',
        date: 'today',
        username: 'dicoding',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});
      await ThreadsTableTestHelper.addThread(newThread);

      // Action
      const getThread = await threadRepositoryPostgres.getThreadById(expectedThread.id);

      // Assert
      expect(getThread).toStrictEqual(expectedThread);
    });

    it('should return NotFoundError when thread is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const newThread = {
        id: 'thread-123',
        title: 'new title',
        body: 'lorem ipsum',
        owner: 'user-123',
        date: 'today',
      };

      await ThreadsTableTestHelper.addThread(newThread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-xyz'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});

/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    // 1. dapatkan thread by id (request.params)
    // 2. dapatkan comment by thread id
    const useCaseParams = {
      threadId: 'thread-1234',
    };

    const expectedDetaiThread = new DetailThread({
      id: 'user-123',
      title: 'dicoding',
      body: 'some text',
      date: 'senin',
      username: 'Dicoding Indonesia',
      comments: [],
    });

    const expectedCommentDetail = [
      new DetailComment({
        id: 'user-1234',
        username: 'dicoding1',
        date: '2021',
        content: 'content1',
      }),
      new DetailComment({
        id: 'user-1235',
        username: 'dicoding2',
        date: '2021',
        content: 'content2',
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetaiThread));
    mockCommentRepository.getCommentByThareadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentDetail));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toEqual(new DetailThread({
      ...expectedDetaiThread, comments: expectedCommentDetail,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThareadId).toBeCalledWith(useCaseParams.threadId);
  });
});

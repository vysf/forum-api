/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplayRepository = require('../../../Domains/replies/ReplayRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReplay = require('../../../Domains/replies/entities/DetailReplay');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    // 1. dapatkan thread by id (request.params)
    // 2. dapatkan comment by thread id
    const useCaseParams = {
      threadId: 'thread-1234',
    };

    const expectedDetaiThread = new DetailThread({
      id: 'thread-1234',
      title: 'dicoding',
      body: 'some text',
      date: 'senin',
      username: 'Dicoding Indonesia',
      comments: [],
    });

    const expectedCommentsDetail = [
      new DetailComment({
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: 'content1',
        replies: [],
      }),
      new DetailComment({
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'content2',
        replies: [],
      }),
    ];

    const expectedRepliesDetail = [
      new DetailReplay({
        id: 'replay-1',
        commentId: 'comment-1',
        username: 'Jhon',
        content: 'balasan komen 1',
        date: '2022',
      }),
      new DetailReplay({
        id: 'replay-2',
        commentId: 'comment-2',
        username: 'Jhon',
        content: 'balasan komen 2',
        date: '2022',
      }),
    ];

    const { commentId: commentIdReplay1, ...filteredReplayDetails1 } = expectedRepliesDetail[0];
    const { commentId: commentIdReplay2, ...filteredReplayDetails2 } = expectedRepliesDetail[1];

    const expectedCommentsAndReplies = [
      { ...expectedCommentsDetail[0], replies: [filteredReplayDetails1] },
      { ...expectedCommentsDetail[1], replies: [filteredReplayDetails2] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplayRepository = new ReplayRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetaiThread));
    mockCommentRepository.getCommentByThareadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCommentsDetail));
    mockReplayRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedRepliesDetail));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replayRepository: mockReplayRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toEqual(new DetailThread({
      ...expectedDetaiThread, comments: expectedCommentsAndReplies,
    }));
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThareadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplayRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
  });
});

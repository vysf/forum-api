/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    // 1. dapatkan thread by id (request.params)
    // 2. dapatkan comment by thread id
    const useCaseParams = {
      threadId: 'thread-1234',
    };

    const expectedDetailThread = new DetailThread({
      id: 'thread-1234',
      title: 'dicoding',
      body: 'some text',
      date: 'senin',
      username: 'Dicoding Indonesia',
      comments: [],
    });

    const commentsDetail = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
        isDelete: true,
        replies: [],
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
        isDelete: false,
        replies: [],
      },
    ];

    const expectedRepliesDetail = [
      new DetailReply({
        id: 'reply-1',
        commentId: 'comment-1',
        username: 'Jhon',
        content: 'balasan komen 1',
        date: '2022',
      }),
      new DetailReply({
        id: 'reply-2',
        commentId: 'comment-2',
        username: 'Jhon',
        content: 'balasan komen 2',
        date: '2022',
      }),
    ];

    const { commentId: commentIdReply1, ...filteredReplyDetails1 } = expectedRepliesDetail[0];
    const { commentId: commentIdReply2, ...filteredReplyDetails2 } = expectedRepliesDetail[1];

    // const expectedCommentsAndReplies = [
    //   { ...expectedCommentsDetail[0], replies: [filteredReplyDetails1] },
    //   { ...expectedCommentsDetail[1], replies: [filteredReplyDetails2] },
    // ];

    const expectedCommentsAndReplies = [
      new DetailComment({ ...commentsDetail[0], replies: [filteredReplyDetails1] }),
      new DetailComment({ ...commentsDetail[1], replies: [filteredReplyDetails2] }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new DetailThread({
          id: 'thread-1234',
          title: 'dicoding',
          body: 'some text',
          date: 'senin',
          username: 'Dicoding Indonesia',
          comments: [],
        }),
      ));
    mockCommentRepository.getCommentByThareadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          new DetailComment(commentsDetail[0]),
          new DetailComment(commentsDetail[1]),
        ],
      ));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [
          new DetailReply({
            id: 'reply-1',
            commentId: 'comment-1',
            username: 'Jhon',
            content: 'balasan komen 1',
            date: '2022',
          }),
          new DetailReply({
            id: 'reply-2',
            commentId: 'comment-2',
            username: 'Jhon',
            content: 'balasan komen 2',
            date: '2022',
          }),
        ],
      ));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsAndReplies,
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThareadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
  });
});

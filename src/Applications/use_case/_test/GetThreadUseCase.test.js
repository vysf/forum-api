/* eslint-disable no-undef */
const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
// const DetailComment = require('../../../Domains/comments/entities/DetailComment');
// const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    // 1. dapatkan thread by id (request.params)
    // 2. dapatkan comment by thread id
    const useCaseParams = {
      threadId: 'thread-1234',
    };

    const expectedThread = new DetailThread(
      {
        id: 'thread-1234',
        title: 'dicoding',
        body: 'some text',
        date: 'senin',
        username: 'Dicoding Indonesia',
        comments: [
          {
            id: 'comment-1',
            username: 'dicoding1',
            date: '2021',
            content: '**komentar telah dihapus**',
            replies: [
              {
                id: 'reply-1',
                username: 'Jhon',
                content: 'balasan komen 1',
                date: '2022',
              },
            ],
          },
          {
            id: 'comment-2',
            username: 'dicoding2',
            date: '2021',
            content: 'wowowowowowo',
            replies: [
              {
                id: 'reply-2',
                username: 'Jhon',
                content: '**balasan telah dihapus**',
                date: '2022',
              },
            ],
          },
        ],
      },
    );

    const threadDetail = {
      id: 'thread-1234',
      title: 'dicoding',
      body: 'some text',
      date: 'senin',
      username: 'Dicoding Indonesia',
    };

    const commentsDetail = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: 'test',
        isDelete: true,
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
        isDelete: false,
      },
    ];

    const repliesDetail = [
      {
        id: 'reply-1',
        commentId: 'comment-1',
        username: 'Jhon',
        content: 'balasan komen 1',
        date: '2022',
        isDelete: false,
      },
      {
        id: 'reply-2',
        commentId: 'comment-2',
        username: 'Jhon',
        content: 'balasan komen 2',
        date: '2022',
        isDelete: true,
      },
    ];

    const filteredDeleteComments = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
      },
    ];

    const commentsAndRepliesPairs = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
        replies: [
          {
            id: 'reply-1',
            username: 'Jhon',
            content: 'balasan komen 1',
            date: '2022',
          },
        ],
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
        replies: [
          {
            id: 'reply-2',
            username: 'Jhon',
            content: '**balasan telah dihapus**',
            date: '2022',
          },
        ],
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(threadDetail));
    mockCommentRepository.getCommentByThareadId = jest.fn()
      .mockImplementation(() => Promise.resolve(commentsDetail));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(repliesDetail));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    getThreadUseCase._checkCommentsIsDeleted = jest.fn()
      .mockImplementation(() => filteredDeleteComments);

    getThreadUseCase._getRepliesForComments = jest.fn()
      .mockImplementation(() => commentsAndRepliesPairs);

    // Action
    const detailThread = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(detailThread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.getCommentByThareadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(getThreadUseCase._checkCommentsIsDeleted).toBeCalledWith(commentsDetail);
    expect(getThreadUseCase._getRepliesForComments)
      .toBeCalledWith(filteredDeleteComments, repliesDetail);
  });

  it('it should run _checkCommentsIsDeleted function properly', () => {
    // Arrange
    const commentsDetail = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: 'test',
        isDelete: true,
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
        isDelete: false,
      },
    ];

    const filteredDeleteComments = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
      },
    ];

    const getThreadUseCase = new GetThreadUseCase({}, {}, {});
    const spyCheckCommentsIsDeleted = jest.spyOn(getThreadUseCase, '_checkCommentsIsDeleted');

    // Action
    getThreadUseCase._checkCommentsIsDeleted(commentsDetail);

    // Assert
    expect(spyCheckCommentsIsDeleted).toReturnWith(filteredDeleteComments);
    spyCheckCommentsIsDeleted.mockClear();
  });

  it('it should run _checkCommentsIsDeleted function properly', () => {
    // Arrange
    const commentsAndRepliesPairs = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
        replies: [
          {
            id: 'reply-1',
            username: 'Jhon',
            content: 'balasan komen 1',
            date: '2022',
          },
        ],
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
        replies: [
          {
            id: 'reply-2',
            username: 'Jhon',
            content: '**balasan telah dihapus**',
            date: '2022',
          },
        ],
      },
    ];

    const filteredDeleteComments = [
      {
        id: 'comment-1',
        username: 'dicoding1',
        date: '2021',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-2',
        username: 'dicoding2',
        date: '2021',
        content: 'wowowowowowo',
      },
    ];

    const repliesDetail = [
      {
        id: 'reply-1',
        commentId: 'comment-1',
        username: 'Jhon',
        content: 'balasan komen 1',
        date: '2022',
        isDelete: false,
      },
      {
        id: 'reply-2',
        commentId: 'comment-2',
        username: 'Jhon',
        content: 'balasan komen 2',
        date: '2022',
        isDelete: true,
      },
    ];

    const getThreadUseCase = new GetThreadUseCase({}, {}, {});
    const spyGetRepliesForComments = jest.spyOn(getThreadUseCase, '_getRepliesForComments');

    // Action
    getThreadUseCase._getRepliesForComments(filteredDeleteComments, repliesDetail);

    // Assert
    expect(spyGetRepliesForComments).toReturnWith(commentsAndRepliesPairs);
    spyGetRepliesForComments.mockClear();
  });
});

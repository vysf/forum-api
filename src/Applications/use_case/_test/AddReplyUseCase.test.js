/* eslint-disable no-undef */
const AddReplyUseCase = require('../AddReplyUseCase');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Action
    const useCasePayload = {
      content: 'some comment',
    };

    // dari request.auth.credentials / id from accessToken
    useCasePayload.owner = 'user-123 coyyy';

    const useCaseParam = {
      commentId: 'comment-123456',
      threadId: 'thread-123456',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'some comment',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParam);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123456');
    expect(mockCommentRepository.getCommentById).toBeCalledWith('comment-123456');
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCaseParam.commentId,
    }));
  });
});

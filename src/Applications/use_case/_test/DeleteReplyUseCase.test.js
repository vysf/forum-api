/* eslint-disable no-undef */
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const useCasePayload = {
      owner: 'user-1',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkReplyIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload, useCaseParam);

    // Assert
    expect(mockReplyRepository.checkReplyIsExist)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId, useCaseParam.replyId);
    expect(mockReplyRepository.verifyReplyAccess)
      .toBeCalledWith(useCaseParam.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParam.replyId);
  });
});

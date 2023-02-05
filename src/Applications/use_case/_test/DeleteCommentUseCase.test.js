/* eslint-disable no-undef */
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // owner didapat dari request.auth.credentials pada handler
    const useCasePayload = {
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload, useCaseParam);

    // Assert
    expect(mockCommentRepository.checkCommentIsExist)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId);
    expect(mockCommentRepository.verifyCommentAccess)
      .toBeCalledWith(useCaseParam.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCaseParam.commentId);
  });
});

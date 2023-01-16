/* eslint-disable no-undef */
const ReplayRepository = require('../../../Domains/replies/ReplayRepository');
const DeleteReplayUseCase = require('../DeleteReplayUseCase');

describe('DeleteReplayUseCase', () => {
  it('should orchestrating the delete replay action correctly', async () => {
    // Arrange
    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replayId: 'replay-123',
    };

    const useCasePayload = {
      owner: 'user-1',
    };

    const mockReplayRepository = new ReplayRepository();

    mockReplayRepository.checkReplayIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplayRepository.verifyReplayAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplayRepository.deleteReplayById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplayUseCase = new DeleteReplayUseCase({
      replayRepository: mockReplayRepository,
    });

    // Action
    await deleteReplayUseCase.execute(useCasePayload, useCaseParam);

    // Assert
    expect(mockReplayRepository.checkReplayIsExist)
      .toBeCalledWith(useCaseParam.threadId, useCaseParam.commentId, useCaseParam.replayId);
    expect(mockReplayRepository.verifyReplayAccess)
      .toBeCalledWith(useCaseParam.replayId, useCasePayload.owner);
    expect(mockReplayRepository.deleteReplayById).toBeCalledWith(useCaseParam.replayId);
  });
});

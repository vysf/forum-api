/* eslint-disable no-undef */
const ReplayRepository = require('../ReplayRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const replayRepository = new ReplayRepository();

    // Action and Assert
    await expect(() => replayRepository.addReplay({})).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replayRepository.getReplayByCommentId('')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replayRepository.checkReplayIsExist('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replayRepository.verifyReplayAccess('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replayRepository.deleteReplayById('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

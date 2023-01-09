/* eslint-disable no-undef */
const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(() => replyRepository.addReplay({})).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.getReplayByCommentId('')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.checkReplayIsExist('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.verifyReplayAccess('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(() => replyRepository.deleteReplayById('', '')).rejects.toThrowError('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

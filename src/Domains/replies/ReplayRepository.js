/* eslint-disable no-unused-vars */
class ReplayRepository {
  async addReplay(addedReplay) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentId(commentid) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThreadId(threadId) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplayIsExist(threadId, commentId, replayId) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplayAccess(replayId, owner) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplayById(replayId) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplayRepository;

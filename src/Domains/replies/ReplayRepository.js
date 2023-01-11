/* eslint-disable no-unused-vars */
class ReplayRepository {
  async addReplay(addedReplay) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getReplayByCommentId(id) {
    throw new Error('REPLAY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplayIsExist(commentId, replayId) {
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

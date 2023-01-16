class DeleteReplayUseCase {
  constructor({ replayRepository }) {
    this._replayRepository = replayRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    const { owner } = useCasePayload;
    const { threadId, commentId, replayId } = useCaseParam;

    await this._replayRepository.checkReplayIsExist(threadId, commentId, replayId);
    await this._replayRepository.verifyReplayAccess(replayId, owner);
    await this._replayRepository.deleteReplayById(replayId);
  }
}

module.exports = DeleteReplayUseCase;

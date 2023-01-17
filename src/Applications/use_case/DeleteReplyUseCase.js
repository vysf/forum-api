class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    const { owner } = useCasePayload;
    const { threadId, commentId, replyId } = useCaseParam;

    await this._replyRepository.checkReplyIsExist(threadId, commentId, replyId);
    await this._replyRepository.verifyReplyAccess(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;

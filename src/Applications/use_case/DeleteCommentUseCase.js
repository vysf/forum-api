class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    const { owner } = useCasePayload;
    const { threadId, commentId } = useCaseParam;

    await this._commentRepository.checkCommentIsExist(threadId, commentId);
    await this._commentRepository.verifyCommentAccess(commentId, owner);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;

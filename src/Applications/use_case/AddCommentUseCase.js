const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    await this._threadRepository.verifyThreadAvailability(useCaseParam.threadId);
    const newComment = new NewComment({
      ...useCasePayload, threadId: useCaseParam.threadId,
    });

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;

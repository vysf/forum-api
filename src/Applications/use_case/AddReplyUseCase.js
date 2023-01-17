const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    await this._threadRepository.getThreadById(useCaseParam.threadId);
    await this._commentRepository.getCommentById(useCaseParam.commentId);
    const newReply = new NewReply({
      ...useCasePayload, commentId: useCaseParam.commentId,
    });

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;

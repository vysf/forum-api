const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;

    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentByThareadId(threadId);
    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    const commentsDetail = threadDetail.comments;

    for (let i = 0; i < commentsDetail.length; i += 1) {
      commentsDetail[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentsDetail[i].id)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });
    }

    return new DetailThread(threadDetail);
  }
}

module.exports = GetThreadUseCase;

const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replayRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replayRepository = replayRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;

    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentByThareadId(threadId);
    const threadReplies = await this._replayRepository.getRepliesByThreadId(threadId);

    const commentsDetail = threadDetail.comments;

    for (let i = 0; i < commentsDetail.length; i += 1) {
      commentsDetail[i].replies = threadReplies
        .filter((replay) => replay.commentId === commentsDetail[i].id)
        .map((replay) => {
          const { commentId, ...replayDetail } = replay;
          return replayDetail;
        });
    }

    return new DetailThread(threadDetail);
  }
}

module.exports = GetThreadUseCase;

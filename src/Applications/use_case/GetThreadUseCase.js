/* eslint-disable no-param-reassign */
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;

    const threadDetail = await this._threadRepository.verifyThreadAvailability(threadId);
    threadDetail.comments = await this._commentRepository.getCommentByThareadId(threadId);
    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    // const commentsDetail = threadDetail.comments;
    const commentsDetail = threadDetail.comments.map((comment) => {
      comment.content = comment.isDelete === true ? '**komentar telah dihapus**' : comment.content;
      const { isDelete, ...commentDetail } = comment;
      return new DetailComment({ ...commentDetail, replies: [] });
    });

    threadDetail.comments = commentsDetail;

    for (let i = 0; i < threadDetail.comments.length; i += 1) {
      threadDetail.comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === threadDetail.comments[i].id)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });
    }

    return new DetailThread(threadDetail);
  }
}

module.exports = GetThreadUseCase;

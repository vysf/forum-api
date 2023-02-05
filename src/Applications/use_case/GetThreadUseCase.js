/* eslint-disable no-param-reassign */
// const DetailComment = require('../../Domains/comments/entities/DetailComment');
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

    threadDetail.comments = this._checkCommentsIsDeleted(threadDetail.comments);
    threadDetail.comments = this._getRepliesForComments(threadDetail.comments, threadReplies);

    return new DetailThread(threadDetail);
  }

  _checkCommentsIsDeleted(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].isDelete ? '**komentar telah dihapus**' : comments[i].content;
      delete comments[i].isDelete;
    }
    return comments;
  }

  _getRepliesForComments(comments, replies) {
    for (let i = 0; i < comments.length; i += 1) {
      const { id } = comments[i];
      comments[i].replies = replies
        .filter((reply) => reply.commentId === id)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          replyDetail.content = replyDetail.isDelete ? '**balasan telah dihapus**' : replyDetail.content;
          delete replyDetail.isDelete;
          return replyDetail;
        });
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;

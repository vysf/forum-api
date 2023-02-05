class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, date, content, commentId,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.commentId = commentId;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, commentId,
    } = payload;

    if (!id || !username || !date || !content || !commentId) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
    || typeof username !== 'string'
    || typeof date !== 'string'
    || typeof content !== 'string'
    || typeof commentId !== 'string') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;

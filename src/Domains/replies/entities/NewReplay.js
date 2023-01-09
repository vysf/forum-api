class NewReplay {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, commentId } = payload;

    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload(payload) {
    const { content, owner, commentId } = payload;

    if (!content || !owner || !commentId) {
      throw new Error('NEW_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReplay;

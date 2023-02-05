/* eslint-disable no-undef */
const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw new error when payload not meet data taype specification', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      username: 'dicoding',
      date: '2021',
      commentId: 2,
      content: [],
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply correctly', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      username: 'dicoding',
      date: '2021',
      content: 'content',
      commentId: 'comment-1',
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.commentId).toEqual(payload.commentId);
  });
});

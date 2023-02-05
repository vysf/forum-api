/* eslint-disable no-undef */
const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: [],
      owner: 'user-123',
      commentId: 1,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'some content',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.content).toEqual('some content');
    expect(newReply.owner).toEqual('user-123');
    expect(newReply.commentId).toEqual('comment-123');
  });
});

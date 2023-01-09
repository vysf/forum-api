/* eslint-disable no-undef */
const NewReplay = require('../NewReplay');

describe('NewReplay entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewReplay(payload)).toThrowError('NEW_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: [],
      owner: 'user-123',
      commentId: 1,
    };

    // Action and Assert
    expect(() => new NewReplay(payload)).toThrowError('NEW_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReplay entities correctly', () => {
    // Arrange
    const payload = {
      content: 'some content',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const newReplay = new NewReplay(payload);

    // Assert
    expect(newReplay).toBeInstanceOf(NewReplay);
    expect(newReplay.content).toEqual('some content');
    expect(newReplay.owner).toEqual('user-123');
    expect(newReplay.commentId).toEqual('comment-123');
  });
});

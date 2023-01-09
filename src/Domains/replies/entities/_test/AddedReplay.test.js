/* eslint-disable no-undef */
const AddedReplay = require('../AddedReplay');

describe('AddedReplay entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
    };

    // Action and Assert
    expect(() => new AddedReplay(payload)).toThrowError('ADDED_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      content: 1,
      owner: [],
    };

    // Action and Assert
    expect(() => new AddedReplay(payload)).toThrowError('ADDED_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReplay entities correctly', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      content: 'some content',
      owner: 'user-123',
    };

    // Action
    const addedReplay = new AddedReplay(payload);

    // Assert
    expect(addedReplay).toBeInstanceOf(AddedReplay);
    expect(addedReplay.id).toEqual('replay-123');
    expect(addedReplay.content).toEqual('some content');
    expect(addedReplay.owner).toEqual('user-123');
  });
});

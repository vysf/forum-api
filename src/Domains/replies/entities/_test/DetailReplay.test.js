/* eslint-disable no-undef */
const DetailReplay = require('../DetailReplay');

describe('DetailReplay entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
    };

    // Action and Assert
    expect(() => new DetailReplay(payload)).toThrowError('DETAIL_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw new error when payload not meet data taype specification', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      username: 'dicoding',
      date: '2021',
      content: [],
    };

    // Action and Assert
    expect(() => new DetailReplay(payload)).toThrowError('DETAIL_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReplay correctly', () => {
    // Arrange
    const payload = {
      id: 'replay-123',
      username: 'dicoding',
      date: '2021',
      content: 'content',
    };

    // Action
    const detailReplay = new DetailReplay(payload);

    // Assert
    expect(detailReplay).toBeInstanceOf(DetailReplay);
    expect(detailReplay.id).toEqual(payload.id);
    expect(detailReplay.username).toEqual(payload.username);
    expect(detailReplay.date).toEqual(payload.date);
    expect(detailReplay.content).toEqual(payload.content);
  });
});

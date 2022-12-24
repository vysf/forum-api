/* eslint-disable no-undef */
const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Action
    const payload = {
      title: 'title',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when not meet data type specification', () => {
    // Action
    const payload = {
      title: 'title',
      id: [],
      owner: 123,
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  // it should create AddedThread entities correctly
});

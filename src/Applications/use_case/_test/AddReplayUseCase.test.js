/* eslint-disable no-undef */
const AddReplayUseCase = require('../AddReplayUseCase');
const AddedReplay = require('../../../Domains/replies/entities/AddedReplay');
const ReplayRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewReplay = require('../../../Domains/replies/entities/NewReplay');

describe('AddReplayUseCase', () => {
  it('should orchestrating the add replay action correctly', async () => {
    // Action
    const useCasePayload = {
      content: 'some comment',
    };

    // dari request.auth.credentials / id from accessToken
    useCasePayload.owner = 'user-123 coyyy';

    const useCaseParam = {
      commentId: 'comment-123456',
    };

    const expectedAddedReplay = new AddedReplay({
      id: 'replay-123',
      content: 'some comment',
      owner: 'user-123',
    });

    const mockReplayRepository = new ReplayRepository();
    const mockCommentRepository = new CommentRepository();

    mockReplayRepository.addReplay = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReplay));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplayUseCase = new AddReplayUseCase({
      replayRepository: mockReplayRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReplay = await addReplayUseCase.execute(useCasePayload, useCaseParam);

    // Assert
    expect(addedReplay).toStrictEqual(expectedAddedReplay);
    expect(mockCommentRepository.getCommentById).toBeCalledWith('comment-123456');
    expect(mockReplayRepository.addReplay).toBeCalledWith(new NewReplay({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCaseParam.commentId,
    }));
  });
});

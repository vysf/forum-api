const NewReplay = require('../../Domains/replies/entities/NewReplay');

class AddReplayUseCase {
  constructor({ replayRepository, commentRepository }) {
    this._replayRepository = replayRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam) {
    await this._commentRepository.getCommentById(useCaseParam.commentId);
    const newReplay = new NewReplay({
      ...useCasePayload, commentId: useCaseParam.commentId,
    });

    // console.log(newReplay)
    // console.log(!newReplay.content)
    // console.log(!newReplay.owner)
    // console.log(!newReplay.commentId)

    return this._replayRepository.addReplay(newReplay);
  }
}

module.exports = AddReplayUseCase;

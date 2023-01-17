const AddReplayUseCase = require('../../../../Applications/use_case/AddReplayUseCase');
const DeleteReplayUseCase = require('../../../../Applications/use_case/DeleteReplayUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplayHandler = this.postReplayHandler.bind(this);
    this.deleteReplayHandler = this.deleteReplayHandler.bind(this);
  }

  async postReplayHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const addReplayUseCase = this._container.getInstance(AddReplayUseCase.name);
    const addedReplay = await addReplayUseCase
      .execute({ ...request.payload, owner }, request.params);

    const response = h.response({
      status: 'success',
      data: {
        addedReplay,
      },
    });

    response.code(200);
    return response;
  }

  async deleteReplayHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const deleteReplayUseCase = this._container.getInstance(DeleteReplayUseCase.name);
    await deleteReplayUseCase.execute({ owner }, request.params);

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;

const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  // ubah jadi execute(useCasePayload, owner)
  // owner diambil dari request.auth.credentials
  // yang dikirim oleh handler
  async execute(useCasePayload) {
    // dapatkan access token
    // verifikasi access token
    // decode access token untuk dapatkan id user sebagai owner
    // line 13 ubah jadi NewThread({ ...useCasePayload, owner })
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;

const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReplay = require('../../Domains/replies/entities/AddedReplay');
const ReplayRepository = require('../../Domains/replies/ReplayRepository');

class ReplayRepositoryPostgres extends ReplayRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addReplay(addedReplay) {
    const { content, owner, commentId } = addedReplay;
    const id = `replay-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedReplay({ ...result.rows[0] });
  }

  async getReplayByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id,
             CASE
                WHEN replies.is_delete = TRUE THEN '**balasan telah dihapus**' ELSE replies.content
             END AS content,
             replies.date,
             users.username
             FROM replies
                INNER JOIN users
                    ON replies.owner = users.id
                        WHERE replies.comment_id = $1
                        ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkReplayIsExist(commentId, replayId) {
    const query = {
      text: `SELECT * FROM replies
      INNER JOIN comments 
      ON replies.comment_id = comments.id
      WHERE replies.id = $1 AND comments.id = $2`,
      values: [replayId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('replay tidak ditemukan');
    }
  }

  async verifyReplayAccess(replayId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replayId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke resource ini!');
    }
  }

  async deleteReplayById(replayId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [replayId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('replay tidak ditemukan');
    }
  }
}

module.exports = ReplayRepositoryPostgres;

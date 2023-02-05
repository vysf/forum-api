const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addReply(addedReply) {
    const { content, owner, commentId } = addedReply;
    const id = `reply-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.id, replies.content, replies.date, users.username
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

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id,
              replies.is_delete AS "isDelete",
              replies.content,
              comments.id AS "commentId",
              replies.date,
              users.username
              FROM replies
              INNER JOIN comments 
                ON replies.comment_id = comments.id
                  INNER JOIN users
                      ON replies.owner = users.id
                          WHERE comments.thread_id = $1
                          ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkReplyIsExist(threadId, commentId, replyId) {
    const query = {
      text: `SELECT * FROM replies
              INNER JOIN comments 
                ON replies.comment_id = comments.id
                WHERE replies.id = $1 AND replies.comment_id = $2 AND comments.thread_id = $3
                AND replies.is_delete = false`,
      values: [replyId, commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyAccess(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke resource ini!');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;

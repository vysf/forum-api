const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator, dateGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._dateGenerator = dateGenerator;
  }

  async addComment(addedComment) {
    const { content, owner, threadId } = addedComment;
    const id = `comment-${this._idGenerator(16)}`;
    const date = new this._dateGenerator().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(commentId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, users.username
             FROM comments
             INNER JOIN users ON comments.owner = users.id
             WHERE comments.id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCommentByThareadId(threadId) {
    // CASE
    //   WHEN comments.is_delete = TRUE THEN '**komentar telah dihapus**' ELSE comments.content
    // END AS content,
    const query = {
      text: `SELECT comments.id,
             comments.is_delete AS "isDelete",
             comments.content AS content,
             comments.date,
             users.username
             FROM comments
                INNER JOIN users
                    ON comments.owner = users.id
                        WHERE comments.thread_id = $1
                        ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkCommentIsExist(threadId, commentId) {
    const query = {
      text: `SELECT * FROM comments
      INNER JOIN threads 
      ON comments.thread_id = threads.id
      WHERE comments.id = $1 AND threads.id = $2 AND comments.is_delete = false`,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentAccess(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak punya akses ke resource ini!');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;

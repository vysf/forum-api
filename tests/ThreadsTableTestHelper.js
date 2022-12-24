/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'default title',
    body = 'lorem ipsum',
    owner = 'user-123',
    date = 'Sat Dec 24 2022 14:38:54 GMT+0700 (Indochina Time)',
  }) {
    const query = {
      text: 'INSER INTO threads VALUES($1, $2, $3, $4, $5',
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async getThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;

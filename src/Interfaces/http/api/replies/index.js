const routes = require('./router');
const RepliesHandler = require('./handler');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};

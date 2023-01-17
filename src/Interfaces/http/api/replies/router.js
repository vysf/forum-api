const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplayHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replayId}',
    handler: handler.deleteReplayHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;

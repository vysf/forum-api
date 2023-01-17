const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: (request, h) => handler.postReplayHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replayId}',
    handler: (request, h) => handler.deleteReplayHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;

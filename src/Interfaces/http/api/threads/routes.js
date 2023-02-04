const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-rate-limitor': {
          max: 90,              // a maximum of 5 requests
          duration: 60 * 1000, // per minute
          enabled: false       // but it’s actually not enabled ;-)
        }
      }
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadByIdHandler(request, h),
    options: {
      plugins: {
        'hapi-rate-limitor': {
          max: 90,              // a maximum of 5 requests
          duration: 60 * 1000, // per minute
          enabled: false       // but it’s actually not enabled ;-)
        }
      }
    }
  },
];

module.exports = routes;

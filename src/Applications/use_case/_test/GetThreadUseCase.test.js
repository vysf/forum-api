// /* eslint-disable no-undef */
// const GetThreadUseCase = require('../GetThreadUseCase');
// const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
// const CommentRepository = require('../../../Domains/comments/CommentRepository');
// const DetailThread = require('../../../Domains/threads/entities/DetailThread');

// describe('GetThreadUseCase', () => {
//   it('should orchestrating the get thread action correctly', async () => {
//     // Arrange
//     // 1. dapatkan thread by id (request.params)
//     // 2. dapatkan comment by thread id
//     const useCaseParams = {
//       threadId: 'thread-1234',
//     };

//     const expectedDetaiThread = new DetailThread({
//       id: 'user-123',
//       title: 'dicoding',
//       body: 'some text',
//       date: 'senin',
//       username: 'Dicoding Indonesia',
//       comments: [],
//     });

//     const mockThreadRepository = new ThreadRepository();
//     const mockCommentRepository = new CommentRepository();

//     mockThreadRepository.getThreadById = jest.fn()
//       .mockImplementation(() => Promise.resolve(expectedDetaiThread));
//     mockCommentRepository.getCommentByThareadId = jest.fn()
//       .mockImplementation(() => Promise.resolve());
//   });
// });

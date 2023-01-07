const LoginTestHelper = {
  async getAccessToken({ server, username = 'dicoding' }) {
    // buat user baru
    const userPayload = {
      username,
      password: 'secret',
    };

    const user = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'Dicoding Indonesia',
      },
    });

    // login dulu
    const login = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { accessToken } = (JSON.parse(login.payload)).data;
    const { id: userId } = (JSON.parse(user.payload)).data.addedUser;

    return { accessToken, userId };
  },
};

module.exports = LoginTestHelper;

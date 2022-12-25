const LoginTestHelper = {
  async getAccessToken(server) {
    // buat user baru
    const userPayload = {
      username: 'dicoding',
      password: 'secret',
    };

    await server.inject({
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

    return accessToken;
  },
};

module.exports = LoginTestHelper;

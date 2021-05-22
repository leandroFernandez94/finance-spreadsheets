module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/user/leandro',
        permanent: true,
      },
    ]
  },
}
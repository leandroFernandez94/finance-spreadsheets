const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  pwa: {
    dest: "public",
    runtimeCaching,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/user/leandro",
        permanent: true,
      },
    ];
  },
});

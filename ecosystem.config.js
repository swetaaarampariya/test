// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const environment = process.env.NODE_ENV;

module.exports = {
  apps: [
    {
      name: `gravitrain-frontend-${environment || 'development'}`,
      script: './server.js',
      watch: false
    }
  ]
};

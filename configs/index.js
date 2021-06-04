let config = {
  local: {
    mode: 'local',
    server: {
      port: 3000
    },
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'lightweightMonitoringSystem'
    }
  },
  staging: {
    mode: 'staging',
    server: {
      port: 4000
    },
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'lightweightMonitoringSystem'
    }
  },
  production: {
    mode: 'production',
    server: {
      port: 5000
    },
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'lightweightMonitoringSystem'
    }
  }
};
module.exports = function (mode) {
  return config[mode || process.argv[2] || process.env.MODE || 'local'] || config.local;
};
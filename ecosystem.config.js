module.exports = {
    apps: [
        {
            name:"MEETeUX-AdminServer",
            script: "dist/index.js",
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],
    deploy: {
        user: 'prod',
        host: 'god.meeteux.fhstp.ac.at',
        ref: 'origin/master',
        repo: "https://github.com/fhstp/meeteux-AdminServer.git",
        path: '/srv/adminPanel',
        'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }
};
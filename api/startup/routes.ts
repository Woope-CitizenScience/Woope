import express from 'express';
let healthRouter = require('../routes/health');
// add more routers here

module.exports = function (app: express.Application) {
    app.use(express.json());

    app.use('/health', healthRouter);
};
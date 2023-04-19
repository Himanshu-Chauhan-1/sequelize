require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });
const path = require('path')
const express = require("express")
const expressRouter = express.Router()
const app = express()
const spaceRouter = require('./modules/spaces/spaces.route');
const schoolRouter = require('./modules/schools/schools.route');
const userRouter = require('./modules/users/users.route');

app.use(express.json())

const setupRoutes = function () {
    return new Promise((resolve, reject) => {
        const resisterRoutesPromise = require(path.resolve(
            './routes',
        )).registerRoutes(expressRouter)
        resisterRoutesPromise
            .then((routerInstance) => {
                return resolve(routerInstance)
            })
            .catch((err) => {
                return reject(err)
            })
    })
}

const setupSequelize = function () {
    return new Promise((resolve, reject) => {
        require(path.resolve('./models/index'))
        return resolve()
    })
}

const port = PORT

app.use('/', spaceRouter,schoolRouter,userRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})


// const setupServer = function () {
//     console.log(setupServer)
//     app.use(express.json())
//     app.use(
//       express.urlencoded({
//         extended: true,
//       }),
//     )
//     const setupSequelizePromise = setupSequelize()
//     setupSequelizePromise.then(() => {
//         const setupRoutesPromise = setupRoutes()
//         setupRoutesPromise.then((expressRouter) => {
//             app.use('/', expressRouter)
//             app.use(function (req, res, next) {
//               res.status(404).send({
//                 message: 'API not found',
//                 statusCode: 404,
//                 path: req.path,
//               })
//             })
//             console.log(`SUCCESS-Server is running on PORT ${PORT}!`)
//           })
//       })
//   }
  
// setupServer()
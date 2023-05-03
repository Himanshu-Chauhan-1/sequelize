require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });
const path = require('path')
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require("morgan")
const helmet = require("helmet")
const spaceRouter = require(path.resolve('./modules/spaces/spaces.route'));
const schoolRouter = require(path.resolve('./modules/schools/schools.route'));
const userRouter = require(path.resolve('./modules/users/users.route'));
const blogRouter = require(path.resolve('./modules/blogs/blogs.route'))

app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

const port = PORT

app.use('/', spaceRouter, schoolRouter, userRouter, blogRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
})

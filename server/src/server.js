import '../instrument.mjs'

import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './config/inngest.js'
import * as Sentry from '@sentry/node'
import cors from 'cors'

import { ENV } from './config/env.js'
import { connectDB } from './config/db.js'
import chatRoutes from './routes/chat.route.js'

const app = express()
app.use(express.json())

app.use(clerkMiddleware()) // req.auth will be available in the request object

Sentry.setupExpressErrorHandler(app)
app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!')
})

app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/chat', chatRoutes)

app.get('/', (req, res) => {
  res.send('Hello world 123!')
})

const startServer = async () => {
  try {
    await connectDB()
    if (ENV.NODE_ENV !== 'production') {
      app.listen(ENV.PORT, () => {
        console.log(`Server started on port: ${ENV.PORT}`)
      })
    }
  } catch (error) {
    console.error(`Error starting server: `, error)
    process.exit(1)
  }
}

startServer()

export default app

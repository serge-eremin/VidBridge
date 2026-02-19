import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './config/inngest.js'
import cors from 'cors'

import { ENV } from './config/env.js'
import { connectDB } from './config/db.js'

const app = express()
app.use(express.json())

app.use(clerkMiddleware()) // req,auth will be available in the request object

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use('/api/inngest', serve({ client: inngest, functions }))

app.get('/', (req, res) => {
  res.send('Hello world!')
})

const startServer = async () => {
  try {
    await connectDB()
    if (ENV.NODE_MODE !== 'production') {
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

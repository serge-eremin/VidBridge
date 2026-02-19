import { Inngest } from 'inngest'

import { User } from '../models/user.model.js'
import { connectDB } from './db.js'
import { upsertStreamUser, deleteStreamUser } from './stream.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'vid-bridge' })

const syncUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    await connectDB()

    const { id, email_addresses, first_name, last_name, image_url } = event.data

    const email = email_addresses?.[0]?.email_address
    if (!email) {
      console.error('User created without email address:', id)
      return null
    }

    const newUser = {
      clerkId: id,
      email,
      name: `${first_name || ''} ${last_name || ''}`.trim(),
      image: image_url,
    }

    await User.create(newUser)

    await upsertStreamUser({
      id: newUser.id.toString(),
      name: newUser.name,
      image: newUser.image,
    })
  },
)

const deleteUserFromDB = inngest.createFunction(
  { id: 'delete-user-from-db' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDB()
    const { id } = event.data
    await User.deleteOne({ clerkId: id })

    await deleteStreamUser(id.toString())
  },
)

export const functions = [syncUser, deleteUserFromDB]

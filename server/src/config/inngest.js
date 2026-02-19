import { Inngest } from 'inngest'

import { User } from '../models/user.model.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'vid-bridge' })

const syncUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/User.created' },
  async ({ event }) => {
    await connectDB()

    const { id, email_addresses, first_name, last_name, image_url } = event.data

    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ''} ${last_name || ''}`,
      image: image_url,
    }

    await User.create(newUser)

    //TODO: DO MORE THING HERE
  },
)

const deleteUserFromDB = inngest.createFunction(
  { id: 'delete-user-from-db' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data
    await User.deleteOne({ clerkId: id })
    //TODO: DO MORE THING HERE
  },
)

// const updateUserFromDB = inngest.createFunction(
//   { id: 'update-user-from-db' },
//   { event: 'clerk/user.updated' },
//   async ({ event }) => {
//     const { id } = event.data
//     await User.findAndUpdateOne({ clerkId: id })
//     //TODO: DO MORE THING HERE
//   },
// )

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB]

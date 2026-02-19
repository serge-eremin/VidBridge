export const protectRoute = (req, res, next) => {
  try {
    if (!req.auth().isAuthentificated) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - you must be looged in' })
    }

    next()
  } catch (error) {
    console.log(first)
  }
}

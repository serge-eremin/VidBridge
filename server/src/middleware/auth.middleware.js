export const protectRoute = (req, res, next) => {
  try {
    if (!req.auth.isAuthentificated) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - you must be looged in' })
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

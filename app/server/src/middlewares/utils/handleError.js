/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
export const handleError = (res = {}, err = {}) => {

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(err)
  }

  console.log('ERROR: ', err)

  if (err?.notice && err.notice != null) {
    // eslint-disable-next-line no-console
    console.log ('Notification Errors:', err.notice)
  }

  res.status(err?.code || 404).json({
    errors: {
      msg: err?.message
    }
  })
}

export default handleError
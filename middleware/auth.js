module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        console.log('user was not authed')
        res.redirect('/')
      }
    }
  }
  
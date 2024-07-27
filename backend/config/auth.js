module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Por favor inicie sesión para ver este recurso');
    res.redirect('/auth/login');
  },
  ensureAdminAuthenticated: function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Por favor inicie sesión como administrador para ver este recurso');
    res.redirect('/auth/login');
  }
};

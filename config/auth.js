exports.isUser = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('danger','Please log in.');
        res.redirect('/admin/users/login');
    }
}
exports.isAdmin = function(req,res,next){
    if(req.isAuthenticated() && res.locals.user.admin == 1){
        console.log(req.isAuthenticated());
        next();
    }else{
        req.flash('danger','Please log in as admin.');
        res.redirect('/admin/users/login');
    }
}
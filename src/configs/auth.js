const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/accounts/Account');
const bcrypt = require('bcryptjs');


passport.use(
  new LocalStrategy(
    async (username, password, done) => {
      try {
        const account = await Account.findOne({username: username});
        if(!account){
          return done(null, false, {message: 'Tài khoản không tồn tại!'});
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if(!isMatch){
          return done(null, false, {message: 'Mật khẩu không đúng!'});
        }
        return done(null, account);
      } catch (error) {
        return done(error);
      }
    }
  )
)

passport.serializeUser((account, done) => {
  done(null, account._id);
})

passport.deserializeUser(async (id, done) => {
  const account = await Account.findById(id);
  done(null, account);
})

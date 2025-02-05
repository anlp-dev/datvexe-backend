const Account =  require("../models/accounts/Account");

const inputValidationAccount = async (req, res, next) => {
  try {
    const username = req.body.username;
    const isValidUsername = await Account.findOne({ username: username });
    if(isValidUsername){
      return res.status(400).json({status: 400, message: 'Username đã tồn tại' });
    }
    const email = req.body.email;
    const isValidEmail = await Account.findOne({ email: email });
    if(isValidEmail){
      return res.status(400).json({status: 400, message: 'Email đã tồn tại' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  inputValidationAccount
}

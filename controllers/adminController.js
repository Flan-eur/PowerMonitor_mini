const admin = require("../models/adminModel");
var bcrypt = require("bcrypt");

module.exports = {
  signin: function (data) {
    return new Promise(async (resolve, reject) => {
      let _user = await admin.findOne({ email: data.email });
      if (!_user) return reject("Invalid Credentials");
      bcrypt
        .compare(_user.password, data.password)
        .then(() => {
          return resolve({ _user });
        })
        .catch((err) => reject("Invalid Credentials"));
    });
  },
  signup: function (data) {
    return new Promise(async (resolve, reject) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
      const newadmin = new admin(data);
      newadmin.save((err, res) => {
        if (err) return reject(err._message ? err._message : "Error details");
        return resolve(res);
      });
    });
  },
};

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const axios = require("axios");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      axios
        .get("http://localhost:5000/users/finduser/" + email)
        .then(res => {
          let user = res.data;
          //Check email
          if (!user) {
            return done(null, false, {
              message: "That email is not registered"
            });
          } else {
            //Check password
            bcrypt.compare(passport, user.password, (err, isMatch) => {
              if (err) {
                throw err;
              } else if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect password" });
              }
            });
          }
        })
        .catch(e => console.log(e));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    axios
      .get("http://localhost:5000/users/finduserbyid/" + id)
      .then(res => {
        done(null, res.data);
      })
      .catch(err => {
        console.log("Error deserializing user with id " + id);
        done(err, false);
      });
  });
};

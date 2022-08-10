const password = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GoogleUser = require("../model").googleUser;
console.log(GoogleUser);
password.serializeUser(function (user, done) {
  /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
  done(null, user);
});

password.deserializeUser(function (user, done) {
  /*
    Instead of user this function usually recives the id
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
  done(null, user);
});
password.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/login/callback",
    },
    async function (req, accessToken, refreshToken, profile, done) {
      console.log(profile._json);
      console.log(accessToken);
      let user = profile._json;

      const [Users, created] = await GoogleUser.findOrCreate({
        where: {
          googleid: user.sub,
        },
        defaults: {
          googleid: user.sub,
          email: user.email,
          name: user.name,
          photo: user.picture,
        },
      });
      console.log("user", Users);
      console.log("created", created);

      console.log("create successfully ");
      profile.MamurId = Users.dataValues.id;
      return done(null, profile);
    }
  )
);

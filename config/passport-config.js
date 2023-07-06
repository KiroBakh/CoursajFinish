const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: "kirycha21@gmail.com",
      pass: "uaxyieowyxkomaik",
    },
  },
  {
    from: "Mailer test <kirycha21@gmail.com>",
  }
);
let attempts = 0;

function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = 10;
  let passwordMail = "";

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    passwordMail += characters[randomIndex];
  }

  return passwordMail;
}

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username],
          async (err, result) => {
            if (err) throw err;

            if (result.rows.length > 0) {
              const user = result.rows[0];
              const isMatch = await bcrypt.compare(password, user.password);
              if (isMatch) {
                attempts = 0;
                return done(null, user);
              } else {
                attempts++;
                if (attempts >= 3) {
                  let newpassword = generatePassword();
                  const hashedPassword = await bcrypt.hash(newpassword, 10);
                  const mailOptions = {
                    from: "kirycha21@gmail.com",
                    to: "kbahtiarov78@gmail.com",
                    subject: "Запит на скидання пароля",
                    html: `<h1>Сброс пароля</h1>
                   <p>Ваш пароль был успешно сброшен.</p>
                   <p>Новый пароль для користувача ${username}: <strong style="color:red;">${newpassword}</strong></p>
                   <p>Измените свой пароль после входа в свою учетную запись.</p>`,
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                      pool.query(
                        "UPDATE users SET password = $1 WHERE username = $2",
                        [hashedPassword, username],
                        (err, result) => {
                          if (err) throw err;
                        }
                      );
                    }
                  });
                  return done(null, false, {
                    message: "Електронний лист для зміни пароля надіслано.",
                  });
                } else {
                  return done(null, false, {
                    message: `Неправильний пароль. Спроба ${attempts}`,
                  });
                }
              }
            } else {
              return done(null, false, {
                message: `Користувача |${username}| не знайдено`,
              });
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
      if (err) throw err;

      if (result.rows.length > 0) {
        const user = result.rows[0];
        done(null, user);
      } else {
        done(new Error(`User with id ${id} not found`));
      }
    });
  });
};

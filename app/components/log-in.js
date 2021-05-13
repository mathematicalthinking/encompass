Encompass.LogInComponent = Ember.Component.extend(
  Encompass.ErrorHandlingMixin,
  {
    classNames: ["login-page"],
    incorrectPassword: false,
    incorrectUsername: false,
    missingCredentials: false,
    postErrors: [],

    oauthErrorMsg: function () {
      if (this.get("oauthError") === "emailUnavailable") {
        return "The provided email address is already associated with an existing account";
      }
    }.property("oauthError"),

    actions: {
      login: function () {
        if (!this.get("username") || !this.get("password")) {
          this.set("missingCredentials", true);
          return;
        }

        let createUserData = {
          username: this.get("username").trim(),
          password: this.get("password").trim(),
        };
        Ember.$.post({
          url: "/auth/login",
          data: createUserData,
        })
          .then((res) => {
            if (res.message === "Incorrect password") {
              this.set("incorrectPassword", true);
            } else if (res.message === "Incorrect username") {
              this.set("incorrectUsername", true);
            } else {
              this.sendAction("toHome");
            }
          })
          .catch((err) => {
            this.handleErrors(err, "postErrors");
          });
      },

      resetErrors() {
        const errors = [
          "incorrectUsername",
          "incorrectPassword",
          "missingCredentials",
        ];

        for (let error of errors) {
          if (this.get(error)) {
            this.set(error, false);
          }
        }
      },
    },
  }
);

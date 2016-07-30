loadTemplate('user', function(template) {
  Vue.component("user", Vue.extend({
    template: template,
    data: function() {
      return {
        logged: undefined,
        toDisplay: '',
        displayed: 'displayName',
        league: '--NO-LEAGUE--'
      };
    },
    computed: {
      toDisplay: function() {
        return this.logged[this.displayed];
      },
    },
    methods: {
      auth: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var $vc = this;
        var provider = new firebase.auth.GithubAuthProvider();
        this.$root.fbRef.auth().signInWithPopup(provider);
      },
      unAuth: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.$root.fbRef.auth().signOut();
      },
      team: function() {},
      toggleName: function(event) {
        if (this.displayed == 'displayName') {
          this.displayed = 'uid';
        } else {
          this.displayed = 'displayName';
        }
        event.preventDefault();
        event.stopPropagation();
      }
    },
    events: {
      'data-league-assign': function(data) {
        if (this.logged && data.who == this.logged.uid) {
          this.league = data.where;
        }
      }
    },
    created: function() {
      var self = this;
      var db = this.$root.db;
      this.$root.fbRef.auth().onAuthStateChanged(function(auth) {
        if (auth !== null) {
          self.logged = auth.providerData[0];
          console.log(auth);
          self.logged.uid = auth.uid; // prevent issues related to github:github: accounts
          self.logged.isAdmin = false;
          self.displayed = 'displayName';
          db.ref('/users/' + self.logged.uid).on('value', function(s) {
            var data = s.val();
            if (!data) {
              db.ref("/users/" + self.logged.uid).set(self.logged);
            } else {
              self.logged.displayName = data.displayName;
            }
            db.ref('/admins/' + self.logged.uid).once('value').then(function(snapshot) {
              self.logged = _.extend(_.clone(self.logged), {
                isAdmin: !!snapshot.val()
              });
              self.$root.$emit('logged', self.logged);
            });
          });
          self.$root.$emit('logged', self.logged);
        } else {
          self.logged = undefined;
          self.displayName = undefined;
          self.$root.$emit('logged', self.logged);
        }
      });
    }
  }));
});

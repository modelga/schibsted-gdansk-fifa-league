loadTemplate('user', function(template) {
  Vue.component("user", Vue.extend({
    template: template,
    data: function() {
      return {
        players: [],
        logged: undefined,
        toDisplay: '',
        displayed: 'displayName',
        fbRef: undefined,
        teams: {}
      };
    },
    computed: {
      toDisplay: function() {
        return this.logged[this.displayed];
      }
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
    created: function() {
      var self = this;
      var db = this.$root.db;
      this.$root.fbRef.auth().onAuthStateChanged(function(auth) {
        if (auth !== null) {
          self.logged = auth.providerData[0];
          self.logged.isAdmin = false;
          self.displayed = 'displayName';
          db.ref('/users/' + auth.uid).on('value',function(s) {
            var data = s.val();
            if (!data) {
              db.ref("/users/" + auth.uid).set({
                displayName: self.logged.displayName
              });
            }
            db.ref('/admins/' + auth.uid).once('value').then(function(snapshot) {
              self.logged = _.extend(JSON.parse(JSON.stringify(self.logged)), {
                isAdmin: !!snapshot.val()
              });
              self.$dispatch('logged',self.logged);
              console.log(JSON.stringify(self.logged));
            });
          });
          self.$dispatch('logged',self.logged);
        } else {
          self.logged = undefined;
          self.displayName = undefined;
          self.$dispatch('logged',self.logged);
        }
      });
    }
  }));
});

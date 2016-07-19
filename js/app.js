runAfterLoadAllTemplates(function() {
  Vue.use(VueAsyncData);
  Vue.config.debug = true;
  new Vue({
    el: 'body',
    data: {
      players: [],
      logged: undefined,
      toDisplay: '',
      displayed: 'displayName',
      fbRef: undefined,
      teams: {}
    },
    methods: {
      auth: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var $vc = this;
        var provider = new firebase.auth.GithubAuthProvider();
        this.fbRef.auth().signInWithPopup(provider);
      },
      unAuth: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.fbRef.auth().signOut();
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
      },
      stars: function(team) {
        var foundTeam = _.find(this.teams, function(theTeam) {
          if (theTeam.name === team)
            return theTeam;
        });
        if (typeof foundTeam === 'undefined') {
          return [];
        }
        return [1, 1, 1, 1, 1].map(function(value, index) {
          if (index < parseInt(foundTeam.score)) {
            return ("star");
          } else if (index < foundTeam.score) {
            return ("star-half-o");
          } else {
            return ("star-o");
          }
        });
      }
    },
    computed: {
      toDisplay: function() {
        return this.logged[this.displayed];
      }
    },
    created: function() {
      var config = {
        apiKey: "AIzaSyDbPbbC82iKCoFzA3ibCWgSPe8AGPiNt8Q",
        authDomain: "fiery-inferno-4213.firebaseapp.com",
        databaseURL: "https://fiery-inferno-4213.firebaseio.com",
        storageBucket: "fiery-inferno-4213.appspot.com",
      };
      this.fbRef = firebase.initializeApp(config);
      this.db = this.fbRef.database();
    },
    asyncData: function(resolve) {
      var self = this;
      var db = this.db;
      db.ref('/events').on('value', function(s) {
        var events = s.val();
        _.forEach(events, function(event) {
          self.$broadcast("init", {
            name: "init"
          });
        });
        self.$broadcast("loaded", {
          name: "loaded"
        });
      });
      this.fbRef.auth().onAuthStateChanged(function(auth) {
        if (auth !== null) {
          console.log(auth.providerData[0]);
          self.logged = auth.providerData[0];
          self.logged.isAdmin = false;
          self.displayed = 'displayName';
          db.ref('/users/' + auth.uid).once('value').then(function(s) {
            var data = s.val();
            if (!data) {
              db.ref("/users/" + auth.uid).set({
                displayName: self.logged.displayName
              });
            }
          });
          db.ref('/admins/' + auth.uid).once('value').then(function(snapshot) {
            self.logged = _.extend(JSON.parse(JSON.stringify(self.logged)),{isAdmin: !!snapshot.val()});
          });
        } else {
          self.logged = undefined;
          self.displayName = undefined;
        }
      });
    }
  });
});

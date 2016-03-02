window.fbRef = new Firebase("https://fiery-inferno-4213.firebaseio.com/");


Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
  data: {
    players: [],
    logged: undefined
  },
  methods: {
    winner: function(game) {
      if (parseInt(game.home.goals) == parseInt(game.away.goals)) {
        return 'draw';
      } else if (parseInt(game.home.goals) > parseInt(game.away.goals)) {
        return 'home';
      } else {
        return 'away';
      }
    },
    auth: function(event) {
      event.preventDefault();
      event.stopPropagation();
      var $vc = this;
      fbRef.authWithOAuthPopup("github", function(error, authData) {
        console.log(authData);
      }, {
        remember: "sessionOnly",
        scope: "user,gist"
      });
    },
    unAuth: function(event) {
      event.preventDefault();
      event.stopPropagation();
      fbRef.unAuth();
    }
  },

  asyncData: function(resolve) {
    var self = this;
    fbRef.root().on('value', function(s) {
      self.$broadcast('on-data', s.val());
    });
    fbRef.onAuth(function(auth) {
      console.log(auth);
      if (auth !== null) {
        self.logged = auth.github;
      } else {
        self.logged = undefined;
      }
    });
  }
});

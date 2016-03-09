Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
  data: {
    players: [],
    logged: undefined,
    toDisplay: '',
    displayed : 'displayName',
    fbRef: new Firebase("https://fiery-inferno-4213.firebaseio.com/")
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
      this.fbRef.authWithOAuthPopup("github", function(error, authData) {
      }, {
        remember: "sessionOnly",
        scope: "user,gist"
      });
    },
    unAuth: function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.fbRef.unauth();
    },
    toggleName: function(event) {
      if (this.displayed == 'displayName') {
        this.displayed = 'id';
      } else {
        this.displayed = 'displayName';
      }
      event.preventDefault();
      event.stopPropagation();
    }
  },
  computed: {
    toDisplay: function() {
      return this.logged[this.displayed];
    }
  },
  asyncData: function(resolve) {
    var self = this;
    this.fbRef.root().on('value', function(s) {
      self.$broadcast('on-data', s.val());
    });

    this.fbRef.onAuth(function(auth) {
      if (auth !== null) {
        self.logged = auth.github;
        self.displayed = 'displayName';
      } else {
        self.logged = undefined;
        self.displayName = undefined;
      }
    });
  }
});

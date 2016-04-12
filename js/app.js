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
        console.log(error);
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
    },
    team: function(player){
      return "";
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
      data = s.val();
      if(!data.hasOwnProperty("games")){
        data.games = {};
      }
      self.$broadcast('on-data', data);
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

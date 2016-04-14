Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
  data: {
    players: [],
    logged: undefined,
    toDisplay: '',
    displayed: 'displayName',
    fbRef: new Firebase("https://fiery-inferno-4213.firebaseio.com/"),
    teams: {}
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
    team: function(player, value) {
      if (typeof player === "object") {
        player = player.name;
      }

      if (typeof value !== 'undefined') {
        return {
          name: value,
          score: 0
        };
      } else {
        if (this.teams.hasOwnProperty(player)) {
          return this.teams[player];
        } else {
          return {
            name: "",
            score: 0
          };
        }
      }
    },
    stars: function(team) {
      var foundTeam = _.find(this.teams, function(theTeam) {
        console.log(theTeam);
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
  events: {
    'on-data': function(data) {
      this.teams = data.teams;
      this.$broadcast('on-data', data);
    }
  },
  asyncData: function(resolve) {
    var self = this;
    this.fbRef.root().on('value', function(s) {
      data = s.val();
      if (!data.hasOwnProperty("games")) {
        data.games = {};
      }
      self.$emit('on-data', data);
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

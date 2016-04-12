Vue.component("post-result", Vue.extend({
  template: $('#post-result-template').text(),
  data: function() {
    return {
      result: undefined,
      away: {
        name: '',
        goals: 0,
        team: ''
      },
      home: {
        name: '',
        goals: 0,
        team: ''
      },
      revange: false,
      players: [],
      teams: []
    };
  },
  events: {
    'on-data': function(data) {
      this.players = data.players;
      this.teams = this.extractTeams(data.games);
    },
    'fill-submit': function(game) {
      this.away = {
        name: game.home.name,
        team: game.away.team,
        goals: 0
      };
      this.home = {
        name: game.away.name,
        team: game.home.team,
        goals: 0
      };
      this.revange = game.revange;
    }
  },
  methods: {
    extractTeams: function(games) {
      return _.flatten(
        games.map(function(g) {
          return [g.away.team, g.home.team];
        })
      ).unique;
    },
    post: function() {
      var $vm = this;
      var result = {
        away: this.away,
        home: this.home,
        tookAPlace: true,
        revange: this.revange,
        date: Date.now()
      };
      this._completeTeams();
      this.$root.fbRef.child('games').push(result, function(error) {
        if (!!error) {
          $vm.result = error;
        } else {
          $vm.result = "Submitted!";
        }
      });
    },

    _completeTeams: function() {
      var $vm = this;
      if (!this.revange) {
        [this.away, this.home]
          .filter(function(team) {
            return $vm.$root.team(team) === "";
          }).forEach(function(e) {
          $vm.$root.fbRef.child('teams/' + e.name).set(
            {
              name: e.team,
              score: 4
            }
          );

        });
      }
    }
  },
  computed: {
    errors: function() {
      var validations = [
        {
          msg: "Home name cannot be empty",
          valid: !!this.home.name
        },
        {
          msg: "Away name cannot be empty",
          valid: !!this.away.name
        },
        {
          msg: "Home name must be name one of players",
          valid: _.contains(this.players, this.home.name)
        },
        {
          msg: "Away name must be name one of players",
          valid: _.contains(this.players, this.away.name)
        },
        {
          msg: "Away goals cannot be negative!",
          valid: this.away.goals >= 0
        },
        {
          msg: "Home goals cannot be negative!",
          valid: this.home.goals >= 0
        },
        {
          msg: "Home team name cannot be empty!",
          valid: !!this.home.team
        },
        {
          msg: "Away team name cannot be empty!",
          valid: !!this.away.team
        },
      ];
      return _.filter(validations, function(v) {
        return !v.valid;
      });
    }
  }
}));

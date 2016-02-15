window.fbRef = new Firebase("https://fiery-inferno-4213.firebaseio.com/");
Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
  data: {
    players: [],
    games: []
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
    }
  },
  computed: {
    scorers: function() {
      var self = this,
        scoredPlayerList = _.map(this.players, function(player) {

          var scoreList = _.filter(self.games, function(game) {
            return game.home.name === player || game.away.name === player;
          }).map(function(game) {
            if (game.home.name == player)
              return game.home.goals;
            else
              return game.away.goals;
          }).map(function(i) {
            return parseInt(i);
          });

          return {
            'name': player,
            'goals': _.reduce(scoreList, function(a, b) {
              return a + b;
            }, 0)
          };
        });
      return _.chain(scoredPlayerList).sortBy('name')
      .sortBy(function(pl) {
        return -pl.goals;
      }).value();
    },
    table: function() {
      var self = this,
        scoredPlayerList = _.map(this.players, function(player) {
          var scoreList = _.filter(self.games, function(game) {
            return game.home.name === player || game.away.name === player;
          });
          var points = _.map(scoreList, function(game) {
            game.winner = self.winner(game);
            if (game.home.name === player)
              playerIs = 'home';
            else
              playerIs = 'away';
            if (game.winner == 'draw') {
              return 1;
            } else if (game.winner == playerIs) {
              return 3;
            } else {
              return 0;
            }
          });
          var goals = _.flatten(_.map(scoreList, function(game) {
            return [game.home, game.away];
          }));
          var balance = $.extend({
            gain: [],
            lost: []
          }, _.groupBy(goals, function(side) {
            if (side.name === player) {
              return 'gain';
            } else {
              return 'lost';
            }
          }));
          sumGoals = function(scoreA, scoreB) {
            return {
              goals: parseInt(scoreA.goals) + parseInt(scoreB.goals)
            };
          };
          sum = function(a, b) {
            return a + b;
          };
          var gained = (_.reduce(balance.gain, sumGoals, {
            goals: 0
          })).goals;
          var lost = (_.reduce(balance.lost, sumGoals, {
            goals: 0
          })).goals;

          return {
            'name': player,
            'points': _.reduce(points, sum, 0),
            'draws': _.filter(points, function(p) {
              return p == 1;
            }).length,
            'losses': _.filter(points, function(p) {
              return p === 0;
            }).length,
            'wins': _.filter(points, function(p) {
              return p == 3;
            }).length,
            'gained': gained,
            'lost': lost,
            'total': points.length,
            'balance': gained - lost
          };
        });
      return _.chain(scoredPlayerList).sortBy('name')
      .sortBy(function(result) {
        return -result.balance;
      }).sortBy(function(result) {
        return -result.points;
      }).value();
    }
  },
  asyncData: function(resolve) {
    fbRef.root().on('value', function(s) {
      resolve(s.val());
    });

  }
});

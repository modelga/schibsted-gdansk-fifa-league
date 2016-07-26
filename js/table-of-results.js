loadTemplate('results-table', function(template) {
  Vue.component('table-of-results', Vue.extend({
    template:  template,
    events: {
      'on-data': function(data) {
        this.$data = data;
      }
    },
    computed: {
      table: function() {
        var self = this,
          scoredPlayerList = _.map(this.players, function(player) {
            var scoreList = _.filter(self.games, function(game) {
              return game.home.name === player || game.away.name === player;
            });
            var points = _.map(scoreList, function(game) {
              game.winner = self.$root.winner(game);
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
            return -result.gained;
          })
          .sortBy(function(result) {
            return -result.balance;
          })
          .sortBy(function(result) {
            return result.total;
          })
          .sortBy(function(result) {
            return -result.points;
          }).value();
      }
    }
  }));
});

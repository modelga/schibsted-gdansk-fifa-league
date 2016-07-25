loadTemplate('results-table', function(template) {
  Vue.component('table-of-results', Vue.extend({
    template: template,
    data: function() {
      return {
        leagues: {},
        league: undefined
      };
    },
    events: {
      'data-league-assign': function(data) {
        var copy = _.clone(this.leagues);
        if (copy.hasOwnProperty(data.where)) {
          copy[data.where].push(data.who);
        } else {
          copy[data.where] = [data.who];
        }
        this.leagues = copy;
      },
      'data-league': function(data) {
        if (!this.leagues.hasOwnProperty(data.where)) {
          var leagues = _.clone(this.leagues);
          leagues[data.value] = [];
          this.leagues = leagues;
        }
      },
      'action-choose-league': function(data) {
        this.league = data;
      }
    },
    computed: {
      players: function() {
        if (this.leagues.hasOwnProperty(this.league)) {
          return this.leagues[this.league];
        }else{
          return [];
        }
      },
      games: function() {
        return [];
      },
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

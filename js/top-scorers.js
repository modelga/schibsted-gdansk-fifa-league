loadTemplate('top-scorers', function(template) {
  Vue.component('top-scorers', Vue.extend({
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
      }
    }
  }));
});

loadTemplate('top-scorers', function(template) {
  Vue.component('top-scorers', Vue.extend({
    template: template,
    events: {
      'on-data': function(data) {
        this.$data = data;
        this.games = _.toArray(this.games).reverse();
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
      }
    }
  }));
});

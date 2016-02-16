Vue.component('top-scorers',Vue.extend({
  template: $("#top-scorers-template").text(),
  events:{
    'on-data' : function(data){
      this.$data = data;
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

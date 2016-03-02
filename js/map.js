Vue.component("result-map", Vue.extend({
  data: function()  {

      return {players: []};

  },
  template: $("#result-map-template").text(),
  methods: {
    played: function(home, away) {
      var a = (this.playedHome),
        played = function() {
          return false;
        };
      if (a.hasOwnProperty(home)) {
        played = a[home].playedWith;
      }
      return home != away ?
        (played(away) ? 'played' : 'no-played')
        : 'own';
    },
    resultsBetween: function(home, away) {
      var a = (this.playedHome),
        played = function() {
          return false;
        };
      if (a.hasOwnProperty(home)) {
        played = a[home].playedWith;
      }
      if (played(away)) {
        return this.results[home][away].result;
      } else {
        return "";
      }
    }
  },
  events:{
    'on-data' : function(data){
      this.$data = data;
    }
  },
  computed: {
    playedHome: function() {
      return _.chain(this.games)
        .groupBy(function(game) {
          return game.home.name;
        })
        .map(function(value, key) {
          var w = _.map(value, function(game) {
            return game.away.name;
          });
          return {
            player: key,
            playedWith: function(op) {
              return w.indexOf(op) !== -1;
            }
          };
        })
        .indexBy(function(w) {
          return w.player;
        }).value();
    },
    results: function() {
      x = _.chain(this.games)
        .groupBy(function(game) {
          return game.home.name;
        })
        .map(function(value, key) {
          var w = _.chain(value).map(function(game) {
            return {
              player: game.away.name,
              result: game.home.goals + ':' + game.away.goals
            };
          }).indexBy(function(e) {
            return e.player;
          }).value();
          return $.extend({
            player: key
          }, w);
        }).indexBy(function(r) {
        return r.player;
      }).value();
      return x;
    }
  }
}));

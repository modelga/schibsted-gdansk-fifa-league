Vue.component("result-map", Vue.extend({
  data: function() {

    return {
      players: [],
      games:{}
    };

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
      var playedFirstGame = function() {
        if (a.hasOwnProperty(away)) {
          return a[away].playedWith(home);
        } else
          return false;
      };
      return home != away ?
        (played(away) ? 'played' : 'no-played' + ' ' + (this.isBottomTriangle(home, away) ? 'possible bottom' : (playedFirstGame() ? 'possible' : 'blocked')))
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
    },
    isBottomTriangle: function(home, away) {
      return this.players.indexOf(home) > this.players.indexOf(away);
    },
    createGame: function(home, away) {
      var played = this.played(home, away);
      if (played.indexOf("possible") !== -1) {
        this.$root.$broadcast('fill-submit', {
          home: {
            name: home,
            team: ''
          },
          away: {
            name: away,
            team: ''
          }
        });
      }
    }
  },
  events: {
    'on-data': function(data) {
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
          var awayPlayers = _.map(value, function(game) {
            return game.away.name;
          });
          return {
            player: key,
            playedWith: function(opponent) {
              return awayPlayers.indexOf(opponent) !== -1;
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

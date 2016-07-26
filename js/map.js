loadTemplate('results-map', function(template) {
  Vue.component("result-map", Vue.extend({
    data: function() {

      return {
        games: {},
        leagues: {},
        league: ""
      };

    },
    template: template,
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
        var played = this.played(away, home);
        if (played.indexOf("possible") !== -1) {
          var isRevenge = this.played(home, away).indexOf('no-played') === -1;
          this.$root.$broadcast('fill-submit', {
            home: {
              name: home,
              team: this.$root.team(home).name
            },
            away: {
              name: away,
              team: this.$root.team(away).name
            },
            revange: isRevenge
          });
        }
      }
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
          return this.leagues[this.league].concat(['Avav','DQDQ','ADS']);
        }else{
          return [];
        }
      },
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
});

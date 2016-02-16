window.fbRef = new Firebase("https://fiery-inferno-4213.firebaseio.com/");


Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
  data: {
    players: []
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
    },
    played: function(home, away) {
      var a = (this.playedHome),
      played = function(){return false;};
      if(a.hasOwnProperty(home)){
        played = a[home].playedWith;
      }
      return home != away ?
            (played(away) ? 'played' : 'no-played')
            : 'own';
    },
    resultsBetween: function(home, away) {
      var a = (this.playedHome),
      played = function(){return false;};
      if(a.hasOwnProperty(home)){
        played = a[home].playedWith;
      }
      if(played(away)){
        return this.results[home][away].result;
      }else{
        return "";
      }
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
      x =  _.chain(this.games)
      .groupBy(function(game) {
        return game.home.name;
      })
      .map(function(value, key) {
        var w = _.chain(value).map(function(game){
          return {
            player : game.away.name,
            result: game.home.goals + ':' +  game.away.goals
          };
        }).indexBy(function(e){
          return e.player;
        }).value();
        return $.extend({
          player: key
        },w);
      }).indexBy(function(r){
        return r.player;
      }).value();
      console.log(x);
      return x;
    },
  },
  asyncData: function(resolve) {
    var self = this;
    fbRef.root().on('value', function(s) {
      self.$broadcast('on-data', s.val());
      self.$data = s.val();
    });
  }
});

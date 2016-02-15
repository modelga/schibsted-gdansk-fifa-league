window.fbRef = new Firebase("https://fiery-inferno-4213.firebaseio.com/");


Vue.use(VueAsyncData);
Vue.config.debug = true;
new Vue({
  el: 'body',
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
  asyncData: function(resolve) {
    var self = this;
    fbRef.root().on('value', function(s) {
      self.$broadcast('on-data',s.val());
    });
  }
});

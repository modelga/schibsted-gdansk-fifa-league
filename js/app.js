runAfterLoadAllTemplates(function() {
  Vue.use(VueAsyncData);
  Vue.config.debug = true;
  new Vue({
    el: 'body',
    data: {
      players: [],
      logged: undefined,
      toDisplay: '',
      displayed: 'displayName',
      fbRef: undefined,
      teams: {}
    },
    methods: {
      team: function() {},
      stars: function(team) {
        var foundTeam = _.find(this.teams, function(theTeam) {
          if (theTeam.name === team)
            return theTeam;
        });
        if (typeof foundTeam === 'undefined') {
          return [];
        }
        return [1, 1, 1, 1, 1].map(function(value, index) {
          if (index < parseInt(foundTeam.score)) {
            return ("star");
          } else if (index < foundTeam.score) {
            return ("star-half-o");
          } else {
            return ("star-o");
          }
        });
      }
    },
    events:{
      logged: function(data){
        this.logged = data;
      },
      'store': function(data,callback){
        console.log("store data"+data);
      }
    },
    created: function() {
      var config = {
        apiKey: "AIzaSyDbPbbC82iKCoFzA3ibCWgSPe8AGPiNt8Q",
        authDomain: "fiery-inferno-4213.firebaseapp.com",
        databaseURL: "https://fiery-inferno-4213.firebaseio.com",
        storageBucket: "fiery-inferno-4213.appspot.com",
      };
      this.fbRef = firebase.initializeApp(config);
      this.db = this.fbRef.database();
    },
    asyncData: function(resolve) {
      var self = this;
      var db = this.db;
      db.ref('/events').on('value', function(s) {
        var events = s.val();
        _.forEach(events, function(event) {
          self.$broadcast("data-"+event.name, event);
        });
      });
    }
  });
});

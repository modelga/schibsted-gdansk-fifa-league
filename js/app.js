
runAfterLoadAllTemplates(function() {
  var names = {};
  Vue.filter('person', function(a,b){
    if(names.hasOwnProperty(a)){
      return names[a];
    }else{
      return a;
    }
  });
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
      teams: {},
      db: undefined
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
      },
    },
    events: {
      'logged': function(data) {
        this.logged = data;
        this.$broadcast('logged', data);
      },
      'store': function(data, callback) {
        callback = typeof callback != 'function' ? function() {} : callback;
        data.uid = this.logged.uid;
        this.db.ref('/events').push(data).then(callback);
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
      this.db.ref('/users').on('value',function(s){
        _(s.val()).forEach(function(data){
          names[data.uid] = data.displayName;
        });
      });
    },
    asyncData: function(resolve) {
      var self = this;
      var db = this.db;
      var broadcast = function(event) {
        self.$broadcast("data-" + event.name, event);
      };
      var reloadApp = function() {
        window.location.reload();
      };
      var ref = db.ref('/events').orderByKey();
      ref.on('child_added', function(data) {
        broadcast(data.val());
      });
    }
  });
});

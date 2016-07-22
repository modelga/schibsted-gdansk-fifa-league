loadTemplate('admin', function(template) {
  Vue.component("admin", Vue.extend({
    template: template,
    data: function() {
      return {
        stream: "a",
        logged: undefined,
        users: [],
        attempts: {},
        assigns: []
      };
    },
    events: {
      'logged': function(data) {
        this.logged=data;
      },
      'data-league': function(data){
        console.log(this.attempts);
        var attempts = _.clone(this.attempts);
        attempts[data.value] = [];
        this.attempts = attempts;
      },
      'data-league-attempt': function(data) {
        console.log("attempt to "+data.value);
        console.log(this.attempts[data.value]);
        this.attempts[data.value].push(data.uid);
        console.log(this.attempts[data.value]);
      },
      'data-league-assign': function(data) {
        this.member = data.value;
      },
      'data-league-reject': function(data) {
        this.attempts = _.filter(this.attempts, function(attempt){
          return attempt.uid != data.who;
        });
      }
    },
    created: function() {
      this.refreshUsers();
    },
    watch:  {
      'attempts': function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      }
    },
    methods: {
      refreshUsers: function() {
        var $vm = this;
        this.$root.db.ref("/users").once('value', function(snapshot) {
          $vm.users = snapshot.val();
        });
      },
      authorize: function(uid) {
        this.$root.db.ref("/users/" + uid + "/authorized").set(true);
        this.refreshUsers();
      },
      promote: function(uid) {
        this.$root.db.ref("/users/" + uid + "/isAdmin").set(true);
        this.$root.db.ref("/admins/" + uid).set(true);
        this.refreshUsers();
      },
      demote: function(uid) {
        this.$root.db.ref("/users/" + uid + "/isAdmin").set(false);
        this.$root.db.ref("/admins/" + uid).set(false);
        this.refreshUsers();
      }
    }
  }));
});

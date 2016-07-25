
loadTemplate('admin', function(template) {
  Vue.component("admin", Vue.extend({
    template: template,
    data: function() {
      return {
        logged: undefined,
        users: [],
        attempts: [],
        assigns: []
      };
    },
    events: {
      'logged': function(data) {
        this.logged = data;
      },
      'data-league-attempt': function(data) {
        this.attempts.push({
          who: data.uid,
          where: data.value
        });
      },
      'data-league-assign': function(data) {
        this.attempts = _.filter(this.attempts, function(attempt) {
          return attempt.who != data.who;
        });
      },
      'data-league-reject': function(data) {
        this.attempts = _.filter(this.attempts, function(attempt) {
          return attempt.uid != data.who;
        });
      }
    },
    created: function() {
      var $vm = this;
      this.$root.db.ref("/users").on('value', function(snapshot) {
        $vm.users = snapshot.val();
      });
    },
    methods: {
      authorize: function(uid) {
        this.$root.db.ref("/users/" + uid + "/authorized").set(true);
        this.refreshUsers();
      },
      promote: function(uid) {
        this.$root.db.ref("/users/" + uid + "/isAdmin").set(true);
        this.$root.db.ref("/admins/" + uid).set(true);
      },
      demote: function(uid) {
        this.$root.db.ref("/users/" + uid + "/isAdmin").set(false);
        this.$root.db.ref("/admins/" + uid).set(false);
      },
      remove: function(uid) {
        this.$root.db.ref("/admins/" + uid).remove();
        this.$root.db.ref("/users/" + uid).remove();
      },
      acceptAssignment: function(data) {
        data.name = 'league-assign';
        this.$dispatch("store", data);
      },
      rejectAssignment: function(data) {
        data.name = 'league-reject';
        this.$dispatch("store", data);
      }
    }
  }));
});

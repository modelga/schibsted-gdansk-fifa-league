
loadTemplate('admin', function(template) {
  Vue.component("admin", Vue.extend({
    template: template,
    data: function() {
      return {
        logged: undefined,
        users: [],
        authorizes: {},
        attempts: [],
        teamsRequests: [],
        assigns: {team:{},league:{}}
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
        var assigns = _.clone(this.assigns.league);
        assigns[data.who] = data.where;
        this.assigns.league = assigns;
        this.attempts = this.filterUid(this.attempts, data.who);
      },
      'data-league-reject': function(data) {
        this.attempts = this.filterUid(this.attempts, data.who);
      },
      'data-team-change-request': function(data) {
        this.teamsRequests.push({
          who: data.uid,
          team: data.value
        });
      },
      'data-team-change-approve': function(data) {
        var assigns = _.clone(this.assigns.team);
        assigns[data.who] = data.team;
        this.assigns.team = assigns;
        this.teamsRequests = this.filterUid(this.teamsRequests, data.who);
      },
      'data-team-change-reject': function(data) {
        this.teamsRequests = this.filterUid(this.teamsRequests, data.who);
      },
    },
    created: function() {
      var $vm = this;
      this.$root.db.ref("/users").on('value', function(snapshot) {
        $vm.users = snapshot.val();
      });
      this.$root.db.ref("/authorized").on('value', function(snapshot) {
        $vm.authorizes = snapshot.val();
      });
    },
    methods: {
      filterUid: function(obj, uid) {
        return _.filter(obj, function(entry) {
          return entry.who != uid;
        });
      },
      authorize: function(uid) {
        this.$root.db.ref("/authorized/" + uid).set(true);
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
      leagueAssignment: function(data, state) {
        data.name = 'league-' + state;
        this.$dispatch("store", data);
      },
      teamRequest: function(data, state) {
        data.name = 'team-change-' + state;
        this.$dispatch("store", data);
      },
    }
  }));
});

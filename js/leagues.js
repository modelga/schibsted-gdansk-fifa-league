loadTemplate('leagues', function(template) {
  Vue.component("leagues", Vue.extend({
    template: template,
    data: function() {
      return {
        showInput: false,
        leagues: [],
        newLeagueName: '',
        isAdmin: false,
        active: undefined
      };
    },
    events: {
      'data-league': function(data) {
        var newLeague = data.value;
        this.leagues.push(newLeague);
        if (this.leagues.length === 1) {
          this.active = newLeague;
        }
      },
      'action-choose-league': function(data) {
        this.active = data;
      },
      'logged': function(user) {
        this.isAdmin = user && user.isAdmin;
      }
    },
    methods: {
      newLeague: function() {
        this.showInput = !this.showInput;
      },
      acceptLeague: function() {
        var $vm = this;
        if (this.newLeagueName !== "") {
          this.$dispatch('store', {
            name: "league",
            value: this.newLeagueName
          }, function(s) {
            $vm.showInput = false;
          });
        }
      },
      choose: function(league) {
        this.$root.$broadcast('action-choose-league', league);
      }
    }
  }));
});

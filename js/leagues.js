loadTemplate('leagues', function(template) {
  Vue.component("leagues", Vue.extend({
    template: template,
    data: function() {
      return {
        showInput: false,
        leagues: [],
        newLeagueName: '',
        isAdmin: false
      };
    },
    events: {
      'data-league': function(data) {
        this.leagues.push(data.value);
      },
      'action-choose-league':function(data){
        console.log("choose an league"+ data);
      },
      'logged': function(user){
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
          this.$dispatch('store',{
            name: "league",
            value: this.newLeagueName
          },function(s) {
            $vm.showInput = false;
          });
        }
      },
      choose: function(league){
        this.$root.$broadcast('action-choose-league',league);
      }
    }
  }));
});

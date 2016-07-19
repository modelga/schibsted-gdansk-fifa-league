loadTemplate('leagues', function(template) {
  Vue.component("leagues", Vue.extend({
    template: template,
    data: function() {
      return {
        showInput: false,
        leagues: [],
        newLeagueName: ''
      };
    },
    events: {
      'data-league': function(data) {
        this.leagues.push(data.value);
      },
      'action-league':function(data){
        console.log("choose an league"+ data);
      }
    },
    methods: {
      newLeague: function() {
        this.showInput = !this.showInput;
      },
      acceptLeague: function() {
        var $vm = this;
        if (this.newLeagueName !== "") {
          this.$root.db.ref("/events").push({
            name: "league",
            value: this.newLeagueName
          }).then(function(s) {
            $vm.showInput = false;
          });
        }
      },
      choose: function(league){
        this.$root.$broadcast('action-league',league);
      }
    }
  }));
});

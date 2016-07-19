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
      league: function(data) {
        leagues.push(data.value);
      }
    },
    methods: {
      newLeague: function() {
        this.showInput = true;
      },
      acceptLeague: function() {
        var $vm = this;
        this.$root.db.ref("/events").push({
          name: "league",
          value: this.newLeagueName
        }).then(function(s){
          $vm.showInput=false;
        });
      }
    }
  }));
});

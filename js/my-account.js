loadTemplate('my-account', function(template) {
  Vue.component("my-account", Vue.extend({
    template: template,
    data: function() {
      return {
        leagues: [],
        logged:undefined,
        attempted: undefined,
        member: undefined
      };
    },
    events: {
      'data-league': function(data) {
        this.leagues.push(data.value);
      },
      'logged': function(data) {
        this.logged = _.clone(data);
      },
      'data-league-attempt': function(data){
        if(this.logged && data.uid == this.logged.uid){
          this.attempted = data.value;
        }
      },
      'data-league-assign' : function(data){
        if (this.logged && data.who === this.logged.uid) {
          this.member = data.where;
        }
      },
      'data-league-reject' : function(data){
        if (data.who === this.logged.uid) {
          this.attempted = null;
        }
      }
    },
    created: function(){
      this.$root.db.ref('/users').once('value',function(s){
          console.log(s.val());
      });
    },
    methods: {
      attempt: function(league) {
        this.$dispatch('store',{
          name: "league-attempt",
          value: league
        });
      },
      'changeName': function() {
        this.$root.db.ref('/users/'+this.logged.uid).set(this.logged);
      }
    }
  }));
});

Vue.component("games-table",Vue.extend({
  name: "games-table",
  template: $("#games-table-template").text(),
  events:{
    'on-data' : function(data){
      this.$data = data;
    }
  },
  created:function(){
  }

}));

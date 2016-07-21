loadTemplate('my-account', function(template) {
  Vue.component("my-account", Vue.extend({
    template: template,
    data: function(){return{
      leagues: []
    };},
    events: {
      'data-league': function(data){
        
      }
    }
  }));
});

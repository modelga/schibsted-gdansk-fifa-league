loadTemplate('admin', function(template) {
  Vue.component("admin", Vue.extend({
    template: template,
    data: function() {
      return {
        stream: "a"
      };
    },
    events: {
      'logged': function(data) {
        console.log(this.stream);
      }
    }
  }));
});

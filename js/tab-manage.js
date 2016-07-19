loadTemplate('tab-manage', function(template) {
  Vue.component("tab-manage", Vue.extend({
    template: template,
    data: function() {
      return {
        tabs: [],
        active: undefined
      };
    },
    created: function() {
      var tabs = [];
      var active;
      $(".tabs > .tab").each(function() {
        var tab = $(this);
        var tabName = tab.data("name");
        tabs.push(tab.data("name"));
        if($(this).hasClass('active')){
          active =tabName;
        }
      });
      this.tabs = tabs;
      this.active = active;
    },
    methods:{
      activate: function(tab){
        $(".tabs > .tab").removeClass('active');
        $(".tabs > .tab[data-name='"+tab+"']").addClass('active');
        this.active = tab;
      }
    }
  }));
});

loadTemplate('tab-manage', function(template) {
  Vue.component("tab-manage", Vue.extend({
    template: template,
    data: function() {
      return {
        basicTabs: [],
        accountTabs: [],
        active: undefined
      };
    },
    created: function() {
      var tabs = [];
      var active;
      $(".tabs > .tab.shown").each(function() {
        var tab = $(this);
        var tabName = tab.data("name");
        tabs.push(tab.data("name"));
        if($(this).hasClass('active')){
          active =tabName;
        }
      });
      this.basicTabs = tabs;
      this.active = active;
    },
    methods:{
      activate: function(tab){
        $(".tabs > .tab").removeClass('active');
        $(".tabs > .tab[data-name='"+tab+"']").addClass('active');
        this.active = tab;
      }
    },
    computed:{
      tabs: function(){
        return this.basicTabs.concat(this.accountTabs);
      }
    },
    events:{
      logged: function(user){
        this.accountTabs = [];
        if(user){
          this.accountTabs = ["My Account"];
          if(user.isAdmin){
            this.accountTabs.push("Admin");
          }
        }
      }
    }
  }));
});

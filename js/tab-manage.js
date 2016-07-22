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
        tabs.push( $(this).data("name"));
      });
      this.basicTabs = tabs;
      this.activate(tabs[0]);
    },
    methods:{
      activate: function(toActivate){
        this.active = toActivate;
        var tabs = this.tabs;
        $(".tabs > .tab").each(function(){
          var tabName = $(this).data('name');
          $(this).css(
            "transform","translateX("+ 1500* (tabs.indexOf(tabName)-tabs.indexOf(toActivate))+"px)");
        });
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
            this.activate('Admin');
          }
          this.activate(this.active);
        }
      }
    }
  }));
});

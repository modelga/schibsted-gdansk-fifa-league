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
      var $vm = this;
      $(".tabs > .tab.shown").each(function() {
        tabs.push( $(this).data("name"));
      });
      this.basicTabs = tabs;
      this.activate(tabs[0],true);
      setTimeout(function(){
        if(window.localStorage['active-tab']){
          $vm.activate(window.localStorage['active-tab']);
        }
      },200);
    },
    methods:{
      activate: function(toActivate,programatically){
        if(!programatically){
          window.localStorage["active-tab"] = toActivate;
        }
        this.active = toActivate;
        var tabs = this.tabs;
        $(".tabs > .tab").each(function(){
          var tabName = $(this).data('name');
          var index = (tabs.indexOf(tabName)-tabs.indexOf(toActivate));
          var width = $(this).parent().width() ;
          $(this).css(
            "transform","scale("+(1-Math.min(Math.abs(index/2),1))+") translateX("+ (1.5*width * index)+"px)");
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
          }
          this.activate(this.active,true);
        }
      }
    }
  }));
});

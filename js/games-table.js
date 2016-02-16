Vue.component("games-table", Vue.extend({
  name: "games-table",
  template: $("#games-table-template").text(),
  scrollSize: 65,
  visible: 5,
  data: function() {
    return {
      currentScroll: 0,
      games: {}
    };
  },
  events: {
    'on-data': function(data) {
      this.games = data.games;
      this.currentScroll = 0;
      this._reScroll();
    }
  },
  ready: function() {
    this.embed = $(this.$el.nextSibling.parentElement).find('.games-scroll');
    this.embed.height(this.height);
  },
  computed:{
    height: function(){
      return this.$options.visible * this.$options.scrollSize;
    },
    maxScrolled: function(){
      return this.games.length - this.$options.visible;
    }
  },
  methods: {
    up: function() {
        if(this.currentScroll !== 0){
          this.currentScroll--;
        }
        this._reScroll();
    },
    down: function() {
      if(this.currentScroll < this.maxScrolled)
        this.currentScroll++;
      this._reScroll();
    },
    _reScroll: function(){
      this.embed.animate({scrollTop: this.$options.scrollSize * this.currentScroll});
    }
  }
}));

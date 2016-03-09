Vue.component("games-table", Vue.extend({
  name: "games-table",
  template: $("#games-table-template").text(),
  scrollSize: 65,
  visible: 5,
  data: function() {
    return {
      currentScroll: 0,
      games: [],
      search: '',
      expectedGames: 0
    };
  },
  events: {
    'on-data': function(data) {
      this.games = data.games;
      this.expectedGames = data.players.length * (data.players.length - 1);
      this.currentScroll = 0;
      this._reScroll();
    }
  },
  ready: function() {
    this.embed = $(this.$el.nextSibling.parentElement).find('.games-scroll');
    this.embed.height(this.height);
  },
  computed: {
    height: function() {
      return this.$options.visible * this.$options.scrollSize;
    },
    maxScrolled: function() {
      return this.filteredGames.length - this.$options.visible;
    },
    searchBy: function() {
      return $.extend(['', ''], this.search.split(","));
    },
    filteredGames: function() {
      return this.$eval("games | filterBy searchBy[0] in 'home.name' 'away.name' | filterBy searchBy[1] in 'home.name' 'away.name'");
    }
  },
  methods: {
    up: function() {
      if (this.currentScroll !== 0) {
        this.currentScroll--;
      }
      this._reScroll();
    },
    down: function() {
      if (this.currentScroll < this.maxScrolled)
        this.currentScroll++;
      this._reScroll();
    },
    _reScroll: function() {
      this.embed.stop().animate({
        scrollTop: this.$options.scrollSize * this.currentScroll
      });
    },
    isFirstGame: function(game) {
      return this.$eval("games | filterBy '" + game.home.name + "' in 'home.name' 'away.name' | filterBy '" + game.away.name + "' in 'home.name' 'away.name'").length < 2;

    },
    rematch: function(game) {
      if (this.isFirstGame(game)) {
        this.$root.$broadcast('fill-submit', game);
      }
    }
  }
}));

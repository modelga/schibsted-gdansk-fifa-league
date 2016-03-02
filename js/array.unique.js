Array.prototype.unique = function() {
  for (var i = 0, l = this.length; i < l; ++i) {
    var item = this[i];
    var dublicateIdx = this.indexOf(item, i + 1);
    while (dublicateIdx != -1) {
      this.splice(dublicateIdx, 1);
      dublicateIdx = this.indexOf(item, dublicateIdx);
      l--;
    }
  }
  return this;
};

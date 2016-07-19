var definedTemplates = {
  "games-table" : false,
  "post-result" : false,
  "results-map" : false,
  "results-table" : false,
  "top-scorers" : false,
  "leagues": false,
  "user" : false,
  "tab-manage" : false,
};
function loadTemplate(name, callback) {
  $.get('templates/' + name + '.hbs', function(data) {
    definedTemplates[name] = data;
    callback(data);
  });
}

var runAfterLoadAllTemplates = function(callback,time){
  var checkIfLoaded = function(){
    var definition;
    for(definition in definedTemplates){
      if(!definedTemplates[definition])
        return false;
    }
    return true;
  };
  if(checkIfLoaded() || time > 100){
    callback();
  }else{
    setTimeout(function(){
      runAfterLoadAllTemplates(callback,(time === undefined ? 0 : time)+1);
    },15);
  }

};

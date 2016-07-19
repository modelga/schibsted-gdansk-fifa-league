var definedTemplates = {
  "games-table" : false,
  "post-result" : false,
  "results-map" : false,
  "results-table" : false,
  "team-score" : false,
  "top-scorers" : false,
  "leagues": false
};
function loadTemplate(name, callback) {
  console.log(name);
  $.get('templates/' + name + '.hbs', function(data) {
    definedTemplates[name] = data;
    callback(data);
  });
}

var runAfterLoadAllTemplates = function(callback){
  var checkIfLoaded = function(){
    var definition;
    for(definition in definedTemplates){
      if(!definedTemplates[definition])
        return false;
      return true;
    }
  };
  if(checkIfLoaded()){
    callback();
  }else{
    setTimeout(function(){
      runAfterLoadAllTemplates(callback);
    },150);
  }

};

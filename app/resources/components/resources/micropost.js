App.factory('Micropost', function($resource, Api) {

  var resource = $resource(Api + '/microposts/:id.json', { id: '@id' },
  {
    update: { method: 'PUT' },
    query: { method: 'GET', isArray: false },
    delete: {
      method: 'DELETE',
      isArray: false
    },
    deleted: {
      url: Api + '/microposts/deleted',
      method: 'GET',
      isArray: false
    },
    banned: {
      url: Api + '/microposts/banned',
      method: 'GET',
      isArray: false
    },
    active: {
      url: Api + '/microposts/active',
      method: 'GET',
      isArray: false
    },
    reproved: {
      url: Api + '/microposts/reproved',
      method: 'GET',
      isArray: false
    },
    pending: {
      url: Api + '/microposts/pending',
      method: 'GET',
      isArray: false
    }
  });

  return resource;
});

App.factory('Delete_Micropost', function($resource, Api, $log) {

  var resource = $resource(Api + '/microposts/:micropost_id/media/:id_medium.json', { micropost_id: '@micropost_id',id_medium :'@id_medium' },
  {
    delete: {
      method: 'DELETE',
      isArray: false
    }
  });

  return resource;
});

App.factory('ZueiraAPI', function($http, Micropost, Api,$log) {

  var ZueiraAPI = function() {
    this.items = new Array();
    this.busy = false;
    this.nextPageNumber = 1;
  };

  ZueiraAPI.prototype.nextPage = function(typePost) {
    if (this.busy) return;
    this.busy = true;

    Micropost[typePost]({page: this.nextPageNumber}, function(data){
      items = data.microposts;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }

      this.nextPageNumber += 1;
      this.busy = false;
    }.bind(this));
  };

  return ZueiraAPI;
});

App.factory('Micropost_Utils', function(Micropost) {

  return{

    addTrollersAndTargets : function(micropost,newList,type,varAdd,addType,addGetType){

      var _type = type;
      var _addType = addType;
      var _addGetType = addGetType;
      var _index =  micropost[_addGetType].length;
      var _newList = newList;
      var _addValid = true;

      _newList = _newList.split(",");

      micropost[_addType] = new Array();

      angular.forEach(_newList, function(item,key){

        _addValid = true;

        angular.forEach(micropost[_addGetType], function(item_aux,key_aux){

          if(_addValid) {

            var id_aux = item_aux[varAdd + "_id"];

            if(item == id_aux){

              _addValid = false;

            }
          }

        });


        if(_addValid  == true){

          _index += 1;

          micropost[_addType][_index] = {

            [varAdd + "_id"] : item,
            [varAdd + "_type"]  : _type

          }
        }

      });

      return micropost[_addType];
    },
    getTrollersAndTargets : function(list,type){

      var _return = new Array();
      var _newList = list;


      angular.forEach(_newList, function(item,key){

        _return[key] =  item[type].toString();
      });

      return _return;

    }
  }
});

/*

  # deleted: Quando eu vejo uma zueira que nao eh uma zueira na realidade
  # banned: Quando deu treta e alguem quer meu coro porque usei uma imagem prop.
  # active: As zueiras que serao exibidas lah
  # reproved: Zueiras que por algum motivo nao especificado sao reprovadas.
  # pending: Zueiras recentes que acabam de passar pelo crawler.
  associate_values deleted: 0, banned: 1, active: 2, reproved: 3, pending: 4

  */

App.controller('ApprovalsController', function($scope, Micropost,Delete_Micropost, ZueiraAPI, MicropostParticipant, $http,$log , Micropost_Utils) {
  // deleted: 0, banned: 1, active: 2, reproved: 3, pending: 4

  $scope.api = new ZueiraAPI();
  $scope.typePost = 'pending';
  $scope.letterLimit = 85;

  $scope.open = function (post) {
    $scope.post = post;

    setTimeout(function() {
      $('#approvals-modal').modal({ detachable: false, observeChanges: true }).modal('show').modal('refresh');
    }, 500);

    setTimeout(function() {
      $('.special.cards .image').dimmer({
        on: 'hover'
      });
    }, 500);
  };

  $scope.openImage = function(file) {
    $('#image-zoom').attr('src', file);

    setTimeout(function(){
      $('#modal-zoom').modal({
        onHidden: function(){
          $('#approvals-modal').modal({ detachable: false, observeChanges: true }).modal('show').modal('refresh');
        }
      }).modal('show');
    }, 500);
  };

  $scope.openVideo = function(url) {
    var container = $('#video-container');

    if (container.children().length == 0 ){
      container.append("<div class=\"fb-video\" data-href=\""+ url + "\" data-width=\"800\"><div class=\"fb-xfbml-parse-ignore\"></div></div>");
      FB.XFBML.parse();
    }

    $('#see-video').modal({
      observeChanges: true,
      onHidden: function(){
        $('#approvals-modal').modal({ detachable: false, observeChanges: true }).modal('show').modal('refresh');
      }
    }).modal('show').modal('refresh');
  };

  $scope.refreshTypePost = function (typePost) {
    $scope.typePost = typePost;
    $scope.api = new ZueiraAPI();
    $scope.api.nextPage($scope.typePost);
  };


  $scope.init = function(){
    MicropostParticipant.query(function(data){
      $scope.clubs = data.clubs;
    });

    setTimeout(function() {
      $('#approvals-modal').modal({ allowMultiple: true }).modal();
      $('.ui.dropdown').dropdown();
      $('.ui.checkbox').checkbox();
    }, 1000);
  };

  $scope.approve = function(){
    $scope.post.status = 2;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    $scope.micropostJson.micropost.trollers = Micropost_Utils.addTrollersAndTargets($scope.micropostJson.micropost,
      $scope.clubs_selection_trollers,'Club','trollerable','trollers');
    $scope.micropostJson.micropost.targets  = Micropost_Utils.addTrollersAndTargets($scope.micropostJson.micropost,
      $scope.clubs_selection_targets,'Club','targetable','targets');

    Micropost.update({ id:$scope.post.id }, $scope.micropostJson);

    $scope.refreshTypePost($scope.typePost);
  };

  $scope.reprove = function(){
    $scope.post.status = 3;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    Micropost.update({ id:$scope.post.id }, $scope.micropostJson);

    $('#approvals-modal').modal('hide');

    $scope.refreshTypePost($scope.typePost)
  };

  $scope.remove = function(){
    $scope.post.status = 1;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    Micropost.update({ id: $scope.post.id}, $scope.micropostJson);

    $('#approvals-modal').modal('hide');

    $scope.refreshTypePost($scope.typePost)
  };

  $scope.deletePost = function(typePost){

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    Micropost.delete({ id: $scope.post.id}, $scope.micropostJson);

    $('#approvals-modal').modal('hide');

    $scope.refreshTypePost(typePost)
  };

  $scope.deleteSources = function(post,source,typePost){
    $scope.post = post;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    Delete_Micropost.delete({ micropost_id: $scope.post.id,id_medium :source }, $scope.micropostJson);

    $('#approvals-modal').modal('hide');

    $scope.refreshTypePost($scope.typePost)
  };


  $scope.init();
});

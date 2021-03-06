App.controller('ApprovalsController', function($scope, Micropost,Delete_Micropost, ZueiraAPI, MicropostParticipant, $http,$log , Micropost_Utils) {
  // deleted: 0, banned: 1, active: 2, reproved: 3, pending: 4

  $scope.api = new ZueiraAPI();
  $scope.typePost = 'pending';
  $scope.letterLimit = 85;
  $scope.canClear = true;

  $scope.open = function (post) {
    $scope.post = post;

      var selection_trollers = Micropost_Utils.getTrollersAndTargets($scope.post.trollers,'trollerable_id');
      var selection_targets = Micropost_Utils.getTrollersAndTargets($scope.post.targets,'targetable_id');

      $('.ui.fluid.dropdown').dropdown('refresh');

      setTimeout(function () {
        $('[name=selection_trollers]').dropdown('set selected', selection_trollers);
        $('[name=selection_targets]').dropdown('set selected', selection_targets);

      }, 1);

    $('#approvals-modal').modal({
      detachable: false,
      observeChanges: true,
      onHidden: function(){
        $scope.clearFilledData();
      }
    }).modal('show').modal('refresh');

    setTimeout(function() {
      $('.special.cards .image').dimmer({
        on: 'hover'
      });
    }, 500);
  };

  $scope.openImage = function(file) {
    $scope.canClear = false;

    $('#image-zoom').attr('src', file);

    setTimeout(function(){
      $('#modal-zoom').modal({
        onHidden: function(){
          $('#approvals-modal').modal({ detachable: false, observeChanges: true }).modal('show').modal('refresh');
          $scope.canClear = true;
        }
      }).modal('show');
    }, 1100);
  };

  $scope.openVideo = function(url) {
    $scope.canClear = false;

    var container = $('#video-container');

    container.append("<div class=\"fb-video\" data-href=\""+ url
      + "\" data-width=\"800\"><div class=\"fb-xfbml-parse-ignore\"></div></div>");

    FB.XFBML.parse();

    $('#see-video').modal({
      observeChanges: true,
      onHidden: function(){
        container.empty();
        $('#approvals-modal').modal({ detachable: false, observeChanges: true }).modal('show').modal('refresh');
        $scope.canClear = true;
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
      $('#approvals-modal').modal({
        allowMultiple: true
      }).modal();
      $('.ui.dropdown').dropdown();
      $('.ui.checkbox').checkbox();
    }, 1000);
  };

  $scope.clearFilledData = function(){
    if ($scope.canClear) {
      $scope.post = { };

      $('.ui.checkbox').checkbox('uncheck');

      $('[name=selection_trollers]').dropdown('clear');
      $('[name=selection_targets]').dropdown('clear');
    }
  }

  $scope.approve = function(){
    $scope.post.status = 2;
    $scope.canClear = true;  

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    $scope.clubs_selection_trollers = $('[name=selection_trollers]').dropdown('get value');

    $scope.clubs_selection_targets = $('[name=selection_targets]').dropdown('get value');

    if($scope.clubs_selection_trollers != ""){
        $scope.micropostJson.micropost.trollers_attributes = Micropost_Utils.addTrollersAndTargets($scope.micropostJson.micropost,
        $scope.clubs_selection_trollers,'Club','trollerable','trollers_attributes','trollers');
    }

    if($scope.clubs_selection_targets != ""){
        $scope.micropostJson.micropost.target_attributes  = Micropost_Utils.addTrollersAndTargets($scope.micropostJson.micropost,
        $scope.clubs_selection_targets,'Club','targetable','targets_attributes','targets');
    }

    Micropost.update({ id:$scope.post.id }, $scope.micropostJson);

    $('.ui.fluid.dropdown').dropdown('refresh');

    $('#approvals-modal').modal('hide');


    $scope.refreshTypePost($scope.typePost);


  };

  $scope.reprove = function(){
    $scope.post.status = 3;
    $scope.canClear = true;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    $('#approvals-modal').modal('hide');

    Micropost.update({ id:$scope.post.id }, $scope.micropostJson);
    $scope.refreshTypePost($scope.typePost)
  };

  $scope.remove = function(){
    $scope.post.status = 1;
    $scope.canClear = true;

    $scope.micropostJson = {
      "micropost" :$scope.post
    };

    Micropost.update({ id: $scope.post.id}, $scope.micropostJson);

    $scope.refreshTypePost($scope.typePost)
  };

  $scope.deletePost = function(typePost){
    $scope.canClear = true;
    $scope.micropostJson = {
      "micropost": $scope.post
    };

    Micropost.delete({ id: $scope.post.id}, $scope.micropostJson);

    $scope.refreshTypePost(typePost)
  };

  $scope.deleteSources = function(post, medium, typePost){
    $scope.post = post;

    $scope.micropostJson = { "micropost": $scope.post };
    $('#card-' + medium).remove();

    Delete_Micropost.delete({ micropost_id: $scope.post.id, id_medium: medium }, $scope.micropostJson);
    $scope.refreshTypePost($scope.typePost)
  };

  $scope.init();
});

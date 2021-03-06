angular.module('clickaroos.abTest')

.factory('AbTest', ['$http', '$upload', 'appServerUrl', 'ngDialog', function($http, $upload, appServerUrl, ngDialog) {
  var factory = {};

  factory.abTestTitle = null;
  factory.campaignId = null;
  
  factory.loading = {
    makeABTest: false,
    uploadBlob: false
  };

  factory.time = {
    start: new Date(),
    timeAfterStart: {
      hours: 2,
      minutes: 0
    }
  };

  factory.date;

  factory.imagesAndReroutes = [];

  factory.addImageAndReroute = function(imageUrl) {
    var newImageAndReroute = {
      imageUrl: imageUrl || '',
      rerouteUrl: ''
    };

    factory.imagesAndReroutes.push(newImageAndReroute);
  };

  factory.setCampaignId = function(campaignId) {
    factory.campaignId = campaignId;
  }

  factory.productUrls = {
    imageUrl: null,
    rerouteUrl: null
  };

  factory.submitImagesAndReroutes = function() {
    factory.loading.makeABTest = true;

    // Convert hours and minutes to milliseconds for easier conversion to Date object with 'new Date(milliseconds)'
    var millisecondsAfterStart = (factory.time.timeAfterStart.hours*60 + factory.time.timeAfterStart.minutes)*60*1000;
    
    var dataToServer = {
      abTestTitle: factory.abTestTitle,
      campaignId: factory.campaignId,
      startTime: factory.time.start,
      millisecondsStartTime: factory.time.start.getTime(),
      millisecondsAfterStart: millisecondsAfterStart,
      // Milliseconds to pick winner at for easier conversion to Date object 
      millisecondsPickWinner: factory.time.start.getTime() + millisecondsAfterStart,
      imagesAndReroutes: factory.imagesAndReroutes,
    };

    console.log('dataToServer', dataToServer);

    $http.post(
      appServerUrl+'/api/ab_tests',
      dataToServer
    ).success(function(data, status, headers, config) {
      factory.loading.makeABTest = false;
      // TODO: Change global appServerUrl properly
      var appServerUrl = 'http://clickaroos-email-server.azurewebsites.net';
      console.log('data from submit:', data);
      factory.productUrls.imageUrl = appServerUrl+'/img/ab/'+data.abTestId+'/'+data.emailVar;
      factory.productUrls.rerouteUrl = appServerUrl+'/site/ab/'+data.abTestId+'/'+data.emailVar;
      // console.log('factory.productUrls', factory.productUrls);

      var template = '<div class="dialog-contents">' +
                        '<h4>Your HTML tags have been created!</h4>' +
                        'Be sure to copy and paste the HTML snippet into your email campaign.' +
                        '<textarea style="display: block; margin: 10px auto; height: 75px; width: 95%;">' +
                          '<a href="'+ factory.productUrls.rerouteUrl + '">' +
                            '<img src="' + factory.productUrls.imageUrl + '" />' +
                          '</a>' +
                        '</textarea>' +
                        '<button class="btn btn-info" ui-sref="dashboard" ng-click="closeThisDialog()"><i style="margin-right: 10px;" class="glyphicon glyphicon-share-alt"></i>Back to my Dashboard</button>'
                      '</div>';
      
      ngDialog.open( {  template: template,
                        plain: true,
                        className: 'ngdialog-theme-default' } );

    }).error(function(data) {
      alert('There appears to be an error.\n'+data);
    });

  };

  //////////////////////////////////////////////////////
  // For ng-file-upload
  //

  factory.upload = $upload.upload;

  factory.onFileSelect = function($files) {
    factory.loading.uploadBlob = true;

    console.log('$files:', $files);
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {

      var file = $files[i];
      factory.upload = $upload.upload({
        url: appServerUrl+'/api/images',
        method: 'POST',
        file: file
      }).progress(function(evt) {
        // TODO: Make a loading bar for each image
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        factory.loading.uploadBlob = false;
        console.log('data', data);
        console.log('imageUrl', data.imageUrl);
        factory.addImageAndReroute(data.imageUrl);
      }).error(function(data) {
        factory.loading.uploadBlob = false;
        alert('There appears to be an error.\n'+data);
      });

    }

  };

  //
  // End ng-file-upload
  //////////////////////////////////////////////////////

  return factory;
}])

;
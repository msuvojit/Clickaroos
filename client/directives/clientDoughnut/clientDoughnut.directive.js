angular.module('clickaroos.directives.clientDoughnutDirective', [])

.directive('clientDoughnutDirective', [function() {
    return {
      restrict: 'A',
      
      scope: {
        //these options bind scope data to attributes on HTML element with directive attached
        data: '=ngModel',
        options: '=',
      },

      link: function(scope, element, attrs) {
        scope.$on('dataReady', function() {
          console.log('client doughnut directive');

          var ctx = element[0].getContext("2d");
          var counter = 0;
          var chartData = [];

        counter++;
      }
      
      //charttype-specific configuration options
      options = {
        segmentShowStroke : true,
        segmentStrokeColor : "#fff",
        segmentStrokeWidth : 2,
        percentageInnerCutout : 40,
        animationSteps : 80,
        animationEasing : "easeOutQuart",
        animateRotate : true,
        animateScale : false
      };
      
      // set chart dimensions
      ctx.canvas.width = 200;
      ctx.canvas.height= 200;

          var deviceDoughnut = new Chart(ctx).Doughnut(chartData, options, ctx);
        });
      }
    };
}]);

(function () {
  'use strict';

  // Historiaclinicas controller
  angular
    .module('historiaclinicas')
    .controller('HistoriaclinicasController', HistoriaclinicasController);

  HistoriaclinicasController.$inject = ['$timeout', '$scope', '$state', '$uibModal', '$window', 'Authentication', 'historiaclinicaResolve', 'Cie10presuntivoService', 'moment', 'Upload', 'Notification', '$compile'];

  function HistoriaclinicasController ($timeout, $scope, $state, $uibModal, $window, Authentication, historiaclinica, Cie10presuntivoService, moment, Upload, Notification, $compile) {
    var vm = this;
    console.log(historiaclinica);
    vm.authentication = Authentication;
    vm.historiaclinica = historiaclinica;
    vm.terapeuticaPodologica = historiaclinica.terapeuticapodologica;
    vm.indicacionesDerv = historiaclinica.indicaciones;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveTerapia = saveTerapia;
    vm.progress = 0;
    vm.picFile = [];
    vm.sexo = null;
    vm.terapodo = '';
    vm.indicaciones = '';
    vm.disableButton = true;
    vm.disablediv = true;
    Cie10presuntivoService.query(function(data){
      vm.cie10presuntivo = data;
    });
    vm.slickConfig = {
      enabled: true,
      autoplay: true,
      draggable: true,
      autoplaySpeed: 3000,
      slidesToShow: 6,
      infinite: true,
      method: {},
      event: {
          beforeChange: function (event, slick, currentSlide, nextSlide) {
          },
          afterChange: function (event, slick, currentSlide, nextSlide) {
          }
      }
  };
    vm._Index = 0;

    if (!vm.historiaclinica._id){
      vm.historiaclinica.fechaCreated = new Date();
      vm.disableButton = false;
      vm.disablediv = false;
      vm.showbuttonPaciente = true;
    } else {
      vm.showbuttonPaciente = false;
      vm.fullName = vm.historiaclinica.paciente.name + ' '+ vm.historiaclinica.paciente.lastName;
      vm.historiaclinica.fechaCreated = moment(vm.historiaclinica.fechaCreated).toDate();
      if(!vm.historiaclinica.paciente.sexo)  { vm.sexo = 'Masculino'} 
      else if (vm.historiaclinica.paciente.sexo){ vm.sexo = 'Femenino'}
      vm.picFile = vm.historiaclinica.fotos;
      vm.ci10diagpresuantivo = vm.historiaclinica.cie10presuntivo;
      vm.ci10diagdefinitivo = vm.historiaclinica.cie10definitivo;
      console.log(vm.historiaclinica)
    }

    // Remove existing Historiaclinica
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.historiaclinica.$remove($state.go('historiaclinicas.list'));
      }
    }

    // Save Historiaclinica
    function save() {
     // if (!isValid) {
     //   $scope.$broadcast('show-errors-check-validity', 'vm.form.historiaclinicaForm');
     //   return false;
     // }
      // TODO: move create/update logic to service
      if(vm.historiaclinica._id) {
      if(vm.terapodo != ''){
      vm.terapeuticaPodologica.push({
        descripcion : vm.terapodo,
        idhistoriaclinica: vm.historiaclinica._id,
        fecha : new Date()
      });
      vm.historiaclinica.terapeuticapodologica = vm.terapeuticaPodologica;
      }
      if(vm.indicaciones != ''){
      vm.indicacionesDerv.push({
        descripcion: vm.indicaciones,
        idhistoriaclinica: vm.historiaclinica._id,
        fecha: new Date()
      });
      vm.historiaclinica.indicaciones = vm.indicacionesDerv;
      }
      //vm.historiaclinica.cie10presuntivo = vm.ci10diagpresuantivo;
      //vm.historiaclinica.cie10definitivo = vm.ci10diagdefinitivo;
      }
      vm.historiaclinica.cie10presuntivo = vm.ci10diagpresuantivo;
      vm.historiaclinica.cie10definitivo = vm.ci10diagdefinitivo;
      if (vm.historiaclinica._id) {
        vm.historiaclinica.$update(successCallback, errorCallback);
      } else {
        vm.historiaclinica.$save(successCallback, errorCallback).then(upload(vm.picFile));
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Se guardó la Historia Clínica' });
        $timeout(function () {
          $state.go('historiaclinicas.list', {
            historiaclinicaId: res._id
          });
        }, 100);
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }
    }

    function saveTerapia(){
      vm.terapeuticaPodologica.push({
        descripcion : vm.terapodo,
        historiaclinica: vm.historiaclinica._id,
        fecha : new Date()
      });
      console.log(vm.terapeuticaPodologica);

      /*console.log(vm.terapeuticaPodologica)
      vm.terapeuticaPodologica.historiaClinica = vm.historiaclinica._id;
      vm.terapeuticaPodologica.$save(successCallback, errorCallback);

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Se guardó nueva Terapia Podológica' });
      }
      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }*/
    }

    vm.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    vm.openModalPaciente = function (type) {
      var openModal = $uibModal.open({
        templateUrl: '/modules/calendarios/client/views/list-pacientes-modal.client.view.html',
        controller: 'PacientesListModalController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal'
      });
      openModal.result.then(function (paciente) {
        vm.historiaclinica.paciente = paciente;
        vm.fullName = vm.historiaclinica.paciente.name + ' ' + vm.historiaclinica.paciente.lastName;
        if(!vm.historiaclinica.paciente.sexo)  { vm.sexo = 'Masculino'} 
        else if (vm.historiaclinica.paciente.sexo){ vm.sexo = 'Femenino'}
      });
    };


    function upload(dataUrl) {
      for (var i = 0; i < dataUrl.length; i++) {
        Upload.upload({
          url: '/api/historiaclinicas/picture',
          data: {
            newHCPicture: dataUrl[i]
          }
        }).then(function (response) {
          $timeout(function () {
            onSuccessItem(response.data);
          });
        }, function (response) {
          if (response.status > 0) onErrorItem(response.data);
        }, function (evt) {
          vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
        });
      };
        
      }  

    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully upload picture' });

      // Populate user object
      vm.historiaclinica = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed upload picture' });
    }

    /*vm.picFile = [

              {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
  
              {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
      
              {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
      
              {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
      
              {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
      
              {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'},
              {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'},
  
              {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
      
              {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
      
              {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
      
              {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
      
              {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
      
          ];*/
      

    vm.isActive = function (index) {
      return vm._Index === index;
    };
          // show prev image
    vm.showPrev = function () {
      vm._Index = (vm._Index > 0) ? --vm._Index : vm.picFile.length - 1;
    };
          // show next image
    vm.showNext = function () {
      vm._Index = (vm._Index < vm.picFile.length - 1) ? ++vm._Index : 0;
    };
          // show a certain image
    vm.showPhoto = function (index) {
      vm._Index = index;
    };
      
    vm.addDiv = function(){
      $("#parent1")
      .prepend($compile("<div class='form-group'><div class='row'><div class='col-sm-11'> <textarea id='terapeutica' type='text' class='form-control' rows='4' ng-model='vm.terapodo'></textarea></div></div></div>")($scope)); 
      
      $("#terapeutica").focus();
      vm.disableButton = false;
    }

    vm.addDivIndicaciones = function(){
      $("#parent2")
      .prepend($compile("<div class='form-group'><div class='row'><div class='col-sm-11'> <textarea id='indicaciones' type='text' class='form-control' rows='4' ng-model='vm.indicaciones'></textarea></div></div></div>")($scope)); 
      
      $("#indicaciones").focus();
    }

    vm.activeDiv = function(){
      vm.disablediv = false;
    }

  }
}());

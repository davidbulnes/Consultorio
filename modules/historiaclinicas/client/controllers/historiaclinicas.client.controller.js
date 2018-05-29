(function () {
  'use strict';

  // Historiaclinicas controller
  angular
    .module('historiaclinicas')
    .controller('HistoriaclinicasController', HistoriaclinicasController);

  HistoriaclinicasController.$inject = ['$timeout', '$scope', '$state', '$uibModal', '$window', 'Authentication', 'historiaclinicaResolve', 'Cie10presuntivoService', 'FotoshistoriaclinicaService', 'FotobynumerohcService', 'moment', 'Upload', 'Notification', '$compile', 'html2canvas-angular', '$mdSidenav'];

  function HistoriaclinicasController ($timeout, $scope, $state, $uibModal, $window, Authentication, historiaclinica, Cie10presuntivoService, FotoshistoriaclinicaService, FotobynumerohcService, moment, Upload, Notification, $compile, h2c, $mdSidenav) {
    var vm = this;
    console.log(historiaclinica);
    $window.scrollTo(0,0);
    vm.authentication = Authentication;
    vm.historiaclinica = historiaclinica;
    vm.terapeuticaPodologica = historiaclinica.terapeuticapodologica;
    vm.indicacionesDerv = historiaclinica.indicaciones;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.progress = 0;
    vm.picFile = [];
    vm.sexo = null;
    vm.terapodo = '';
    vm.indicaciones = '';
    vm.disableButtonTera = true;
    vm.disableButtonTera2 = true;
    vm.disableButtonIndi = true;
    vm.disableButtonIndi2 = true;
    vm.disabledivTerapeutica = true;
    vm.disabledivIndicaciones = true;
    vm.selecPaciente = false;
    vm.showVisor = false;
    vm.showDeleteImage = false;
    vm.estadosPaciente = [{value : 'En espera' , desc : 'En espera'}, {value: 'Curado', desc: 'Curado'}, {value: 'No Curado', desc: 'No Curado'}]
    vm.toggleRight = buildToggler('right');
    Cie10presuntivoService.query(function(data){
      vm.cie10presuntivo = data;
    });

    vm.isOpen = false;
    vm.selectedDirection = 'left';
    vm.selectedMode = 'md-fling';

    if (!vm.historiaclinica._id){
      vm.historiaclinica.fechaCreated = new Date();
      vm.disableButtonTera = false;
      vm.disableButtonTera2 = false;
      vm.disableButtonIndi = false;
      vm.disableButtonIndi2 = false;
      vm.disabledivTerapeutica = false;
      vm.disabledivIndicaciones = false;
      vm.showbuttonPaciente = true;
    } else {
      vm.showbuttonPaciente = false;
      vm.selecPaciente = true;
      vm.showVisor = true;
      vm.fullName = vm.historiaclinica.paciente.name + ' '+ vm.historiaclinica.paciente.lastName;
      vm.historiaclinica.fechaCreated = moment(vm.historiaclinica.fechaCreated).toDate();
      if(!vm.historiaclinica.paciente.sexo)  { vm.sexo = 'Masculino'} 
      else if (vm.historiaclinica.paciente.sexo){ vm.sexo = 'Femenino'}
      vm.picFile = vm.historiaclinica.fotos;
      vm.ci10diagpresuantivo = vm.historiaclinica.cie10presuntivo;
      vm.ci10diagdefinitivo = vm.historiaclinica.cie10definitivo;
      console.log(vm.historiaclinica)
    }

    vm.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
      };
    };

    vm.closeNav = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
    };

    // Remove existing Historiaclinica
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.historiaclinica.$remove($state.go('historiaclinicas.list'));
      }
    }

    // Save Historiaclinica
    function save(isValid) {
      var type;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.historiaclinicaForm');
        return false;
      }
      if(!vm.selecPaciente){
        Notification.warning({ message: '', title: '<i class="glyphicon glyphicon-remove"></i> Debe seleccionar un paciente' });
        return false;
      }
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
        type = true;
        vm.historiaclinica.$update(successCallback, errorCallback);
      } else {
        type = false;
        vm.historiaclinica.$save(successCallback, errorCallback).then(function(response){
          if(response){
          upload(vm.picFile)
        }});
      }

      function successCallback(res) {
        
        if(type){
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Se actualizó la Historia Clínica' });
          $state.go('historiaclinicas.list', {})
        } else{
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Se guardó la Historia Clínica' });
        }
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }
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
        if(paciente){
          vm.selecPaciente = true;       
        vm.historiaclinica.paciente = paciente;
        vm.fullName = vm.historiaclinica.paciente.name + ' ' + vm.historiaclinica.paciente.lastName;
        if(!vm.historiaclinica.paciente.sexo)  { vm.sexo = 'Masculino'} 
        else if (vm.historiaclinica.paciente.sexo){ vm.sexo = 'Femenino'}
      }
      });
    };


    function upload(dataUrl) {
        Upload.upload({
          url: '/api/picture',
          data: {
            newHCPicture: dataUrl
          }
        })
        $timeout(function(){
        $state.go('historiaclinicas.list', {})}, 1000)
        

  /*  function onSuccessItem(response) {

      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully upload picture' });

      // Populate user object
      //vm.historiaclinica = response;
      vm.fileSelected = false;
      vm.progress = 0;
    }

    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed upload picture' });
    }*/
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
      
    vm.addDiv = function(){
      $("#parent1")
      .prepend($compile("<div class='form-group'><div class='row'><div class='col-sm-10'> <textarea id='terapeutica' type='text' class='form-control' rows='4' ng-model='vm.terapodo'></textarea></div></div></div>")($scope)); 
      
      $("#terapeutica").focus();
      vm.disableButtonTera2 = false;
    }

    vm.addDivIndicaciones = function(){
      $("#parent2")
      .prepend($compile("<div class='form-group'><div class='row'><div class='col-sm-10'> <textarea id='indicaciones' type='text' class='form-control' rows='4' ng-model='vm.indicaciones'></textarea></div></div></div>")($scope)); 
      
      $("#indicaciones").focus();
      vm.disableButtonIndi2 = false;
    }

    vm.activeDivTerapeutica = function(){
      vm.disabledivTerapeutica = false;
    }

    vm.activeDivIndicaciones = function(){
      vm.disabledivIndicaciones = false;
    }


    vm.getFile = function(file){
      vm.picFileSelect = file;
      console.log(vm.picFileSelect);
    }

    vm.showDeleteImg = function(){
      vm.showDeleteImage = true;
    }
    
    vm.deleteImage = function(file){
      if ($window.confirm('Estás seguro de borrar esta imagen?')) {
        FotoshistoriaclinicaService.delete_photo({fotohistoriaId: file._id}, function(response){
          vm.picFile = [];
          vm.picFile = response;
        }, 
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Imagen borrada' }), function(response){response.data.message});
      };
    }

    vm.beforeChange = function(files){
      vm.picFileAdd = [];
      if ($window.confirm('Estás seguro de guardar estas imágenes?')) {
      vm.progress = 0;
      Upload.upload({
        url: '/api/picture',
        data: {
          newHCPicture: files
        }
      }).then(function (response) {
          onSuccessItem(response)
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
        
      }); 
     // onSuccessItem(); 
    }
    
    }

    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Imágenes guardadas con éxito' });
      vm.picFile = [];
      vm.picFile = response.data;
      console.log(response)
      //getPhotos();
      // Reset form
      //vm.fileSelected = false;
      vm.progress = 0;
    }

    function getPhotos(){
      console.log('paso')
      FotobynumerohcService.get({numeroHC : vm.historiaclinica.numeroHC}, function(response){
        vm.picFile = response;
      })
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Error en guardar imágenes' });
    }

    vm.showWarnigPaciente = function(){
      console.log('pasa')
      if(!vm.selecPaciente){
        Notification.warning({ message: '', title: '<i class="glyphicon glyphicon-remove"></i> Debe seleccionar un paciente' });
      }
    }

    vm.printHistoria = function(){
      //var innerContents = document.getElementById(printSectionId).innerHTML;
      var popupWinindow = window.open('', '_blank', 'width=auto,height=auto,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
     // popupWinindow.document.open();
    //  popupWinindow.document.write('<html><form onload="window.print()">' + innerContents + '</html>');
     // popupWinindow.document.close();
      h2c.renderBody().then(function(canvas){
        document.body.appendChild(canvas);
        popupWinindow.document.open();
        popupWinindow.document.write('<html><body onload="window.print()">' + popupWinindow.document.appendChild(document.getElementsByTagName('canvas')[0]) + '</html>')
        popupWinindow.document.close();
        console.log(document.getElementsByTagName('canvas')[0])
      });
    }
  }

}());

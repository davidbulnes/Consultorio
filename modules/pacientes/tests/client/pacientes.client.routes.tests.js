(function () {
  'use strict';

  describe('Pacientes Route Tests', function () {
    // Initialize global variables
    var $scope,
      PacientesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PacientesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PacientesService = _PacientesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('pacientes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/pacientes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PacientesController,
          mockPaciente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('pacientes.view');
          $templateCache.put('modules/pacientes/client/views/view-paciente.client.view.html', '');

          // create mock Paciente
          mockPaciente = new PacientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paciente Name'
          });

          // Initialize Controller
          PacientesController = $controller('PacientesController as vm', {
            $scope: $scope,
            pacienteResolve: mockPaciente
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:pacienteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.pacienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            pacienteId: 1
          })).toEqual('/pacientes/1');
        }));

        it('should attach an Paciente to the controller scope', function () {
          expect($scope.vm.paciente._id).toBe(mockPaciente._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/pacientes/client/views/view-paciente.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PacientesController,
          mockPaciente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('pacientes.create');
          $templateCache.put('modules/pacientes/client/views/form-paciente.client.view.html', '');

          // create mock Paciente
          mockPaciente = new PacientesService();

          // Initialize Controller
          PacientesController = $controller('PacientesController as vm', {
            $scope: $scope,
            pacienteResolve: mockPaciente
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.pacienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/pacientes/create');
        }));

        it('should attach an Paciente to the controller scope', function () {
          expect($scope.vm.paciente._id).toBe(mockPaciente._id);
          expect($scope.vm.paciente._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/pacientes/client/views/form-paciente.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PacientesController,
          mockPaciente;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('pacientes.edit');
          $templateCache.put('modules/pacientes/client/views/form-paciente.client.view.html', '');

          // create mock Paciente
          mockPaciente = new PacientesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paciente Name'
          });

          // Initialize Controller
          PacientesController = $controller('PacientesController as vm', {
            $scope: $scope,
            pacienteResolve: mockPaciente
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:pacienteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.pacienteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            pacienteId: 1
          })).toEqual('/pacientes/1/edit');
        }));

        it('should attach an Paciente to the controller scope', function () {
          expect($scope.vm.paciente._id).toBe(mockPaciente._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/pacientes/client/views/form-paciente.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

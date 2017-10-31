(function () {
  'use strict';

  describe('Cita Route Tests', function () {
    // Initialize global variables
    var $scope,
      CitaService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CitaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CitaService = _CitaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cita');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cita');
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
          CitaController,
          mockCitum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cita.view');
          $templateCache.put('modules/cita/client/views/view-citum.client.view.html', '');

          // create mock Citum
          mockCitum = new CitaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Citum Name'
          });

          // Initialize Controller
          CitaController = $controller('CitaController as vm', {
            $scope: $scope,
            citumResolve: mockCitum
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:citumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.citumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            citumId: 1
          })).toEqual('/cita/1');
        }));

        it('should attach an Citum to the controller scope', function () {
          expect($scope.vm.citum._id).toBe(mockCitum._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cita/client/views/view-citum.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CitaController,
          mockCitum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cita.create');
          $templateCache.put('modules/cita/client/views/form-citum.client.view.html', '');

          // create mock Citum
          mockCitum = new CitaService();

          // Initialize Controller
          CitaController = $controller('CitaController as vm', {
            $scope: $scope,
            citumResolve: mockCitum
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.citumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cita/create');
        }));

        it('should attach an Citum to the controller scope', function () {
          expect($scope.vm.citum._id).toBe(mockCitum._id);
          expect($scope.vm.citum._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cita/client/views/form-citum.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CitaController,
          mockCitum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cita.edit');
          $templateCache.put('modules/cita/client/views/form-citum.client.view.html', '');

          // create mock Citum
          mockCitum = new CitaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Citum Name'
          });

          // Initialize Controller
          CitaController = $controller('CitaController as vm', {
            $scope: $scope,
            citumResolve: mockCitum
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:citumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.citumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            citumId: 1
          })).toEqual('/cita/1/edit');
        }));

        it('should attach an Citum to the controller scope', function () {
          expect($scope.vm.citum._id).toBe(mockCitum._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cita/client/views/form-citum.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

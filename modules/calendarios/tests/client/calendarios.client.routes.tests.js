(function () {
  'use strict';

  describe('Calendarios Route Tests', function () {
    // Initialize global variables
    var $scope,
      CalendariosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CalendariosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CalendariosService = _CalendariosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('calendarios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/calendarios');
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
          CalendariosController,
          mockCalendario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('calendarios.view');
          $templateCache.put('modules/calendarios/client/views/view-calendario.client.view.html', '');

          // create mock Calendario
          mockCalendario = new CalendariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Calendario Name'
          });

          // Initialize Controller
          CalendariosController = $controller('CalendariosController as vm', {
            $scope: $scope,
            calendarioResolve: mockCalendario
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:calendarioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.calendarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            calendarioId: 1
          })).toEqual('/calendarios/1');
        }));

        it('should attach an Calendario to the controller scope', function () {
          expect($scope.vm.calendario._id).toBe(mockCalendario._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/calendarios/client/views/view-calendario.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CalendariosController,
          mockCalendario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('calendarios.create');
          $templateCache.put('modules/calendarios/client/views/form-calendario.client.view.html', '');

          // create mock Calendario
          mockCalendario = new CalendariosService();

          // Initialize Controller
          CalendariosController = $controller('CalendariosController as vm', {
            $scope: $scope,
            calendarioResolve: mockCalendario
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.calendarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/calendarios/create');
        }));

        it('should attach an Calendario to the controller scope', function () {
          expect($scope.vm.calendario._id).toBe(mockCalendario._id);
          expect($scope.vm.calendario._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/calendarios/client/views/form-calendario.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CalendariosController,
          mockCalendario;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('calendarios.edit');
          $templateCache.put('modules/calendarios/client/views/form-calendario.client.view.html', '');

          // create mock Calendario
          mockCalendario = new CalendariosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Calendario Name'
          });

          // Initialize Controller
          CalendariosController = $controller('CalendariosController as vm', {
            $scope: $scope,
            calendarioResolve: mockCalendario
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:calendarioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.calendarioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            calendarioId: 1
          })).toEqual('/calendarios/1/edit');
        }));

        it('should attach an Calendario to the controller scope', function () {
          expect($scope.vm.calendario._id).toBe(mockCalendario._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/calendarios/client/views/form-calendario.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

(function () {
  'use strict';

  describe('Fotoshistoria Route Tests', function () {
    // Initialize global variables
    var $scope,
      FotoshistoriaService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FotoshistoriaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FotoshistoriaService = _FotoshistoriaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('fotoshistoria');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/fotoshistoria');
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
          FotoshistoriaController,
          mockFotoshistorium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('fotoshistoria.view');
          $templateCache.put('modules/fotoshistoria/client/views/view-fotoshistorium.client.view.html', '');

          // create mock Fotoshistorium
          mockFotoshistorium = new FotoshistoriaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fotoshistorium Name'
          });

          // Initialize Controller
          FotoshistoriaController = $controller('FotoshistoriaController as vm', {
            $scope: $scope,
            fotoshistoriumResolve: mockFotoshistorium
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:fotoshistoriumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.fotoshistoriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            fotoshistoriumId: 1
          })).toEqual('/fotoshistoria/1');
        }));

        it('should attach an Fotoshistorium to the controller scope', function () {
          expect($scope.vm.fotoshistorium._id).toBe(mockFotoshistorium._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/fotoshistoria/client/views/view-fotoshistorium.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FotoshistoriaController,
          mockFotoshistorium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('fotoshistoria.create');
          $templateCache.put('modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html', '');

          // create mock Fotoshistorium
          mockFotoshistorium = new FotoshistoriaService();

          // Initialize Controller
          FotoshistoriaController = $controller('FotoshistoriaController as vm', {
            $scope: $scope,
            fotoshistoriumResolve: mockFotoshistorium
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.fotoshistoriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/fotoshistoria/create');
        }));

        it('should attach an Fotoshistorium to the controller scope', function () {
          expect($scope.vm.fotoshistorium._id).toBe(mockFotoshistorium._id);
          expect($scope.vm.fotoshistorium._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FotoshistoriaController,
          mockFotoshistorium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('fotoshistoria.edit');
          $templateCache.put('modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html', '');

          // create mock Fotoshistorium
          mockFotoshistorium = new FotoshistoriaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Fotoshistorium Name'
          });

          // Initialize Controller
          FotoshistoriaController = $controller('FotoshistoriaController as vm', {
            $scope: $scope,
            fotoshistoriumResolve: mockFotoshistorium
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:fotoshistoriumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.fotoshistoriumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            fotoshistoriumId: 1
          })).toEqual('/fotoshistoria/1/edit');
        }));

        it('should attach an Fotoshistorium to the controller scope', function () {
          expect($scope.vm.fotoshistorium._id).toBe(mockFotoshistorium._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

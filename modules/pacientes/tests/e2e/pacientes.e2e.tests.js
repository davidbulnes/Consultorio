'use strict';

describe('Pacientes E2E Tests:', function () {
  describe('Test Pacientes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pacientes');
      expect(element.all(by.repeater('paciente in pacientes')).count()).toEqual(0);
    });
  });
});

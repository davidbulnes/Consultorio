'use strict';

describe('Cita E2E Tests:', function () {
  describe('Test Cita page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cita');
      expect(element.all(by.repeater('citum in cita')).count()).toEqual(0);
    });
  });
});

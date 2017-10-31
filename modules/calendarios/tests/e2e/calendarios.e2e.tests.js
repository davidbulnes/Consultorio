'use strict';

describe('Calendarios E2E Tests:', function () {
  describe('Test Calendarios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/calendarios');
      expect(element.all(by.repeater('calendario in calendarios')).count()).toEqual(0);
    });
  });
});

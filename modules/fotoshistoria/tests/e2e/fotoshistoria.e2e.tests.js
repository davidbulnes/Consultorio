'use strict';

describe('Fotoshistoria E2E Tests:', function () {
  describe('Test Fotoshistoria page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/fotoshistoria');
      expect(element.all(by.repeater('fotoshistorium in fotoshistoria')).count()).toEqual(0);
    });
  });
});

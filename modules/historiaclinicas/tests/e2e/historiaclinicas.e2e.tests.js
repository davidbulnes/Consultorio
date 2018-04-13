'use strict';

describe('Historiaclinicas E2E Tests:', function () {
  describe('Test Historiaclinicas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/historiaclinicas');
      expect(element.all(by.repeater('historiaclinica in historiaclinicas')).count()).toEqual(0);
    });
  });
});

const { secondsToHms } = require('../source/monitors/secondsToHms');

test('secondsToHms converts 3661 seconds correctly', () => {
  expect(secondsToHms(3661)).toBe('1 hora, 1 minuto, 1 segundo.');
});

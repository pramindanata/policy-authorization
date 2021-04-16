import { Ability, AbilityFactory } from '../src';
import { Book, BookPolicy, User } from './fake';

jest.mock('../src/ability');

describe('# AbilityFactory', () => {
  let factory: AbilityFactory;
  let user: User;

  beforeEach(() => {
    (Ability as jest.Mock).mockClear();

    factory = new AbilityFactory({
      [Book.name]: BookPolicy,
    });

    user = new User({ id: 1, name: 'User', role: 'AUTHOR' });
  });

  describe('## create()', () => {
    it('should return Ability instance', () => {
      const ability = factory.createForUser(user);

      expect(ability).toBeInstanceOf(Ability);
    });

    it('should pass user and resolved policies dict to ability ctor', () => {
      const abilityCtorMock = Ability as jest.Mock;

      factory.createForUser(user);

      expect(abilityCtorMock.mock.calls[0][0]).toEqual(user);
      expect(abilityCtorMock.mock.calls[0][1]).toEqual({
        Book: new BookPolicy(),
      });
    });
  });
});

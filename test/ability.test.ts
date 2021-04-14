import {
  AbilityFactory,
  ActionNotFoundException,
  PolicyNotFoundException,
} from '../src';
import { Book, BookPolicy, User } from './fake';

describe('# Ability', () => {
  let factory: AbilityFactory;
  let user: User;
  let book: Book;

  beforeEach(() => {
    user = new User({ id: 1, name: 'User' });
    book = new Book({ id: 1, name: 'Book A', userId: user.id });

    factory = new AbilityFactory({
      [Book.name]: BookPolicy,
    });
  });

  describe('## can', () => {
    it('should return true on action "view" by passing subject name', () => {
      const ability = factory.create(user);
      const result = ability.can('view', 'Book');

      expect(result).toEqual(true);
    });

    it('should return true on action "view" by passing subject instance', () => {
      const ability = factory.create(user);
      const result = ability.can('view', book);

      expect(result).toEqual(true);
    });

    it('should return true on action "view" by passing subject constructor', () => {
      const ability = factory.create(user);
      const result = ability.can('view', Book);

      expect(result).toEqual(true);
    });

    it('should throw error if policy not found', () => {
      class OtherModel {}

      const ability = factory.create(user);
      const result = () => ability.can('view', OtherModel);

      expect(result).toThrow(PolicyNotFoundException);
    });

    it('should throw error if invalid action given', () => {
      const ability = factory.create(user);
      const result = () => ability.can('do-something', book);

      expect(result).toThrow(ActionNotFoundException);
    });

    it('should return true on action "update" with correct book', () => {
      const ability = factory.create(user);
      const result = ability.can('update', book);

      expect(result).toEqual(true);
    });

    it('should return false on action "update" with invalid book', () => {
      const ability = factory.create(user);
      const otherBook = new Book({ id: 1, name: 'Book B', userId: 200 });
      const result = ability.can('update', otherBook);

      expect(result).toEqual(false);
    });
  });

  describe('## cannot', () => {
    it('should call negative this.can()', () => {
      const ability = factory.create(user);
      const canMethodMockValue = true;

      jest.spyOn(ability, 'can').mockReturnValueOnce(canMethodMockValue);

      const result = ability.cannot('update', book);

      expect(result).toEqual(!canMethodMockValue);
      expect(ability.can).toHaveBeenCalled();
      expect(ability.can).toHaveBeenCalledWith('update', book);
    });
  });
});

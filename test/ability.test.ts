import {
  Ability,
  ActionNotFoundException,
  PolicyNotFoundException,
} from '../src';
import { Book, User } from './fake';

describe('# Ability', () => {
  let user: User;
  let book: Book;
  let bookPolicy: { before: jest.Mock; create: jest.Mock };

  beforeEach(() => {
    user = new User({ id: 1, name: 'User', role: 'AUTHOR' });
    book = new Book({ id: 1, name: 'Book A', userId: user.id });

    bookPolicy = {
      before: jest.fn(),
      create: jest.fn(),
    };
  });

  describe('## can', () => {
    it('should call action method', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      ability.can('create', Book);

      expect(bookPolicy.create).toHaveBeenCalled();
    });

    it('should return returned action method value', () => {
      const fakeResult = 'fakeResult';
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      bookPolicy.create.mockReturnValue(fakeResult);

      const result = ability.can('create', Book);

      expect(result).toEqual(fakeResult);
    });

    it('should throw error if policy not found', () => {
      class OtherModel {}
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      const result = () => ability.can('create', OtherModel);

      expect(result).toThrow(PolicyNotFoundException);
    });

    it('should throw error if invalid action given', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      const result = () => ability.can('do-something', book);

      expect(result).toThrow(ActionNotFoundException);
    });

    describe('### pass subject name', () => {
      it('should pass undefined subject model to action method', () => {
        const ability = new Ability(user, {
          [Book.name]: bookPolicy,
        });

        ability.can('create', 'Book');

        expect(bookPolicy.create.mock.calls[0][0]).toBe(user);
        expect(bookPolicy.create.mock.calls[0][1]).toBe(undefined);
      });
    });

    describe('### pass subject constructor', () => {
      it('should pass undefined subject model to action method', () => {
        const ability = new Ability(user, {
          [Book.name]: bookPolicy,
        });

        ability.can('create', Book);

        expect(bookPolicy.create.mock.calls[0][0]).toBe(user);
        expect(bookPolicy.create.mock.calls[0][1]).toBe(undefined);
      });
    });

    describe('### pass subject instance', () => {
      it('should pass user and subject instance to action method', () => {
        const ability = new Ability(user, {
          [Book.name]: bookPolicy,
        });

        ability.can('create', book);

        expect(bookPolicy.create.mock.calls[0][0]).toBe(user);
        expect(bookPolicy.create.mock.calls[0][1]).toBe(book);
      });
    });
  });

  describe('## cannot', () => {
    it('should return true if action is unauthorized', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(ability, 'can').mockReturnValue(false);
      const result = ability.cannot('create', book);

      expect(result).toEqual(true);
    });

    it('should return false if action is authorized', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(ability, 'can').mockReturnValue(true);
      const result = ability.cannot('create', book);

      expect(result).toEqual(false);
    });

    it('should call this.can()', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(ability, 'can');
      ability.cannot('create', book);

      const canMethodMock = ability.can as jest.Mock;

      expect(ability.can).toHaveBeenCalled();
      expect(canMethodMock.mock.calls[0][0]).toBe('create');
      expect(canMethodMock.mock.calls[0][1]).toBe(book);
    });
  });

  describe('## pre-authorization check', () => {
    it('should call before()', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(bookPolicy, 'before');
      ability.can('create', book);

      expect(bookPolicy.before).toHaveBeenCalled();
      expect(bookPolicy.before.mock.calls[0][0]).toBe(user);
      expect(bookPolicy.before.mock.calls[0][1]).toBe('create');
    });

    it('should return true if before() is authorized', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(bookPolicy, 'before').mockReturnValue(true);
      const result = ability.can('create', book);

      expect(result).toEqual(true);
    });

    it('should return false if before() is unauthorized', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      jest.spyOn(bookPolicy, 'before').mockReturnValue(false);
      const result = ability.can('create', book);

      expect(result).toEqual(false);
    });

    it('should not call any action method if before() is returning true', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      bookPolicy.before.mockReturnValue(true);
      ability.can('create', book);

      expect(bookPolicy.create).not.toHaveBeenCalled();
    });

    it('should not call any action method if before() is returning false', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      bookPolicy.before.mockReturnValue(false);
      ability.can('create', book);

      expect(bookPolicy.create).not.toHaveBeenCalled();
    });

    it('should call any action method if before() is returning undefined', () => {
      const ability = new Ability(user, {
        [Book.name]: bookPolicy,
      });

      bookPolicy.before.mockReturnValue(undefined);
      ability.can('create', book);

      expect(bookPolicy.create).toHaveBeenCalled();
    });
  });
});

import { AbilityFactory } from '../src';
import { Book, BookPolicy, User } from './fake';

describe('# Integration', () => {
  let factory: AbilityFactory;
  let user: User;
  let book: Book;

  beforeEach(() => {
    user = new User({ id: 1, name: 'User', role: 'AUTHOR' });
    book = new Book({ id: 1, name: 'Book A', userId: user.id });

    factory = new AbilityFactory({
      [Book.name]: BookPolicy,
    });
  });

  describe('## can', () => {
    it('should return true on action "create"', () => {
      const ability = factory.createForUser(user);
      const result = ability.can('create', Book);

      expect(result).toEqual(true);
    });

    it('should return true on action "update" with correct book', () => {
      const ability = factory.createForUser(user);
      const result = ability.can('update', book);

      expect(result).toEqual(true);
    });

    it('should return false on action "update" with invalid book', () => {
      const ability = factory.createForUser(user);
      const otherBook = new Book({ id: 1, name: 'Book B', userId: 200 });
      const result = ability.can('update', otherBook);

      expect(result).toEqual(false);
    });
  });

  describe('## cannot', () => {
    it('should return false on action "create"', () => {
      const ability = factory.createForUser(user);
      const result = ability.cannot('create', Book);

      expect(result).toEqual(false);
    });

    it('should return false on action "update" with correct book', () => {
      const ability = factory.createForUser(user);
      const result = ability.cannot('update', book);

      expect(result).toEqual(false);
    });

    it('should return true on action "update" with invalid book', () => {
      const ability = factory.createForUser(user);
      const otherBook = new Book({ id: 1, name: 'Book B', userId: 200 });
      const result = ability.cannot('update', otherBook);

      expect(result).toEqual(true);
    });
  });

  describe('## Pre-check authorization logic', () => {
    it('should return true on action "update" if user is an ADMIN with different book', () => {
      const admin = new User({ id: 1, name: 'Admin', role: 'ADMIN' });
      const otherBook = new Book({ id: 1, name: 'Book B', userId: 200 });
      const ability = factory.createForUser(admin);
      const result = ability.can('update', otherBook);

      expect(result).toEqual(true);
    });

    it('should return false on action "update" if user is an AUTHOR with different book', () => {
      const author = new User({ id: 1, name: 'Admin', role: 'AUTHOR' });
      const otherBook = new Book({ id: 1, name: 'Book B', userId: 200 });
      const ability = factory.createForUser(author);
      const result = ability.can('update', otherBook);

      expect(result).toEqual(false);
    });

    it('should return false on action "create" if user is an GUEST', () => {
      const author = new User({ id: 1, name: 'Admin', role: 'GUEST' });
      const ability = factory.createForUser(author);
      const result = ability.can('update', Book);

      expect(result).toEqual(false);
    });
  });
});

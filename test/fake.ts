import { WithPreCheck } from '../src';

export class User {
  id: number;
  name: string;
  role: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.role = props.role || 'AUTHOR';
  }
}

export class Book {
  id: number;
  name: string;
  userId: number;

  constructor(props: BookProps) {
    this.id = props.id;
    this.name = props.name;
    this.userId = props.userId;
  }
}

export class BookPolicy {
  viewAny(): boolean {
    return true;
  }

  view(): boolean {
    return true;
  }

  create(): boolean {
    return true;
  }

  update(user: User, book: Book): boolean {
    return user.id === book.userId;
  }

  delete(user: User, book: Book): boolean {
    return user.id === book.userId;
  }
}

export class BookPolicyWithBefore implements WithPreCheck<User> {
  before(user: User, action: string): boolean {
    return user.role === 'ADMIN';
  }

  create(): boolean {
    return false;
  }
}

export interface UserProps {
  id: number;
  name: string;
  role?: string;
}

export interface BookProps {
  id: number;
  name: string;
  userId: number;
}

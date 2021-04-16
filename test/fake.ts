import { WithPreCheck } from '../src';

export class User {
  id: number;
  name: string;
  role: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.role = props.role;
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

export class BookPolicy implements WithPreCheck {
  before(user: User): boolean | undefined {
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'GUEST') {
      return false;
    }
  }

  create(): boolean {
    return true;
  }

  update(user: User, book: Book): boolean {
    return user.id === book.userId;
  }
}

export interface UserProps {
  id: number;
  name: string;
  role: string;
}

export interface BookProps {
  id: number;
  name: string;
  userId: number;
}

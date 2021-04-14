export class User {
  id: number;
  name: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
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

export interface UserProps {
  id: number;
  name: string;
}

export interface BookProps {
  id: number;
  name: string;
  userId: number;
}

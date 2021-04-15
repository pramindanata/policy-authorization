# Policy Authorization

![Build Status](https://github.com/pramindanata/policy-authorization/actions/workflows/build.yml/badge.svg)

> Small policy based authorization library inspired from Laravel.

## Description

This library provides you a way to organize authorization logic around a particular subject. For example, if your application is a blog, you may have a `Post` class to represent you post data and a corresponding `PostPolicy` class to authorize user actions such as creating or updating posts. This library was inspired from [Laravel policies](https://laravel.com/docs/master/authorization#creating-policies) to handle authorization logic for corresponding data model.

There are 4 basic concept used in this library:

- `Action`: User action on a subject, for example: `view`, `create`, or `update`.
- `Subject`: The subject which you want to check user action on, for example a business entity (`User`, `Blog`, or `Product`).
- `Policy`: Describe and organize authorization logic of user actions on corresponding subject.
- `Ability`: It authorize user action on corresponding subject based on given policies.

## Installation

```bash
npm install policy-authorization
```

## Usage

### Example

```ts
import { Ability } from 'policy-authorization';

// Your user class
class User {
  id: number;
  name: string;

  constructor({ id: number, name: string }) {
    this.id = id;
    this.name = name;
  }
}

// Subject example
class Post {
  id: number;
  name: string;
  authorId: number

  constructor({ id: number, name: string, authorId: number }) {
    this.id = id;
    this.name = name;
    this.authorId = authorId;
  }
}

// Subject Policy
class PostPolicy {
  create(user: User, post: Post): boolean {
    return true;
  }

  update(user: User, post: Post): boolean {
    return user.id === post.authorId;
  }
}

// Setup user and subject instances
const user = new User({ id: 1, name: 'John' });
const postA = new Post({ id: 1, name: 'Post A', authorId, 1 });
const postB = new Post({ id: 1, name: 'Post B', authorId, 17 });

// Create ability for a user
const ability = new Ability(user, {
  [Post.name]: new PostPolicy()
});

// Result
ability.can('create', Post); // true
ability.can('update', postA); // true
ability.can('update', postB); // false, Post B has different `authorId`
ability.cannot('update', postB) // true
```

### Creating Policy Class

### Creating Ability

### Using Factory for Creating Ability

### Authorizing User Action

## API

### `Ability`

#### `.can(action: string, subject: Subject): boolean`

- `action`: User action, for example: `view`, `create`, or `update`.
- `subject`: The subject which you want to check user action on. It receives subject name, subject instance, or subject constructor.

Return `true` if user is authorized to do given action on given subject, otherwise return `false`.

#### `.cannot(action: string, subject: Subject): boolean`

- `action`: User action, for example: `view`, `create`, or `update`.
- `subject`: The subject which you want to check user action on. It receives subject name, subject instance, or subject constructor.

Return `true` if user is **not** authorized to do given action on given subject, otherwise return `false`.

### `AbilityFactory`

#### `.createForUser(user: Record<string, any>): Ability`

## License

[MIT](https://github.com/pramindanata/policy-authorization/blob/master/LICENSE)

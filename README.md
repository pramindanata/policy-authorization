# Policy Authorization

> Policy based authorization inspired from Laravel.

![Build Status](https://github.com/pramindanata/policy-authorization/actions/workflows/build.yml/badge.svg)

## Description

This library provides you a way to organize authorization logic around a particular subject. For example, if your application is a blog, you may have a `Post` class to represent you post data and a corresponding `PostPolicy` class to authorize user actions such as creating or updating posts. This library was inspired from [Laravel's policies](https://laravel.com/docs/master/authorization#creating-policies) to handle authorization logic for corresponding data model.

(WIP)

## Getting Started

### Installation

```bash
npm install policy-authorization
```

### Example

```ts
import { Ability, AbilityFactory } from 'policy-authorization';

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
const postA = new Post({id: 1, name: 'Post A', authorId, 1});
const postB = new Post({id: 1, name: 'Post B', authorId, 17});

// Create ability factory
const abilityFactory = new AbilityFactory({
  [Post.name]: PostPolicy
});

// Create ability for a user
const ability: Ability = abilityFactory.createForUser(user);

// Different ways to assign subject
ability.can('create', 'Post'); // By subject name
ability.can('create', Post); // By subject constructor
ability.can('update', postA); // By subject instance

// Result
ability.can('create', Post); // true
ability.can('update', postA); // true
ability.can('update', postB); // false, Post B has different `authorId`
ability.cannot('update', postB) // true
```

## API

(WIP)

## License

[MIT](https://github.com/pramindanata/policy-authorization/blob/master/LICENSE)

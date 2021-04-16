# Sand Castle

![Build Status](https://github.com/pramindanata/sand-castle/actions/workflows/build.yml/badge.svg)

> Small policy based authorization library inspired from Laravel.

## Description

This library provides you a way to organize authorization logic around a particular subject. For example, if your application is a blog, you may have a `Post` class to represent you post data and a corresponding `PostPolicy` class to authorize user actions such as creating or updating posts. This library was inspired from [Laravel policies](https://laravel.com/docs/master/authorization#creating-policies) to handle authorization logic for corresponding data model.

There are 4 basic concept used in this library:

- **Action**: User action on a subject, for example: `view`, `create`, or `update`.
- **Subject**: The subject which you want to check user action on, for example a business entity (`User`, `Blog`, or `Product`).
- **Policy**: Describe and organize authorization logic of user actions on corresponding subject.
- **Ability**: It authorize user action on corresponding subject based on given policies.

## Installation

```bash
npm install sand-castle
```

## Usage

### Example

```ts
import { Ability } from 'sand-castle';

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
ability.can('update', postB); // false, Post B has different `authorId`
ability.cannot('update', postB) // true
```

### Creating Policy Class

A subject only have 1 policy. Here is an example of policy class of subject `Post`:

```ts
class PostPolicy {
  viewAny(user: User, post: Post): boolean {
    return true;
  }
  
  view(user: User, post: Post): boolean {
    return true;
  }

  create(user: User, post: Post): boolean {
    return true;
  }

  update(user: User, post: Post): boolean {
    return user.id === post.authorId;
  }

  delete(user: User, post: Post): boolean {
    return user.id === post.authorId;
  }
}
```

Policy class only contains authorization logic of any actions on corresponding subject. Each action is represented as a method. Those methods receive user instance and subject instance as arguments. It must returns `true` to indicate user is authorized to do certain action, or `false` otherwise.

In the example above, `PostPolicy` has 5 actions (`viewAny`, `view`, `create`, `update`, and `delete`) for `Post` subject where `user` is the user instance and `post` is the subject instance.

### Perform Pre-authorization Check

You may want to skip any authorization logic within a policy if some conditions are met. For example, user with `ADMIN` role is allowed to do any action on `Post` subject. To do this, you can implement `WithPreCheck` interface on `Blog` policy and define a `before` method. `before` method will be executed before any other method on the policy. Here is the example:

```ts
import { Ability, WithPreCheck } from 'sand-castle';

class PostPolicy implements WithPreCheck {
  before(user: User, action: string): boolean | undefined{
    if (user.role === 'ADMIN') {
      return true;
    }

    if (user.role === 'GUEST') {
      return false;
    }
  }

  // other action methods
}
```

Other authorization checks will be skipped if `before` method returns `boolean`. If `undefined` is returned, the authorization check will fall through to the policy method.

### Creating Ability

To authorize user action you need to create `Ability` instance. Here is an example of creating `Ability instance`:

```ts
import { Ability } from 'sand-castle';

const ability = new Ability(user, {
  [Post.name]: new PostPolicy(),
  [Category.name]: new CategoryPolicy(),
});
```

`Ability` constructor needs 2 arguments: a user instance and an object contains policy instances. For the second argument, it is recommended to use subject constructor name as an object key.

`Ability` instance provides `can` and `cannot` methods to authorize user action on given subject.

### Using Factory for Creating Ability

You can also use `AbilityFactory` class to create `Ability` instance. Here is the example:

```ts
import { Ability, AbilityFactory } from 'sand-castle';

const factory = new AbilityFactory({
  [Post.name]: PostPolicy,
  [Category.name]: CategoryPolicy,
});

const ability: Ability = factory.createForUser(user);
```

`AbilityFactory` can't auto inject policy depedencies like example below:

```ts
class SomePolicy {
  // SomePolicy has 2 depedencies
  constructor (private depA: DepA, private depB: DepB) {}

  // Some action method
}
```

So, if you want to auto inject policy depedencies using a DI library then you must create your own factory.

### Authorizing User Action

You can use `ability.can` or `ability.cannot` method to authorize user action on given subject. Here is the example:

```ts
import { Ability } from 'sand-castle';

const ability = new Ability(/** */);

// Check if user is authorized
if (ability.can('update', data)) {
  // do something
}

// Check if user is unauthorized
if (ability.cannot('update', data)) {
  // do something
}
```

`ability.can` and `ability.cannot` accept `action` and `subject` as parameters. When `ability.can` or `ability.cannot` were called, `Ability` instance will try to find the given subject policy and call its action method with user instance and given subject as its parameters. It will throw `PolicyNotFoundException` if the given subject policy is not found and `ActionNotFoundException` if the policy has no the action method.

There are 3 ways to pass subject to `ability.can` and `ability.cannot`:

```ts
class Post {}

const post = new Post()

ability.can('some-action', 'Post'); // by subject name,
ability.can('some-action', post); // by subject instance,
ability.can('some-action', Post); // or by subject constructor
```

### Action without Subject Instance

If you pass subject name or subject constructor to `ability.can` or `ability.cannot`, its policy method...

(WIP)

## API

### `Ability`

#### `new Ability(user: Record<string, any>, subjectPolicyDict: SubjectPolicyDict)`

- `user`: User instance.
- `subjectPolicyDict`: Policy instances object.
  - `[key: string]`: Policy instance

```ts
new Ability(user, {
  [Post.name]: new PostPolicy(),
  [Category.name]: new CategoryPolicy(),
});
```

#### `.can(action: string, subject: Subject): boolean`

- `action`: User action, for example: `view`, `create`, or `update`.
- `subject`: The subject which you want to check user action on. It receives subject name, subject instance, or subject constructor.

Return `true` if user is authorized to do the action on given subject, otherwise return `false`.

#### `.cannot(action: string, subject: Subject): boolean`

- `action`: User action, for example: `view`, `create`, or `update`.
- `subject`: The subject which you want to check user action on. It receives subject name, subject instance, or subject constructor.

Return `true` if user is **not** authorized to do the action on given subject, otherwise return `false`.

### `AbilityFactory`

#### `new AbilityFactory(subjectPolicyCtorDict: SubjectPolicyCtorDict)`

- `SubjectPolicyCtorDict`: Policy constructors object
  - `[key: string]`: Policy constructor

```ts
new AbilityFactory({
  [Post.name]: PostPolicy,
  [Category.name]: CategoryPolicy,
});
```

#### `.createForUser(user: Record<string, any>): Ability`

- `user`: User object.

Return `Ability` instance.

## License

[MIT](https://github.com/pramindanata/sand-castle/blob/master/LICENSE)

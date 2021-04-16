const express = require('express')
const { Ability } = require('policy-authorization')

const app = express()

app.get('/', (req, res) => {
  return res.json({
    message: 'hello'
  })
})

// Will return 200
app.post('/post', auth(), (req, res) => {
  const { ability } = req

  if (ability.cannot('create', Post)) {
    return res.status(403).json({
      message: 'Unauthorized'
    })
  }

  return res.json({
    message: 'Yay, post created'
  })
})

// Will return 403 because user updating other user post
app.put('/post/:id', auth(), (req, res) => {
  const { ability } = req
  const post = new Post({ id: 1, name: 'Post A', authorId: 122 })

  if (ability.cannot('update', post)) {
    return res.status(403).json({
      message: 'Unauthorized'
    })
  }

  return res.json({
    message: 'Yay, post updated'
  })
})

app.listen(4000, () => {
  console.log(`listening on port ${4000}`)
})

class User {
  id
  name

  constructor({ id, name }) {
    this.id = id
    this.name = name
  }
}

class Post {
  id
  name
  authorId

  constructor({ id, name, authorId }) {
    this.id = id
    this.name = name
    this.authorId = authorId
  }
}

class PostPolicy {
  create(user) {
    return true
  }

  update(user, post) {
    return user.id === post.authorId;
  }
}

function auth() {
  return (req, res, next) => {
    const token = req.headers['token']

    if (token && token === 'token') {
      const user = new User({ id: 1, name: 'User' })

      req.user = user
      req.ability = new Ability(user, {
        [Post.name]: new PostPolicy()
      })

      return next()
    }

    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }
}
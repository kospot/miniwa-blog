---
layout: PostLayout
title: Egg-Sequelize食用指南
date: 2024-07-25
tags: ['js原理']
summary: 当我还是个孩子时，我对世界的理解感到最困惑的是：回报的超线性程度。老师和教练暗示我们，回报是线性的。“你付出多少，就得到多少。”这种说法我听过无数次。他们出于好意，但这几乎从未是真实的。如果你的产品只有竞争对手的一半好，你不会得到一半的客户。你一个客户也得不到，最终会破产。
---

#### 引言

Sequelize 是一个基于 Node.js 的 ORM 库。Egg-Sequelize 是基于 egg 框架封装 Sequelize 的一个插件。有了它，我们就可以通过对象的形式操作数据库。

---

#### Egg-Sequelize 的用途和优势

Egg-Sequelize 可以让我们方便地使用和操作数据库，其支持以下功能：

1. **简化数据库操作**：通过 ORM（对象关系映射），开发者无需编写复杂的 SQL 语句。
2. **模型定义和管理**：通过模型定义数据库表结构，并使用模型方法进行数据操作。
3. **数据验证和关联**：在模型中定义数据验证规则和表之间的关系，确保数据一致性和完整性。
4. **事务管理**：支持数据库事务，确保数据操作的原子性。

有了它我们通过简单的模型定义，可以快速进行 CRUD 操作。且数据模型和业务逻辑分离，代码更加清晰、易于维护。同时它还支持多种数据库（如 MySQL、PostgreSQL、SQLite），提高数据库迁移的便利性。

---

#### Egg-Sequelize 的基本使用方式

##### 1. 安装和配置

首先，安装所需的包：

```bash
npm install --save egg-sequelize sequelize mysql2
```

在 `config/plugin.js` 中启用插件：

```javascript
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
}
```

在 `config/config.default.js` 中配置数据库连接：

```javascript
exports.sequelize = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'test',
  username: 'root',
  password: 'yourpassword',
}
```

##### 2. 定义模型

在 `app/model` 目录下定义模型文件，例如 `user.js`：

```javascript
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    age: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  })

  return User
}
```

这里主要声明表的结构以及字段的类型，Sequelize 内置了多种字段类型

**字符串类型**

- STRING：可变长度字符串，默认长度为 255。
- STRING(length)：指定长度的可变字符串，例如 STRING(100)。
- TEXT：可变长度文本，不限制长度。
- CHAR(length)：定长字符串，例如 CHAR(10)。

**数值类型**

- INTEGER：整数。
- BIGINT：大整数。
- FLOAT：浮点数。
- REAL：双精度浮点数。
- DOUBLE：双精度浮点数。
- DECIMAL：高精度定点数。

**日期时间类型**

- DATE：日期时间类型。
- DATEONLY：仅日期类型，不包含时间部分。
- TIME：仅时间类型，不包含日期部分。

**布尔类型**

- BOOLEAN：布尔类型，true 或 false。

**二进制类型**

- BLOB：二进制大对象。

##### 3. 使用模型

在控制器中使用模型进行数据库操作，例如 `app/controller/user.js`：

```javascript
const Controller = require('egg').Controller

class UserController extends Controller {
  async index() {
    const users = await this.ctx.model.User.findAll()
    this.ctx.body = users
  }

  async create() {
    const { name, age } = this.ctx.request.body
    const user = await this.ctx.model.User.create({ name, age })
    this.ctx.body = user
  }
}

module.exports = UserController
```

模型定义好后，我们就可以使用对象的 api 去调用数据库方法了。上面这里只是一个列子，实际应用中最好不要直接在 controller 里去做数据查询。

需要注意的是，sequelize 会自动添加 createdAt 和 updatedAt 字段，如果不需要可以设置`timestamps: false`选项

```
const OperatorLog = app.model.define('OperatorLog', {
    ...
  }, {
    timestamps: false,
    tableName: 'tb_operator_log',
  });
```

---

#### 复杂用法解析

##### 1. 复杂查询

Sequelize 提供了丰富的查询选项，支持复杂的查询条件和关联查询。例如，查询年龄大于 30 的用户：

```javascript
const users = await this.ctx.model.User.findAll({
  where: {
    age: {
      [Op.gt]: 30,
    },
  },
})
```

##### 2. 事务管理

在处理多个数据库操作时，事务管理可以确保数据的一致性和完整性。例如，在创建用户和关联数据时使用事务：

```javascript
const transaction = await this.ctx.model.transaction()
try {
  const user = await this.ctx.model.User.create({ name, age }, { transaction })
  await this.ctx.model.Profile.create({ userId: user.id, bio }, { transaction })
  await transaction.commit()
} catch (err) {
  await transaction.rollback()
  throw err
}
```

##### 3. 数据验证

Sequelize 提供了丰富的数据验证选项，可以在模型中定义。例如，验证用户名长度：

```javascript
const User = app.model.define('user', {
  name: {
    type: STRING(30),
    validate: {
      len: [2, 30],
    },
  },
})
```

##### 4. 数据库迁移

通过 Sequelize 的迁移工具，可以方便地管理数据库的变更。例如，创建一个用户表的迁移文件：

```bash
npx sequelize migration:create --name create-user
```

在生成的迁移文件中定义变更：

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  },
}
```

##### 5. 数据关联

定义模型之间的关系，例如用户和角色的多对多关系：

```javascript
const User = app.model.define('user', {
  /*...*/
})
const Role = app.model.define('role', {
  /*...*/
})

User.belongsToMany(Role, { through: 'UserRole' })
Role.belongsToMany(User, { through: 'UserRole' })
```

在使用时进行关联查询：

```javascript
const users = await this.ctx.model.User.findAll({
  include: [
    {
      model: this.ctx.model.Role,
      through: {
        attributes: [],
      },
    },
  ],
})
```

---

#### 注意事项总结

在实际项目中使用 Sequelize 时，开发者可能会遇到一些常见的坑和问题。了解这些坑并采取相应的措施可以帮助避免潜在的问题。以下是一些常见的坑：

### 1. **未处理事务错误**

如果事务中发生错误，没有正确处理和回滚事务，会导致数据不一致。

**解决方案**：始终在事务中捕获错误并进行回滚。

```javascript
const transaction = await sequelize.transaction()
try {
  // Your transactional operations
  await transaction.commit()
} catch (error) {
  await transaction.rollback()
  throw error
}
```

### 2. **未正确处理并发**

在高并发场景下，可能会遇到数据竞争问题，导致数据不一致或丢失。

**解决方案**：使用锁（如行级锁）或乐观锁来处理并发问题。

```javascript
const user = await User.findByPk(1, { lock: true, transaction })
```

### 3. **N+1 查询问题**

当进行关联查询时，容易导致大量的数据库查询，影响性能。

**解决方案**：使用 `include` 进行预加载，减少数据库查询次数。

```javascript
const users = await User.findAll({
  include: [{ model: Profile }],
})
```

### 4. **错误的查询优化**

没有充分利用数据库索引和优化查询，可能导致性能问题。

**解决方案**：使用 `raw` 查询进行复杂查询，并确保数据库索引的合理性。

```javascript
const users = await sequelize.query('SELECT * FROM users WHERE age > ?', {
  replacements: [30],
  type: sequelize.QueryTypes.SELECT,
})
```

### 5. **模型同步问题**

在生产环境中直接使用 `sync` 方法同步模型，可能导致数据丢失。

**解决方案**：在开发环境中使用 `sync`，在生产环境中使用迁移工具管理数据库变更。

```javascript
await sequelize.sync({ force: false })
```

### 6. **未处理数据库连接问题**

未处理数据库连接的断开和重连问题，可能导致应用程序崩溃。

**解决方案**：使用连接池并处理连接事件。

```javascript
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

sequelize.authenticate().catch((err) => {
  console.error('Unable to connect to the database:', err)
})
```

### 7. **未处理时间戳问题**

未正确处理时间戳格式，可能导致时区问题和数据不一致。

**解决方案**：使用统一的时间戳格式，并在数据库和应用层处理时区问题。

```javascript
const User = sequelize.define(
  'user',
  {
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: true,
    timezone: '+00:00',
  }
)
```

### 8. **错误的数据验证**

在模型中未定义或错误定义数据验证规则，可能导致不符合预期的数据写入数据库。

**解决方案**：在模型中定义详细的验证规则。

```javascript
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
})
```

### 9. **过度依赖自动生成的 SQL**

过度依赖 Sequelize 自动生成的 SQL 语句，可能导致复杂查询性能低下。

**解决方案**：在必要时使用自定义查询来优化性能。

```javascript
const users = await sequelize.query('SELECT * FROM users WHERE age > ?', {
  replacements: [30],
  type: sequelize.QueryTypes.SELECT,
})
```

### 10. **缺乏适当的测试**

缺乏对数据库操作的充分测试，可能导致隐藏的错误。

**解决方案**：编写单元测试和集成测试，确保数据库操作的正确性。

```javascript
describe('User model', () => {
  it('should create a user', async () => {
    const user = await User.create({ name: 'John', age: 25 })
    expect(user.name).to.equal('John')
  })
})
```

通过了解和避免这些常见的坑，可以大大提高 Sequelize 在实际项目中的使用效果，确保应用程序的稳定性和性能。

#### 结论

Egg-Sequelize 作为 Egg.js 和 Sequelize 的结合体，为开发者提供了强大的数据库操作能力。通过合理使用其基本功能和复杂用法，可以大大提高开发效率和代码质量。在实际项目中，注意性能优化、安全性和数据库设计等方面，可以更好地发挥 Egg-Sequelize 的优势，为项目保驾护航。

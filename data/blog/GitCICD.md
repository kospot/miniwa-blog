---
layout: PostLayout
title: GitCICD
date: 2024-07-24 09:49:07
tags: ['js原理']
summary: ### GitLab CI/CD 简介与使用指南



#### 引言

GitLab CI/CD 是 GitLab 提供的一套强大工具，帮助开发者自动化构建、测试和部署过程。借助 GitLab CI/CD 我们可以轻松实现系统的自动化构建和部署。

#### GitLab CI/CD 的功能及效果

GitLab CI/CD 提供了自动化的构建、测试和部署流程，从而确保代码变更可以迅速且稳定地集
---

### GitLab CI/CD 简介与使用指南

#### 引言

GitLab CI/CD 是 GitLab 提供的一套强大工具，帮助开发者自动化构建、测试和部署过程。借助 GitLab CI/CD 我们可以轻松实现系统的自动化构建和部署。

#### GitLab CI/CD 的功能及效果

GitLab CI/CD 提供了自动化的构建、测试和部署流程，从而确保代码变更可以迅速且稳定地集成到主代码库并交付给用户。它的主要功能包括：

- **自动化构建**：每次代码提交后，GitLab CI/CD 自动拉取代码并进行构建。
- **自动化测试**：在构建后立即运行测试，确保代码变更不会破坏现有功能。
- **持续交付**：构建和测试成功后，自动部署代码到预生产或生产环境。

#### CI/CD 的组成及配置文件格式

GitLab CI/CD 是一个强大的持续集成和持续交付工具，其中 **job** 和 **pipeline** 是两个核心概念。了解它们之间的关系对于有效地配置和管理 CI/CD 流程至关重要。

**Job**

在 GitLab CI/CD 中，**job** 是最基本的执行单元。每个 job 都定义了一个独立的任务，可以是代码编译、测试、部署等。job 的配置包括脚本、依赖、环境变量等。

```yaml
job_name:
  script:
    - echo "This is a job"
```

**Pipeline** 是由一系列 jobs 组成的执行流程，用于完成整个 CI/CD 流程。Pipeline 定义了多个阶段（stages），每个阶段包含一个或多个 jobs。这些阶段按顺序执行，而同一阶段中的 jobs 并行执行。

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Building the project"

test_job:
  stage: test
  script:
    - echo "Testing the project"

deploy_job:
  stage: deploy
  script:
    - echo "Deploying the project"
```

**阶段（Stages）**

Pipeline 通过 stages 将 jobs 组织起来，每个 stage 包含一个或多个 jobs。同一 stage 中的 jobs 并行执行，而不同 stages 之间按顺序执行。

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - npm install

unit_test_job:
  stage: test
  script:
    - npm test

deploy_job:
  stage: deploy
  script:
    - npm run deploy
```

在上述例子中，`build_job` 在 `build` stage 执行，`unit_test_job` 在 `test` stage 执行，`deploy_job` 在 `deploy` stage 执行。`build` stage 完成后，才会开始 `test` stage，`test` stage 完成后，才会开始 `deploy` stage。

Job 之间可以通过 artifacts 和 dependencies 来建立依赖关系。例如，一个 job 生成的文件可以通过 artifacts 保存并供后续 job 使用。

```yaml
build_job:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

test_job:
  stage: test
  script:
    - npm test
  dependencies:
    - build_job
```

在上述例子中，`build_job` 生成的 `dist/` 目录作为 artifacts 保存，`test_job` 可以通过 dependencies 使用这些 artifacts。

Job 可以设置条件执行，例如只在特定分支、特定环境或满足某些条件时执行。

```yaml
build_job:
  stage: build
  script:
    - npm install
    - npm run build
  only:
    - master

deploy_job:
  stage: deploy
  script:
    - npm run deploy
  only:
    - tags
```

在上述例子中，`build_job` 只在 `master` 分支执行，`deploy_job` 只在打标签时执行。

- **Job** 是 GitLab CI/CD 中的基本执行单元，每个 job 执行一个独立的任务。
- **Pipeline** 是由多个 stages 和 jobs 组成的执行流程，通过 stages 组织 jobs 的执行顺序。
- Jobs 在同一 stage 中并行执行，不同 stages 按顺序执行。
- Jobs 之间可以通过 artifacts 和 dependencies 建立依赖关系，并且可以设置条件执行。

以下是一个完整的 .gitlab-ci.yml 配置示例，展示了如何定义和组织 jobs 和 pipeline：

```yaml
stages:
  - build
  - test
  - deploy

variables:
  NODE_ENV: 'production'

before_script:
  - npm install

build_job:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

lint_job:
  stage: test
  script:
    - npm run lint

unit_test_job:
  stage: test
  script:
    - npm test
  dependencies:
    - build_job

integration_test_job:
  stage: test
  script:
    - npm run test:integration
  dependencies:
    - build_job

deploy_job:
  stage: deploy
  script:
    - npm run deploy
  only:
    - master
```

在这个示例中，pipeline 包含四个 stages：`build`、`test` 和 `deploy`。每个 stage 包含一个或多个 jobs，且 `build_job` 生成的 artifacts 被 `unit_test_job` 和 `integration_test_job` 作为依赖使用。

通过合理地配置 jobs 和 pipelines，可以实现高效的持续集成和持续交付流程，提高开发和部署的效率。希望这些信息对你在 GitLab CI/CD 的使用中有所帮助。

#### 调试 GitLab CI/CD

本地调试 `.gitlab-ci.yml` 文件有助于在将配置提交到 GitLab 之前发现并解决问题。这可以节省时间并避免破坏共享的 CI/CD 环境。下面介绍几种常见的方法，帮助你在本地调试 GitLab CI/CD 配置。

**1. 使用 Docker 本地调试**

GitLab Runner 提供了 `docker` 执行器，可以在本地使用 Docker 容器运行 CI/CD 作业。

**1.1 安装 Docker**

确保已在本地安装 Docker。如果没有安装，可以参考 [Docker 官方安装指南](https://docs.docker.com/get-docker/)。

**1.2 使用 Docker 运行 GitLab Runner**

```bash
docker run -it --rm \
  -v $(pwd):/builds/project_name \
  -w /builds/project_name \
  gitlab/gitlab-runner:latest exec docker job_name
```

在上述命令中：

- `-v $(pwd):/builds/project_name` 将当前目录挂载到 Docker 容器中的 `/builds/project_name`。
- `-w /builds/project_name` 设置工作目录为 `/builds/project_name`。
- `gitlab/gitlab-runner:latest exec docker job_name` 使用 GitLab Runner 的最新镜像运行指定的 job。

**2. 使用 GitLab Runner 本地调试**

你可以在本地安装 GitLab Runner，并使用它直接执行 `.gitlab-ci.yml` 文件中的 jobs。

**2.1 安装 GitLab Runner**

根据你的操作系统，按照 [GitLab Runner 官方安装指南](https://docs.gitlab.com/runner/install/) 安装 GitLab Runner。

**2.2 本地执行 jobs**

1. **初始化 GitLab Runner**：
   在你的项目根目录下，创建 `config.toml` 文件，并配置 Runner。例如：

```toml
[[runners]]
  name = "local-runner"
  url = "https://gitlab.com/"
  token = "your-token"
  executor = "shell"
  [runners.custom_build_dir]
  [runners.cache]
```

2. **本地运行 job**：

```bash
gitlab-runner exec shell job_name
```

这个命令会在当前目录下执行 `.gitlab-ci.yml` 中的 `job_name`。

**3. 使用 CI/CD 模拟工具**

使用 `act`可以模拟 GitLab CI/CD 环境并在本地运行和调试 `.gitlab-ci.yml` 文件。

`act` 是一个开源工具，允许你在本地运行 GitHub Actions 工作流，但它也可以用来模拟 GitLab CI/CD 流程。

1. **安装 `act`**：

```bash
brew install act
```

2. **配置 `.actrc`**：

在项目根目录下创建 `.actrc` 文件，并添加 GitLab Runner 的配置。例如：

```ini
-D GITLAB_CI=true
-D CI_PROJECT_DIR=/path/to/your/project
```

3. **运行 `act`**：

```bash
act -j job_name
```

本地调试 `.gitlab-ci.yml` 文件可以显著提高 CI/CD 配置的开发效率，并减少在共享环境中调试的问题。通过使用 Docker 或本地 GitLab Runner，你可以快速测试和验证 CI/CD 配置。结合日志输出和调试工具，可以更轻松地发现和解决问题，确保最终提交的配置是正确且稳定的。

#### 示例项目：Vue 3 + Egg + TypeScript

下面我们通过一个具体示例，演示如何为 Vue 3 + Egg + TypeScript 项目配置 GitLab CI/CD。

项目结构：

```
my-project/
├── frontend/
│   ├── package.json
│   └── ...
└── backend/
    ├── package.json
    └── ...
```

`.gitlab-ci.yml` 文件：

```yaml
stages:
  - frontend_build
  - backend_build
  - test
  - deploy

frontend_build:
  stage: frontend_build
  script:
    - cd frontend
    - npm install
    - npm run build

backend_build:
  stage: backend_build
  script:
    - cd backend
    - npm install
    - npm run build

test:
  stage: test
  script:
    - cd frontend
    - npm run test
    - cd ../backend
    - npm run test

deploy:
  stage: deploy
  script:
    - echo "Deploying to production server"
```

#### 项目实践中的注意事项

##### **环境隔离**

在不同的环境（开发、测试、生产）中使用不同的配置，以确保每个环境下的行为一致。

在 GitLab CI/CD 中，不同环境的隔离是确保在开发、测试和生产环境中代码行为一致的重要步骤。以下是一些常见的方法和最佳实践，帮助你在 CI/CD 流程中实现环境隔离。

GitLab CI/CD 提供了内置的环境支持，可以为不同的阶段配置不同的环境，例如 `development`、`staging` 和 `production`。你可以在 `.gitlab-ci.yml` 文件中为每个任务（job）指定不同的环境。

示例：

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  environment: development

test:
  stage: test
  script:
    - npm run test
  environment: staging

deploy:
  stage: deploy
  script:
    - npm run deploy
  environment: production
```

环境变量是实现环境隔离的一种有效方式。你可以在 GitLab 项目设置中为不同的环境配置不同的变量，这些变量会在 CI/CD 流程中被自动注入。

配置环境变量：

1. 进入 GitLab 项目页面。
2. 点击左侧菜单的 `Settings` -> `CI / CD`。
3. 展开 `Variables` 部分，添加所需的环境变量。

示例：

```yaml
stages:
  - build
  - test
  - deploy

variables:
  NODE_ENV: development

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - NODE_ENV=staging npm run test

deploy:
  stage: deploy
  script:
    - NODE_ENV=production npm run deploy
```

在一些项目中，可能需要使用不同的配置文件来区分环境。例如，你可以为不同的环境创建不同的配置文件，并在 CI/CD 流程中根据环境选择合适的文件。

项目结构：

```
my-project/
├── config/
│   ├── development.json
│   ├── staging.json
│   └── production.json
├── package.json
└── ...
```

`.gitlab-ci.yml` 文件：

```yaml
stages:
  - build
  - test
  - deploy

variables:
  CONFIG_FILE: config/development.json

build:
  stage: build
  script:
    - npm install
    - npm run build -- --config $CONFIG_FILE

test:
  stage: test
  variables:
    CONFIG_FILE: config/staging.json
  script:
    - npm run test -- --config $CONFIG_FILE

deploy:
  stage: deploy
  variables:
    CONFIG_FILE: config/production.json
  script:
    - npm run deploy -- --config $CONFIG_FILE
```

在实现环境隔离的同时，可以通过 CICD 执行不同的脚本，实现不同的部署策略，如滚动更新（在不中断服务的情况下，逐步将新版本的应用程序部署到生产环境中）、蓝绿部署（逐步放量的发布策略）等，以确保在不同环境中代码的稳定性和可靠性。

##### **缓存依赖**

利用 GitLab CI/CD 的缓存功能，加速构建过程。

GitLab CI/CD 缓存功能允许在不同的构建之间共享依赖项或编译产物。这意味着在一次构建中生成的文件可以在后续的构建中重用，从而避免重复下载或编译，节省时间和资源。

缓存功能通过 `.gitlab-ci.yml` 文件进行配置。以下是一些关键配置项：

1. **Cache 关键字**：
   - **key**：定义缓存的唯一标识符，支持字符串、变量和文件名。
   - **paths**：指定需要缓存的文件或目录路径。
   - **policy**：指定缓存策略，包括 `pull-push`（默认）、`push` 和 `pull`。

```yaml
cache:
  key: my-cache
  paths:
    - node_modules/
    - .cache/
  policy: pull-push
```

2. **Global Cache 配置**：
   - 可以在 `.gitlab-ci.yml` 文件的全局部分配置缓存，这样所有的 job 都可以共享这些配置。

```yaml
cache:
  paths:
    - node_modules/
    - .cache/
```

3. **Job-specific Cache 配置**：
   - 可以在单独的 job 中配置缓存，以覆盖全局配置。

```yaml
job_name:
  script:
    - npm install
  cache:
    key: job-cache
    paths:
      - node_modules/
      - .cache/
```

以下是缓存功能在实际应用中的一些场景和注意事项：

**依赖管理**：缓存 Node.js 项目的 `node_modules` 目录，以避免每次构建都重新下载依赖。

```yaml
cache:
  key: npm-cache
  paths:
    - node_modules/

build:
  script:
    - npm install
    - npm run build
```

**定制缓存策略**：根据项目需求定制缓存策略，如仅在特定分支上使用缓存，或者在特定条件下更新缓存。

```yaml
cache:
  key: $CI_COMMIT_REF_SLUG
  paths:
    - build/

build:
  script:
    - ./gradlew build
  only:
    - master
```

注意事项

1. **缓存的有效期**：

   - GitLab 默认缓存的有效期为两周。可以根据项目需求调整缓存的有效期。

2. **缓存的大小限制**：

   - 单个缓存不能超过 500MB。需要确保缓存内容不会超出限制。

3. **缓存冲突**：

   - 使用唯一的缓存键可以避免不同 job 之间的缓存冲突。

4. **调试缓存**：
   - 可以通过查看构建日志中的缓存相关信息来调试缓存问题，确保缓存的生成和恢复符合预期。

GitLab CI/CD 的缓存功能通过共享构建间的文件和依赖，有效提升了构建效率和速度。在配置缓存时，需要根据项目的具体需求，合理设置缓存的路径、键和值，避免缓存冲突和超出大小限制。通过正确使用缓存功能，可以显著优化 CI/CD 流程，提高开发和交付的效率。

希望这些信息能帮助你更好地理解和使用 GitLab CI/CD 的缓存功能。如果需要更详细的示例或有具体的问题，欢迎进一步交流。

##### **安全性**

保护敏感信息，如 API 密钥和数据库密码，可以使用 GitLab 的 CI/CD 秘密变量（Secret Variables）。

#### 结论

GitLab CI/CD 是一个强大且灵活的工具，可以大大提高软件开发过程的效率和可靠性。通过理解其基本组成、配置文件格式以及调试方法，再结合实际项目中的应用，你可以轻松地将 CI/CD 流程集成到自己的项目中，从而实现持续集成和持续交付的目标。希望本文的介绍和示例能为你在实际项目中使用 GitLab CI/CD 提供帮助。

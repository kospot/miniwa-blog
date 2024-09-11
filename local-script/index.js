const TOKEN =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJOekF3TkRNPSIsImlzcyI6IjkwYjlhNjNjODFjYzYzNTg4NDg2IiwiaWF0IjoxNzI1NDk4MTUxLCJhdWQiOiJtZG5pY2UtYXBpIiwiZXhwIjoxNzI4MDkwMTUxLCJuYmYiOjE3MjU0OTgxNTF9.05EfUWlRFuwpIVWDvKrEYEt4Nmt5VwGGHGWZiWelWYA'
async function fetchArticles() {
  const response = await fetch('https://api.mdnice.com/articles/search', {
    method: 'POST',
    headers: {
      accept: 'application/json, text/plain, */*',
      authorization: TOKEN,
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ currentPage: 1, pageSize: 40, catalogId: 72771 }),
  })
  const res = await response.json()
  return res.data.articleList
}

async function fetchArticleDetails(outId) {
  const response = await fetch(`https://api.mdnice.com/articles/${outId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json, text/plain, */*',
      authorization: TOKEN,
    },
  })
  return await response.json()
}

function generateMarkdown(data) {
  const markdownContent = `---
layout: PostLayout
title: ${data.title}
date: ${data.createTime}
tags: ['js原理']
summary: ${data.markdown.slice(0, 200)}
---

${data.markdown}`

  return markdownContent
}

const whiteList = [
  '正确的固执',
  '用Zustand实现组件级状态管理的最佳实践',
  'Zustand：状态持久化在项目中的应用',
  'Langchain.js如何实现RAG',
  'Langchain.js你应该知多点',
  'Nodejs-child_process模块解读',
  '如何实现深拷贝？structuredClone',
  'TypeScript进阶：解锁对象键迭代的隐藏技巧',
  '聊聊Nodejs里的Async&Await',
  '如何调试Docker里运行的node应用',
  '每个JavaScript开发者必须知道的五大Navigator API特性',
  '全新全网最全的NPM发包教程',
  '详解 dotenv 的使用与实现',
  'Eric关于AI的访谈火了',
  'GitCICD',
]

function convertToSlug(title) {
  title = title.replace(/[：“”《》:]/g, '')
  const pinyin = require('pinyin')
  return pinyin
    .default(title, {
      style: 'normal', // 使用普通风格
      heteronym: true, // 不使用多音字
      // segment: true // 将中文分词
    })
    .flat()
    .map((word) => word.replace(/[\u0300-\u036f]/g, '').trim())
    .join('-')
}

async function main() {
  const articles = await fetchArticles()
  for (const article of articles) {
    if (whiteList.includes(article.title)) {
      // 替换为您要筛选的标题
      const details = await fetchArticleDetails(article.outId)
      const markdown = generateMarkdown(details.data)
      // 生成文件（假设使用fs模块）
      console.log(details.data.title)
      const fs = require('fs')
      const fileName = convertToSlug(details.data.title)
      console.log(fileName)
      fs.writeFileSync(`./${fileName}.md`, markdown)
    }
  }
}

main()

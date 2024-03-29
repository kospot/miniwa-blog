var discuss = (function () {
  'use strict'
  var e = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACAD'
  function t() {}
  function n(e, t) {
    for (const n in t) e[n] = t[n]
    return e
  }
  function o(e) {
    return e()
  }
  function i() {
    return Object.create(null)
  }
  function s(e) {
    e.forEach(o)
  }
  function r(e) {
    return 'function' == typeof e
  }
  function l(e, t) {
    return e != e ? t == t : e !== t || (e && 'object' == typeof e) || 'function' == typeof e
  }
  let c, a
  function m(e, t) {
    return c || (c = document.createElement('a')), (c.href = t), e === c.href
  }
  function d(e, n, o) {
    e.$$.on_destroy.push(
      (function (e, ...n) {
        if (null == e) return t
        const o = e.subscribe(...n)
        return o.unsubscribe ? () => o.unsubscribe() : o
      })(n, o)
    )
  }
  function u(e) {
    const t = {}
    for (const n in e) '$' !== n[0] && (t[n] = e[n])
    return t
  }
  function p(e) {
    return null == e ? '' : e
  }
  function f(e, t) {
    e.appendChild(t)
  }
  function g(e, t, n) {
    const o = (function (e) {
      if (!e) return document
      const t = e.getRootNode ? e.getRootNode() : e.ownerDocument
      if (t && t.host) return t
      return e.ownerDocument
    })(e)
    if (!o.getElementById(t)) {
      const e = w('style')
      ;(e.id = t),
        (e.textContent = n),
        (function (e, t) {
          f(e.head || e, t), t.sheet
        })(o, e)
    }
  }
  function v(e, t, n) {
    e.insertBefore(t, n || null)
  }
  function h(e) {
    e.parentNode.removeChild(e)
  }
  function b(e, t) {
    for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t)
  }
  function w(e) {
    return document.createElement(e)
  }
  function y(e) {
    return document.createElementNS('http://www.w3.org/2000/svg', e)
  }
  function x(e) {
    return document.createTextNode(e)
  }
  function D() {
    return x(' ')
  }
  function $(e, t, n, o) {
    return e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o)
  }
  function k(e, t, n) {
    null == n ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n)
  }
  function C(e, t) {
    for (const n in t) k(e, n, t[n])
  }
  function z(e, t) {
    ;(t = '' + t), e.wholeText !== t && (e.data = t)
  }
  function E(e, t) {
    e.value = null == t ? '' : t
  }
  function L(e, t) {
    return new e(t)
  }
  function A(e) {
    a = e
  }
  function S() {
    if (!a) throw new Error('Function called outside component initialization')
    return a
  }
  function M(e) {
    S().$$.on_mount.push(e)
  }
  function T(e) {
    S().$$.after_update.push(e)
  }
  function _() {
    const e = S()
    return (t, n, { cancelable: o = !1 } = {}) => {
      const i = e.$$.callbacks[t]
      if (i) {
        const s = (function (e, t, { bubbles: n = !1, cancelable: o = !1 } = {}) {
          const i = document.createEvent('CustomEvent')
          return i.initCustomEvent(e, n, o, t), i
        })(t, n, { cancelable: o })
        return (
          i.slice().forEach((t) => {
            t.call(e, s)
          }),
          !s.defaultPrevented
        )
      }
      return !0
    }
  }
  function N(e, t) {
    const n = e.$$.callbacks[t.type]
    n && n.slice().forEach((e) => e.call(this, t))
  }
  const O = [],
    j = [],
    P = [],
    R = [],
    I = Promise.resolve()
  let q = !1
  function H() {
    q || ((q = !0), I.then(V))
  }
  function B(e) {
    P.push(e)
  }
  const U = new Set()
  let F = 0
  function V() {
    const e = a
    do {
      for (; F < O.length; ) {
        const e = O[F]
        F++, A(e), G(e.$$)
      }
      for (A(null), O.length = 0, F = 0; j.length; ) j.pop()()
      for (let e = 0; e < P.length; e += 1) {
        const t = P[e]
        U.has(t) || (U.add(t), t())
      }
      P.length = 0
    } while (O.length)
    for (; R.length; ) R.pop()()
    ;(q = !1), U.clear(), A(e)
  }
  function G(e) {
    if (null !== e.fragment) {
      e.update(), s(e.before_update)
      const t = e.dirty
      ;(e.dirty = [-1]), e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(B)
    }
  }
  const Y = new Set()
  let J
  function W() {
    J = { r: 0, c: [], p: J }
  }
  function Q() {
    J.r || s(J.c), (J = J.p)
  }
  function K(e, t) {
    e && e.i && (Y.delete(e), e.i(t))
  }
  function X(e, t, n, o) {
    if (e && e.o) {
      if (Y.has(e)) return
      Y.add(e),
        J.c.push(() => {
          Y.delete(e), o && (n && e.d(1), o())
        }),
        e.o(t)
    } else o && o()
  }
  function Z(e, t) {
    const n = {},
      o = {},
      i = { $$scope: 1 }
    let s = e.length
    for (; s--; ) {
      const r = e[s],
        l = t[s]
      if (l) {
        for (const e in r) e in l || (o[e] = 1)
        for (const e in l) i[e] || ((n[e] = l[e]), (i[e] = 1))
        e[s] = l
      } else for (const e in r) i[e] = 1
    }
    for (const e in o) e in n || (n[e] = void 0)
    return n
  }
  function ee(e) {
    e && e.c()
  }
  function te(e, t, n, i) {
    const { fragment: l, after_update: c } = e.$$
    l && l.m(t, n),
      i ||
        B(() => {
          const t = e.$$.on_mount.map(o).filter(r)
          e.$$.on_destroy ? e.$$.on_destroy.push(...t) : s(t), (e.$$.on_mount = [])
        }),
      c.forEach(B)
  }
  function ne(e, t) {
    const n = e.$$
    null !== n.fragment &&
      (s(n.on_destroy),
      n.fragment && n.fragment.d(t),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []))
  }
  function oe(e, n, o, r, l, c, m, d = [-1]) {
    const u = a
    A(e)
    const p = (e.$$ = {
      fragment: null,
      ctx: [],
      props: c,
      update: t,
      not_equal: l,
      bound: i(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(n.context || (u ? u.$$.context : [])),
      callbacks: i(),
      dirty: d,
      skip_bound: !1,
      root: n.target || u.$$.root,
    })
    m && m(p.root)
    let f = !1
    if (
      ((p.ctx = o
        ? o(e, n.props || {}, (t, n, ...o) => {
            const i = o.length ? o[0] : n
            return (
              p.ctx &&
                l(p.ctx[t], (p.ctx[t] = i)) &&
                (!p.skip_bound && p.bound[t] && p.bound[t](i),
                f &&
                  (function (e, t) {
                    ;-1 === e.$$.dirty[0] && (O.push(e), H(), e.$$.dirty.fill(0)),
                      (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31)
                  })(e, t)),
              n
            )
          })
        : []),
      p.update(),
      (f = !0),
      s(p.before_update),
      (p.fragment = !!r && r(p.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const e = (function (e) {
          return Array.from(e.childNodes)
        })(n.target)
        p.fragment && p.fragment.l(e), e.forEach(h)
      } else p.fragment && p.fragment.c()
      n.intro && K(e.$$.fragment), te(e, n.target, n.anchor, n.customElement), V()
    }
    A(u)
  }
  class ie {
    $destroy() {
      ne(this, 1), (this.$destroy = t)
    }
    $on(e, n) {
      if (!r(n)) return t
      const o = this.$$.callbacks[e] || (this.$$.callbacks[e] = [])
      return (
        o.push(n),
        () => {
          const e = o.indexOf(n)
          ;-1 !== e && o.splice(e, 1)
        }
      )
    }
    $set(e) {
      var t
      this.$$set &&
        ((t = e), 0 !== Object.keys(t).length) &&
        ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1))
    }
  }
  const se = []
  function re(e, n = t) {
    let o
    const i = new Set()
    function s(t) {
      if (l(e, t) && ((e = t), o)) {
        const t = !se.length
        for (const t of i) t[1](), se.push(t, e)
        if (t) {
          for (let e = 0; e < se.length; e += 2) se[e][0](se[e + 1])
          se.length = 0
        }
      }
    }
    return {
      set: s,
      update: function (t) {
        s(t(e))
      },
      subscribe: function (r, l = t) {
        const c = [r, l]
        return (
          i.add(c),
          1 === i.size && (o = n(s) || t),
          r(e),
          () => {
            i.delete(c), 0 === i.size && (o(), (o = null))
          }
        )
      },
    }
  }
  function le(e) {
    return e instanceof Element
  }
  function ce(e) {
    return 'string' == typeof e
  }
  function ae(e, t) {
    var n = document.createElement(e)
    return t && (n.className = t), n
  }
  function me(e, t) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', e)
    for (var o in t) n.setAttribute(o, t[o])
    return n
  }
  function de(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
    if (!(t < -1))
      for (var n = 0, o = t; o < e.length; o++) {
        var i = e[o]
        if (i) {
          var s = e[o - 1]
          s && (n = parseInt(s.style.top) + parseInt(s.offsetHeight)),
            (i.style.zIndex = i._msg.zIndex + o),
            (i.style.top = i._msg.offset + n + 'px')
        }
      }
  }
  var ue = '_msg-opacity',
    pe = [],
    fe = ['info', 'success', 'warn', 'error'],
    ge = ae('style')
  function ve(e) {
    ce(e) && (e = { text: e })
    var t = Object.assign({ type: fe[0], text: '', offset: 20, duration: 3e3 }, e),
      n = t.text,
      o = t.type,
      i = t.zIndex,
      s = t.offset,
      r = t.duration,
      l = t.customClass,
      c = t.html,
      a = t.showClose,
      m = t.onClose,
      d = t.appendTo,
      u = ae(
        'div',
        '_msg _msg-'
          .concat(o, ' ')
          .concat(ue, ' ')
          .concat(l || '')
      )
    ;(u.id = (function (e) {
      e = e || 10
      for (
        var t = function () {
            return Math.random().toString(36).slice(2)
          },
          n = t();
        n.length < e;

      )
        n += t()
      return n.slice(0, e)
    })()),
      (u._msg = {}),
      (u._msg.zIndex = i || ve.zIndex),
      (u._msg.offset = s),
      pe.push(u),
      setTimeout(function () {
        u.classList.remove(ue)
      }, 100),
      r &&
        ((u._msg.t = setTimeout(function () {
          we(u, m)
        }, r)),
        (u.onmouseenter = function () {
          clearTimeout(u._msg.t)
        }),
        (u.onmouseleave = function () {
          u._msg.t = setTimeout(function () {
            we(u, m)
          }, r)
        }))
    var p,
      f = ae('p')
    if ((u.appendChild(f), c ? (f.innerHTML = n) : (f.innerText = n), a || !r)) {
      var g = (function () {
        var e = me('svg', {
            width: '16px',
            height: '16px',
            stroke: 'currentColor',
            viewBox: '0 0 16 16',
            'stroke-linecap': 'round',
          }),
          t = me('line', { x1: -7, y1: -7, x2: 6, y2: 6, transform: 'translate(8.5 8.5)' }),
          n = me('line', { x1: 6, y1: -7, x2: -7, y2: 6, transform: 'translate(8.5 8.5)' })
        return e.appendChild(t), e.appendChild(n), e
      })()
      ;(g.onclick = function () {
        clearTimeout(u._msg.t), (u.onmouseenter = u.onmouseleave = g.onclick = null), we(u, m)
      }),
        u.appendChild(g)
    }
    le(d) ? (p = d) : ce(d) && (p = document.querySelector(d)),
      le(p) || (p = document.body),
      p.appendChild(u),
      de(pe)
  }
  ;(ge.textContent =
    '._msg{left:50%;color:#909399;font-size:14px;width:300px;padding:16px 17px;position:fixed;line-height:1;letter-spacing:1px;word-wrap:break-word;word-break:break-all;border-radius:6px;border:1px solid #edf2fc;background-color:#edf2fc;transform:translateX(-50%);transition:opacity 0.3s,transform 0.5s,top 0.5s;}._msg p{margin:0;font-size:14px;padding-right:16px;}._msg svg{top:50%;right:15px;cursor:pointer;position:absolute;transform:translateY(-50%);}._msg-opacity{opacity:0;transform:translate(-50%,-100%);}._msg-success{background-color:#e1f3d8;border-color:#e1f3d8;color:#67c23a;}._msg-warn{background-color:#fdfce6;border-color:#fdfce6;color:#e6a23c;}._msg-error{background-color:#fef0f0;border-color:#fef0f0;color:#f56c6c;}'),
    document.head.appendChild(ge),
    (ve.zIndex = 1)
  var he = function (e) {
    ve[fe[e]] = function (t) {
      ce(t) ? (t = { text: t, type: fe[e] }) : (t.type = fe[e]), ve(t)
    }
  }
  for (var be in fe) he(be)
  function we(e, t) {
    var n = pe.findIndex(function (t) {
      return t.id === e.id
    })
    pe.splice(n, 1),
      de(pe, n),
      'function' == typeof t && t(),
      e.classList.add(ue),
      setTimeout(function () {
        e.parentElement.removeChild(e)
      }, 400)
  }
  ve.destroyAll = function () {
    for (
      var e = function (e) {
          var t = pe[e]
          clearTimeout(t._msg.t),
            t.classList.add(ue),
            setTimeout(function () {
              t.parentElement.removeChild(t)
            }, 400)
        },
        t = 0;
      t < pe.length;
      t++
    )
      e(t)
    pe.length = 0
  }
  const ye = re({}),
    xe = re(function (e) {
      const t = [...document.body.querySelectorAll('*')].map(
        (e) => +window.getComputedStyle(e).zIndex || 0
      )
      ;(e.zIndex = Math.max(...t) + 1), ve(e)
    }),
    De = re(function () {
      document.querySelectorAll('img[d-src]').forEach((e) => {
        new IntersectionObserver((e, t) => {
          e.forEach((e) => {
            if (e.isIntersecting) {
              const n = e.target,
                o = n.getAttribute('d-src')
              n.setAttribute('src', o), t.disconnect()
            }
          })
        }).observe(e)
      })
    })
  function $e(e) {
    g(
      e,
      'svelte-19e5lik',
      ':root{--D-main-Color:#f4645f;--D-stick-Color:#ff81aa;--D-Height-Color:rgba(128, 128, 128, 0.8);--D-Centre-Color:rgba(128, 128, 128, 0.5);--D-Low-Color:rgba(128, 128, 128, 0.2)}#Discuss *{box-sizing:border-box}#Discuss [disabled],#Discuss [disabled]:hover{opacity:0.5;cursor:not-allowed;cursor:no-drop}.D-zIndex{z-index:-1 !important}.D-svg{display:flex;width:inherit;height:inherit}.D-loading-comments{display:flex;margin:60px 0;justify-content:center}.D-loading-comments svg{width:auto;height:50px}.D-link{color:#00c4b6;text-decoration:none}.D-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.D-btn{display:flex;align-items:center;justify-content:center;opacity:0.9;outline:none;line-height:1;width:auto;height:28px;cursor:pointer;text-align:center;font-weight:600;padding:6px;font-size:14px;color:#606266;border:1px solid #dcdfe6;background:#fff;transition:0.1s;border-radius:4px;box-sizing:border-box;white-space:nowrap;user-select:none}.D-select-none{user-select:none}.D-btn:hover{opacity:1}.D-btn-main{color:#fff;border-color:var(--D-main-Color);background-color:var(--D-main-Color)}#Discuss .D-disabled-click{cursor:not-allowed;cursor:no-drop}.D-disabled,.D-disabled:hover{opacity:0.5}#Discuss .D-comment-emot{width:32px;height:auto;margin:-1px 1px 0;vertical-align:middle}.D-loading-svg{animation:D-rotate-animation 0.8s linear infinite}.D-zoom{animation:D-zoom-animation 0.3s forwards}.D-shrink{animation:D-shrink-animation 0.5s forwards}@keyframes D-rotate-animation{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes D-zoom-animation{0%{opacity:0;transform:scale(0.7)}100%{opacity:1;visibility:visible;transform:scale(1)}}@keyframes D-shrink-animation{0%{opacity:1;transform:scale(1)}100%{opacity:0;visibility:hidden;transform:scale(0.7)}}'
    )
  }
  class ke extends ie {
    constructor(e) {
      super(), oe(this, e, null, null, l, {}, $e)
    }
  }
  var Ce = {
      nick: '昵称',
      mail: '邮箱',
      site: '网址',
      content: '评论你的想法~',
      cancel: '取消',
      preview: '预览',
      send: '发送',
      comment: '条评论',
      master: '博主',
      stick: '置顶',
      reply: '回复',
      timeAgo: { now: '刚刚', minutes: '分钟前', hours: '小时前', days: '天前' },
      pleaseLogin: '请登录后再使用管理员邮箱评论',
      sendError: '评论失败~',
      more: '更多评论',
      moreCommentsChild: '展开剩余的$counter条回复评论',
      notComments: '没有评论',
      commentsAudit: '您的评论可能需要通过审核后才能显示',
      commentsError: '获取评论失败~',
      settingMsg: '正在加载管理面板...',
      refreshMsg: '正在刷新评论...',
      admin: {
        login: {
          login: '登录',
          close: '关闭',
          username: '用户名',
          password: '密码',
          msg: '自动登录中...',
          loginError: '用户名或密码错误',
        },
        manage: {
          comment: {
            msg: '自动获取评论中...',
            text: '评论管理',
            save: '保存',
            time: '时间',
            path: '路径',
            total: '共',
            bar: '条',
            page: '页',
            search: {
              text: '搜索',
              close: '关闭',
              title: '搜索评论',
              options: {
                all: '全部',
                ip: 'IP',
                nick: '昵称',
                mail: '邮箱',
                site: '网址',
                content: '内容',
                path: '路径',
              },
            },
            batch: {
              operateMsg: '至少选择一条评论',
              operate: {
                default: '默认',
                accept: '通过',
                audit: '审核',
                spam: '垃圾',
                delete: '删除',
              },
            },
            operate: {
              stick: '置顶',
              accept: '通过',
              audit: '审核',
              edit: '编辑',
              spam: '垃圾',
              delete: '删除',
            },
            options: {
              current: '当前页',
              accept: '已通过',
              audit: '待审核',
              spam: '垃圾',
              master: '我的',
            },
          },
          config: {
            msg: '自动获取配置中...',
            error: '获取配置失败',
            text: '配置管理',
            save: '保存',
            passwordError: '密码不一致',
            settings: {
              basic: {
                name: '基本配置',
                user: { title: '用户名', desc: '登录用户名', ph: '名称' },
                mail: { title: '管理员邮箱', desc: '确认管理员身份', ph: 'mail@example.com' },
                domain: {
                  title: '安全域名',
                  desc: '限制其他第三方网站请求进行拦截(多个使用逗号分隔)',
                  ph: 'example.com,www.example.com',
                },
                headers: {
                  title: '请求头优先级',
                  desc: '为确保获取的用户IP的真实性(多个使用逗号分隔)',
                  ph: 'headers.cf-connecting-ip',
                },
              },
              commentHandle: {
                name: '评论处理',
                count: { title: '评论数', desc: '每次获取多少条评论', ph: 6 },
                word: {
                  title: '字数限制',
                  desc: '评论内容,昵称,邮箱,网址 (以英文逗号分割，只输入一个0代表所有不限制)',
                  ph: 0,
                },
                limit: { title: '限制', desc: '限制10分钟内，每个IP能评论多少条', ph: 0 },
                limitAll: {
                  title: '限制所有人',
                  desc: '限制所有人10分钟内，所有IP能评论多少条',
                  ph: 0,
                },
                cdn: {
                  title: '头像CDN',
                  desc: '评论头像CDN地址',
                  ph: 'https://cn.gravatar.com/avatar/',
                },
                akismet: { title: 'Akismet', desc: '垃圾评论检测处理', ph: 'Akismet Key' },
              },
              mail: {
                name: '邮件提醒',
                site: {
                  title: '网站地址',
                  desc: '邮件内快速跳转到网站评论区',
                  ph: 'https://blog.example.com',
                },
                server: {
                  title: '服务端地址',
                  desc: '评论系统服务端地址(与客户端的serverURLs一致)',
                  ph: 'https://server-discuss.example.com',
                },
                host: { title: '服务商主机', desc: '例如: 腾讯企业主机', ph: 'smtp.exmail.qq.com' },
                port: { title: '服务商主机端口', desc: '例如: 腾讯企业主机端口', ph: 465 },
                from: { title: '发件人', ph: '例如: server@example.com' },
                accept: { title: '授权码或密码', desc: '每个服务商各有不同' },
                Msubject: {
                  title: '邮件标题(管理员)',
                  desc: '管理员收到的评论邮件标题',
                  ph: '您在「Discuss 官网」上有新的评论啦！',
                },
                Rsubject: {
                  title: '邮件标题(评论者)',
                  desc: '其他人收到的评论标题',
                  ph: '您在「Discuss 官网」上有新的评论回复啦！',
                },
                Mtemplate: { title: '邮件模板(管理员)', desc: '管理员收到的评论邮件模板' },
                Rtemplate: { title: '邮件模板(评论者)', desc: '其他人收到的评论模板' },
              },
              password: { name: '修改密码', pwd: '新密码', cfm: '确认密码' },
            },
          },
        },
      },
    },
    ze = {
      nick: 'Nick',
      mail: 'Mail',
      site: 'Site',
      content: 'Comment your thoughts~',
      cancel: 'Cancel',
      preview: 'Preview',
      send: 'Send',
      comment: 'Comments',
      master: 'Admin',
      stick: 'Top',
      reply: 'Reply',
      timeAgo: { now: 'Just now', minutes: 'Minutes ago', hours: 'Hours ago', days: 'Days ago' },
      pleaseLogin: 'Please log in and then use the admin email to comment',
      sendError: 'Comment failed~',
      more: 'More',
      moreCommentsChild: 'Expand the remaining $counter reply comments',
      notComments: 'Not Comments',
      commentsAudit: 'Your comment may need to be moderated before it can be displayed',
      commentsError: 'Failed to get comments~',
      settingMsg: 'Loading admin panel...',
      refreshMsg: 'Refreshing comments...',
      admin: {
        login: {
          login: 'Sign in',
          close: 'Close',
          username: 'Username',
          password: 'Password',
          msg: 'Automatic login in progress...',
          loginError: 'User name or password error',
        },
        manage: {
          comment: {
            msg: 'Get comments automatically...',
            text: 'Comments',
            save: 'Save',
            time: 'Time',
            path: 'Path',
            total: '',
            bar: 'entries',
            page: 'Page',
            search: {
              text: 'Search',
              close: 'Close',
              title: 'Search Comments',
              options: {
                all: 'All',
                ip: 'IP',
                nick: 'Nick',
                mail: 'Mail',
                site: 'Site',
                content: 'Content',
                path: 'Path',
              },
            },
            batch: {
              operateMsg: 'Select at least one comment',
              operate: {
                default: 'Default',
                accept: 'Accept',
                audit: 'Audit',
                spam: 'Spam',
                delete: 'Delete',
              },
            },
            operate: {
              stick: 'Top',
              accept: 'Accept',
              audit: 'Audit',
              edit: 'Edit',
              spam: 'Spam',
              delete: 'Delete',
            },
            options: {
              current: 'Current page',
              accept: 'Passed',
              audit: 'Pending review',
              spam: 'Spam',
              master: 'Mine',
            },
          },
          config: {
            msg: 'Automatic get configuration...',
            error: 'Failed to get configuration',
            text: 'Configuration',
            save: 'Save',
            passwordError: 'Inconsistent passwords',
            settings: {
              basic: {
                name: 'Basic',
                user: { title: 'Username', desc: 'Login Username', ph: 'Name' },
                mail: {
                  title: 'Administrator Email',
                  desc: 'Confirm administrator identity',
                  ph: 'mail@example.com',
                },
                domain: {
                  title: 'Secure Domain',
                  desc: 'Restrict other third-party website requests from being blocked (multiple comma-separated)',
                  ph: 'example.com,www.example.com',
                },
                headers: {
                  title: 'Request header priority',
                  desc: 'To ensure that the acquired user IPs are authentic (use commas to separate multiple ones)',
                  ph: 'headers.cf-connecting-ip',
                },
              },
              commentHandle: {
                name: 'Comments',
                count: {
                  title: 'Comment Count',
                  desc: 'How many comments to get at a time',
                  ph: 6,
                },
                word: {
                  title: 'Word limit',
                  desc: 'Comment content, nickname, email, website (split by English comma, enter only a 0 for all unrestricted)',
                  ph: 0,
                },
                limit: {
                  title: 'Limit',
                  desc: 'Limit how many comments an IP can make in 10 minutes',
                  ph: 0,
                },
                limitAll: {
                  title: 'Limit all people',
                  desc: 'Limit all people within 10 minutes, all IP can comment on how many',
                  ph: 0,
                },
                cdn: {
                  title: 'Avatar CDN',
                  desc: 'Comment avatar CDN address',
                  ph: 'https://cn.gravatar.com/avatar/',
                },
                akismet: {
                  title: 'Akismet',
                  desc: 'Spam comment detection and processing',
                  ph: 'Akismet Key',
                },
              },
              mail: {
                name: 'Email Alerts',
                site: {
                  title: 'Website address',
                  desc: 'Quick jump to the comment section of the website within the email',
                  ph: 'https://blog.example.com',
                },
                server: {
                  title: 'Server side address',
                  desc: "Comment system server address (same as the client's serverURLs)",
                  ph: 'https://server-discuss.example.com',
                },
                host: {
                  title: 'Service Provider Hosting',
                  desc: 'For example: Tencent Enterprise Hosting',
                  ph: 'smtp.exmail.qq.com',
                },
                port: {
                  title: 'Service Provider Hosting Port',
                  desc: 'Example: Tencent Enterprise Hosting Port',
                  ph: 465,
                },
                from: { title: 'Sender', ph: 'Example: server@example.com' },
                accept: {
                  title: 'Authorization code or password',
                  desc: 'Each service provider is different',
                },
                Msubject: {
                  title: 'Mail Title(Administrator)',
                  desc: 'Title of the comment email received by the administrator',
                  ph: 'You have a new review on "Discuss Official Website"!',
                },
                Rsubject: {
                  title: 'Mail title (commenter)',
                  desc: 'Title of comments received by others',
                  ph: 'You have a new comment on "Discuss Official Website"!',
                },
                Mtemplate: {
                  title: 'Email Template (Administrator)',
                  desc: 'Template for comment emails received by administrators',
                },
                Rtemplate: {
                  title: 'Email Template (Commenter)',
                  desc: 'Template for comments received by others',
                },
              },
              password: { name: 'Password', pwd: 'New Password', cfm: 'Confirm Password' },
            },
          },
        },
      },
    }
  let Ee
  function Le(e) {
    let t = (e = e.replace(/\[(\w+)\]/g, '.$1')).split('.'),
      n = { ...Ee }
    for (let e of t) n = null != (o = n[e]) ? o : ''
    var o
    return n
  }
  var Ae = (e) =>
      new Promise((t, n) => {
        const o = new XMLHttpRequest()
        o.open(e.method || 'POST', e.url, !0),
          'GET' === e.method ? o.send() : o.send(JSON.stringify(e.data)),
          (o.onreadystatechange = () => {
            try {
              if (4 === o.readyState) {
                o.status >= 200 && o.status < 300
                  ? t(
                      (function (e) {
                        try {
                          return JSON.parse(e)
                        } catch (t) {
                          return e
                        }
                      })(o.responseText)
                    )
                  : n(o)
              }
            } catch (e) {
              n(e)
            }
          })
      }),
    Se = '1.2.2'
  const Me = [
    '3d眼镜',
    'EDG',
    'LPL',
    'beluga',
    '不好意思',
    '不服吗',
    '亲亲',
    '伞兵',
    '倚墙笑',
    '值得肯定',
    '偷偷看',
    '傻笑',
    '再见',
    '出家人',
    '击剑',
    '加班',
    '勉强笑',
    '危险',
    '发红包',
    '吃手',
    '吃瓜',
    '吐血',
    '吵架',
    '呦吼',
    '呲牙笑',
    '哈士奇',
    '哈士奇失去意识',
    '哈士奇失望',
    '哭泣',
    '唱歌',
    '喜欢',
    '嘿哈',
    '大笑',
    '失去信号',
    '失望',
    '头秃',
    '奋斗',
    '好奇',
    '好的',
    '害羞',
    '小丑',
    '小偷',
    '尬笑',
    '尴尬',
    '应援',
    '开心',
    '引起不适',
    '微笑',
    '思考',
    '恶心',
    '恶魔',
    '恶魔恐惧',
    '惊吓',
    '惊吓白眼',
    '惊讶',
    '惬意',
    '感动',
    '愤怒',
    '我看好你',
    '手机相机',
    '打咩',
    '打牌',
    '托腮',
    '扶额',
    '抠鼻',
    '抬眼镜',
    '拜托',
    '捂嘴笑',
    '捂脸',
    '擦汗',
    '放鞭炮',
    '敬礼',
    '整理发型',
    '斗鸡眼',
    '智慧的眼神',
    '月饼',
    '有没有搞错',
    '正确',
    '没招',
    '波吉',
    '泪奔',
    '流汗微笑',
    '流鼻涕',
    '深思',
    '滑稽',
    '滑稽吃瓜',
    '滑稽喝水',
    '滑稽奶茶',
    '滑稽柠檬',
    '滑稽狂汗',
    '滑稽被子',
    '烦恼',
    '熊熊',
    '熊猫',
    '熊猫唱歌',
    '熊猫喜欢',
    '熊猫失望',
    '熊猫意外',
    '熬夜',
    '爆炸',
    '牛年进宝',
    '狂热',
    '狗头',
    '狗头围脖',
    '狗头失望',
    '狗头意外',
    '狗头胖次',
    '狗头花',
    '狗头草',
    '猪头',
    '猪头意外',
    '生病',
    '电话',
    '疑问',
    '疼痛',
    '痛哭',
    '看穿一切',
    '眩晕',
    '睡觉',
    '禁言',
    '笑哭',
    '纠结',
    '绿帽',
    '缺牙笑',
    '翻白眼',
    '老虎意外',
    '耍酷',
    '胡子',
    '菜狗',
    '菜狗花',
    '蒙面滑稽',
    '虎年进宝',
    '被打',
    '裂开',
    '警告',
    '读书',
    '财神红包',
    '超爱',
    '这是啥',
    '送福',
    '送花',
    '错误',
    '阴险',
    '难以置信',
    '面具',
    '饥渴',
    '鬼脸',
    '黑线',
    '鼓掌',
  ]
  function Te(e) {
    let o,
      i,
      s = [
        { class: 'D-emotion-svg D-svg' },
        { width: '24' },
        { height: '24' },
        { fill: 'currentColor' },
        e[0],
      ],
      r = {}
    for (let e = 0; e < s.length; e += 1) r = n(r, s[e])
    return {
      c() {
        ;(o = y('svg')),
          (i = y('path')),
          k(
            i,
            'd',
            'M7.523 13.5h8.954c-.228 2.47-2.145 4-4.477 4-2.332 0-4.25-1.53-4.477-4zM12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-1.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zm-3-8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'
          ),
          C(o, r)
      },
      m(e, t) {
        v(e, o, t), f(o, i)
      },
      p(e, [t]) {
        C(
          o,
          (r = Z(s, [
            { class: 'D-emotion-svg D-svg' },
            { width: '24' },
            { height: '24' },
            { fill: 'currentColor' },
            1 & t && e[0],
          ]))
        )
      },
      i: t,
      o: t,
      d(e) {
        e && h(o)
      },
    }
  }
  function _e(e, t, o) {
    return (
      (e.$$set = (e) => {
        o(0, (t = n(n({}, t), u(e))))
      }),
      [(t = u(t))]
    )
  }
  class Ne extends ie {
    constructor(e) {
      super(), oe(this, e, _e, Te, l, {})
    }
  }
  function Oe(e) {
    let o,
      i,
      s = [{ class: 'D-loading-svg D-svg' }, { viewBox: '0 0 100 100' }, e[0]],
      r = {}
    for (let e = 0; e < s.length; e += 1) r = n(r, s[e])
    return {
      c() {
        ;(o = y('svg')),
          (i = y('circle')),
          k(i, 'cx', '50'),
          k(i, 'cy', '50'),
          k(i, 'fill', 'none'),
          k(i, 'stroke', 'currentColor'),
          k(i, 'stroke-width', '8'),
          k(i, 'r', '40'),
          k(i, 'stroke-linecap', 'round'),
          k(i, 'stroke-dasharray', '128 120'),
          C(o, r)
      },
      m(e, t) {
        v(e, o, t), f(o, i)
      },
      p(e, [t]) {
        C(
          o,
          (r = Z(s, [{ class: 'D-loading-svg D-svg' }, { viewBox: '0 0 100 100' }, 1 & t && e[0]]))
        )
      },
      i: t,
      o: t,
      d(e) {
        e && h(o)
      },
    }
  }
  function je(e, t, o) {
    return (
      (e.$$set = (e) => {
        o(0, (t = n(n({}, t), u(e))))
      }),
      [(t = u(t))]
    )
  }
  class Pe extends ie {
    constructor(e) {
      super(), oe(this, e, je, Oe, l, {})
    }
  }
  function Re(e) {
    let o,
      i,
      s = [
        { class: 'D-settings-svg D-svg' },
        { width: '24' },
        { height: '24' },
        { fill: 'currentColor' },
        { viewBox: '0 0 512 512' },
        e[0],
      ],
      r = {}
    for (let e = 0; e < s.length; e += 1) r = n(r, s[e])
    return {
      c() {
        ;(o = y('svg')),
          (i = y('path')),
          k(
            i,
            'd',
            'm487.4 315.7-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z'
          ),
          C(o, r)
      },
      m(e, t) {
        v(e, o, t), f(o, i)
      },
      p(e, [t]) {
        C(
          o,
          (r = Z(s, [
            { class: 'D-settings-svg D-svg' },
            { width: '24' },
            { height: '24' },
            { fill: 'currentColor' },
            { viewBox: '0 0 512 512' },
            1 & t && e[0],
          ]))
        )
      },
      i: t,
      o: t,
      d(e) {
        e && h(o)
      },
    }
  }
  function Ie(e, t, o) {
    return (
      (e.$$set = (e) => {
        o(0, (t = n(n({}, t), u(e))))
      }),
      [(t = u(t))]
    )
  }
  class qe extends ie {
    constructor(e) {
      super(), oe(this, e, Ie, Re, l, {})
    }
  }
  function He(e) {
    let o,
      i,
      s = [
        { class: 'D-refresh-svg D-svg' },
        { viewBox: '0 0 1024 1024' },
        { width: '16' },
        { height: '16' },
        { fill: 'currentColor' },
        { stroke: 'currentColor' },
        { 'stroke-width': '26' },
        e[0],
      ],
      r = {}
    for (let e = 0; e < s.length; e += 1) r = n(r, s[e])
    return {
      c() {
        ;(o = y('svg')),
          (i = y('path')),
          k(
            i,
            'd',
            'M960 416V192l-73.056 73.056a447.712 447.712 0 0 0-373.6-201.088C265.92 63.968 65.312 264.544 65.312 512S265.92 960.032 513.344 960.032a448.064 448.064 0 0 0 415.232-279.488 38.368 38.368 0 1 0-71.136-28.896 371.36 371.36 0 0 1-344.096 231.584c-205.024 0-371.232-166.208-371.232-371.232S308.32 140.768 513.344 140.768c132.448 0 251.936 70.08 318.016 179.84L736 416h224z'
          ),
          C(o, r)
      },
      m(e, t) {
        v(e, o, t), f(o, i)
      },
      p(e, [t]) {
        C(
          o,
          (r = Z(s, [
            { class: 'D-refresh-svg D-svg' },
            { viewBox: '0 0 1024 1024' },
            { width: '16' },
            { height: '16' },
            { fill: 'currentColor' },
            { stroke: 'currentColor' },
            { 'stroke-width': '26' },
            1 & t && e[0],
          ]))
        )
      },
      i: t,
      o: t,
      d(e) {
        e && h(o)
      },
    }
  }
  function Be(e, t, o) {
    return (
      (e.$$set = (e) => {
        o(0, (t = n(n({}, t), u(e))))
      }),
      [(t = u(t))]
    )
  }
  class Ue extends ie {
    constructor(e) {
      super(), oe(this, e, Be, He, l, {})
    }
  }
  function Fe(e) {
    g(
      e,
      'svelte-1v6b913',
      '.D-submit.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{margin:10px 0;padding:10px;border-radius:8px;border:solid 1px var(--D-Centre-Color)}.D-submit.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913:hover{border-color:var(--D-Height-Color)}.D-submit.svelte-1v6b913 .D-input .D-error.svelte-1v6b913.svelte-1v6b913{border-radius:6px;border-color:var(--D-main-Color);background:rgba(244, 100, 95, 0.1)}.D-input.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{position:relative}.D-input.svelte-1v6b913 input.svelte-1v6b913.svelte-1v6b913{padding:6px;width:calc((100% - 1rem) / 3);outline:none;border-bottom:dashed 1px var(--D-Centre-Color)}.D-input.svelte-1v6b913 input.svelte-1v6b913+input.svelte-1v6b913{margin-left:0.5rem}.D-input.svelte-1v6b913 .svelte-1v6b913.svelte-1v6b913{color:currentColor;border:none;background:transparent;box-sizing:border-box}.D-input.svelte-1v6b913 .svelte-1v6b913.svelte-1v6b913:focus{border-radius:8px;background:rgba(153, 153, 153, 0.08)}.D-input.svelte-1v6b913 .svelte-1v6b913.svelte-1v6b913:hover{border-color:var(--D-Height-Color);transition:all 0.5s}.D-input.svelte-1v6b913 .D-input-content.svelte-1v6b913.svelte-1v6b913{margin:10px 0 0;resize:vertical;width:100%;min-height:140px;max-height:400px;outline:none;font-family:inherit;transition:none}.D-input.svelte-1v6b913 .D-text-number.svelte-1v6b913.svelte-1v6b913{position:absolute;color:#999;right:14px;bottom:6px;font-size:12px}.D-input.svelte-1v6b913 .D-text-number-illegal.svelte-1v6b913.svelte-1v6b913{color:red}.D-input.svelte-1v6b913 .D-error.svelte-1v6b913.svelte-1v6b913{border-radius:6px;border-color:var(--D-main-Color);background:rgba(244, 100, 95, 0.1)}.D-actions.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{margin:10px 0 0}.D-actions.svelte-1v6b913 .D-actions-left.svelte-1v6b913.svelte-1v6b913{display:flex}.D-actions.svelte-1v6b913 .D-actions-right.svelte-1v6b913.svelte-1v6b913{display:flex;align-items:center}.D-actions.svelte-1v6b913 .D-actions-right .D-btn.svelte-1v6b913.svelte-1v6b913{margin-left:4px}.D-actions.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913,.D-emot-btn.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913,.D-setting-btn.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913,.D-refresh-btn.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{position:relative;display:flex;align-items:center;justify-content:space-between}.D-setting-btn.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913,.D-refresh-btn.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{width:18px;cursor:pointer;margin-left:6px}.D-send.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{display:flex;align-items:center;justify-content:center}.D-emot.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{top:30px;width:100%;margin-top:10px;border:1px solid var(--D-Low-Color);border-radius:4px}.D-emot-items.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{display:none;height:180px;min-height:100px;max-height:200px;resize:vertical;padding:10px;margin:0;overflow-x:hidden;user-select:none}.D-emot-items-active.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{display:block}.D-emot-item.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{font-size:20px;list-style-type:none;padding:5px 10px;border-radius:5px;display:inline-block;line-height:14px;margin:0 10px 12px 0;cursor:pointer;transition:0.3s}.D-emot-item.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913:hover{background:var(--D-Low-Color);box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)}.D-emot-packages.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{padding:0;font-size:0;border-top:solid 1px var(--D-Low-Color)}.D-emot-packages.svelte-1v6b913 span.svelte-1v6b913.svelte-1v6b913{display:inline-block;line-height:30px;font-size:14px;padding:0 10px;cursor:pointer}.D-emot-packages.svelte-1v6b913 span.svelte-1v6b913 img{width:20px;position:relative;top:5px}.D-emot-packages.svelte-1v6b913 span.svelte-1v6b913.svelte-1v6b913:nth-child(1){border-radius:0 0 0 3px}.D-emot-package-active.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{background:var(--D-Low-Color)}.D-preview.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{padding:10px;overflow-x:auto;min-height:1.375rem;margin:10px 0;border:1px solid #dcdfe6;border-radius:4px}@media screen and (max-width: 500px){.D-input.svelte-1v6b913.svelte-1v6b913.svelte-1v6b913{display:flex;flex-direction:column}.D-input.svelte-1v6b913 input.svelte-1v6b913.svelte-1v6b913{width:100%}.D-input.svelte-1v6b913 input.svelte-1v6b913+input.svelte-1v6b913{margin-top:4px;margin-left:0}}'
    )
  }
  function Ve(e, t, n) {
    const o = e.slice()
    return (o[42] = t[n][0]), (o[43] = t[n][1]), (o[45] = n), o
  }
  function Ge(e, t, n) {
    const o = e.slice()
    return (o[42] = t[n][0]), (o[43] = t[n][1]), (o[45] = n), o
  }
  function Ye(e, t, n) {
    const o = e.slice()
    return (o[47] = t[n][0]), (o[48] = t[n][1]), o
  }
  function Je(e, t, n) {
    const o = e.slice()
    return (o[51] = t[n]), (o[52] = t), (o[53] = n), o
  }
  function We(e) {
    let t, n, o, i
    function r() {
      e[22].call(t, e[51])
    }
    function l(...t) {
      return e[23](e[51], ...t)
    }
    return {
      c() {
        ;(t = w('input')),
          k(t, 'class', (n = p(e[9][e[51].key].is ? '' : 'D-error') + ' svelte-1v6b913')),
          k(t, 'name', e[51].key),
          k(t, 'placeholder', e[51].locale)
      },
      m(n, s) {
        v(n, t, s),
          E(t, e[9][e[51].key].value),
          o || ((i = [$(t, 'input', r), $(t, 'input', l), $(t, 'input', e[16])]), (o = !0))
      },
      p(o, i) {
        ;(e = o),
          512 & i[0] &&
            n !== (n = p(e[9][e[51].key].is ? '' : 'D-error') + ' svelte-1v6b913') &&
            k(t, 'class', n),
          16896 & i[0] && t.value !== e[9][e[51].key].value && E(t, e[9][e[51].key].value)
      },
      d(e) {
        e && h(t), (o = !1), s(i)
      },
    }
  }
  function Qe(e) {
    let t,
      n,
      o,
      i = e[10] && Ke(e)
    return {
      c() {
        ;(t = w('span')),
          (n = x(e[11])),
          (o = D()),
          i && i.c(),
          k(t, 'class', 'D-text-number svelte-1v6b913')
      },
      m(e, s) {
        v(e, t, s), f(t, n), f(t, o), i && i.m(t, null)
      },
      p(e, o) {
        2048 & o[0] && z(n, e[11]),
          e[10] ? (i ? i.p(e, o) : ((i = Ke(e)), i.c(), i.m(t, null))) : i && (i.d(1), (i = null))
      },
      d(e) {
        e && h(t), i && i.d()
      },
    }
  }
  function Ke(e) {
    let t,
      n,
      o,
      i = '/ ' + e[10]
    return {
      c() {
        ;(t = w('span')),
          (n = x(i)),
          k(t, 'class', (o = p(e[11] > e[10] && 'D-text-number-illegal') + ' svelte-1v6b913'))
      },
      m(e, o) {
        v(e, t, o), f(t, n)
      },
      p(e, s) {
        1024 & s[0] && i !== (i = '/ ' + e[10]) && z(n, i),
          3072 & s[0] &&
            o !== (o = p(e[11] > e[10] && 'D-text-number-illegal') + ' svelte-1v6b913') &&
            k(t, 'class', o)
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function Xe(e) {
    let n, o, i, r, l, c, a, m
    return (
      (o = new qe({})),
      (l = new Ue({})),
      {
        c() {
          ;(n = w('div')),
            ee(o.$$.fragment),
            (i = D()),
            (r = w('div')),
            ee(l.$$.fragment),
            k(n, 'class', 'D-setting-btn svelte-1v6b913'),
            k(r, 'class', 'D-refresh-btn svelte-1v6b913')
        },
        m(t, s) {
          v(t, n, s),
            te(o, n, null),
            v(t, i, s),
            v(t, r, s),
            te(l, r, null),
            (c = !0),
            a || ((m = [$(n, 'click', e[27]), $(r, 'click', e[28])]), (a = !0))
        },
        p: t,
        i(e) {
          c || (K(o.$$.fragment, e), K(l.$$.fragment, e), (c = !0))
        },
        o(e) {
          X(o.$$.fragment, e), X(l.$$.fragment, e), (c = !1)
        },
        d(e) {
          e && h(n), ne(o), e && h(i), e && h(r), ne(l), (a = !1), s(m)
        },
      }
    )
  }
  function Ze(e) {
    let n, o, i
    return {
      c() {
        ;(n = w('button')),
          (n.textContent = `${Le('cancel')}`),
          k(n, 'class', 'D-cancel D-btn D-btn-main svelte-1v6b913')
      },
      m(t, s) {
        v(t, n, s), o || ((i = $(n, 'click', e[29])), (o = !0))
      },
      p: t,
      d(e) {
        e && h(n), (o = !1), i()
      },
    }
  }
  function et(e) {
    let n,
      o = Le('send') + ''
    return {
      c() {
        n = x(o)
      },
      m(e, t) {
        v(e, n, t)
      },
      p: t,
      i: t,
      o: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function tt(e) {
    let n, o
    return (
      (n = new Pe({})),
      {
        c() {
          ee(n.$$.fragment)
        },
        m(e, t) {
          te(n, e, t), (o = !0)
        },
        p: t,
        i(e) {
          o || (K(n.$$.fragment, e), (o = !0))
        },
        o(e) {
          X(n.$$.fragment, e), (o = !1)
        },
        d(e) {
          ne(n, e)
        },
      }
    )
  }
  function nt(e) {
    let t
    return {
      c() {
        ;(t = w('div')), k(t, 'class', 'D-preview svelte-1v6b913')
      },
      m(n, o) {
        v(n, t, o), (t.innerHTML = e[1])
      },
      p(e, n) {
        2 & n[0] && (t.innerHTML = e[1])
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function ot(e) {
    let t,
      n,
      o,
      i = Object.entries(e[4]),
      s = []
    for (let t = 0; t < i.length; t += 1) s[t] = lt(Ge(e, i, t))
    let r = Object.entries(e[4]),
      l = []
    for (let t = 0; t < r.length; t += 1) l[t] = ct(Ve(e, r, t))
    return {
      c() {
        t = w('div')
        for (let e = 0; e < s.length; e += 1) s[e].c()
        ;(n = D()), (o = w('div'))
        for (let e = 0; e < l.length; e += 1) l[e].c()
        k(o, 'class', 'D-emot-packages svelte-1v6b913'), k(t, 'class', 'D-emot svelte-1v6b913')
      },
      m(e, i) {
        v(e, t, i)
        for (let e = 0; e < s.length; e += 1) s[e].m(t, null)
        f(t, n), f(t, o)
        for (let e = 0; e < l.length; e += 1) l[e].m(o, null)
      },
      p(e, c) {
        if (135192 & c[0]) {
          let o
          for (i = Object.entries(e[4]), o = 0; o < i.length; o += 1) {
            const r = Ge(e, i, o)
            s[o] ? s[o].p(r, c) : ((s[o] = lt(r)), s[o].c(), s[o].m(t, n))
          }
          for (; o < s.length; o += 1) s[o].d(1)
          s.length = i.length
        }
        if (24 & c[0]) {
          let t
          for (r = Object.entries(e[4]), t = 0; t < r.length; t += 1) {
            const n = Ve(e, r, t)
            l[t] ? l[t].p(n, c) : ((l[t] = ct(n)), l[t].c(), l[t].m(o, null))
          }
          for (; t < l.length; t += 1) l[t].d(1)
          l.length = r.length
        }
      },
      d(e) {
        e && h(t), b(s, e), b(l, e)
      },
    }
  }
  function it(e) {
    let t, n, o, i, s
    return {
      c() {
        ;(t = w('img')),
          k(t, 'class', 'D-comment-emot'),
          m(t.src, (n = e[12].imgLoading)) || k(t, 'src', n),
          k(t, 'd-src', (o = e[48])),
          k(t, 'alt', (i = e[47])),
          k(t, 'title', (s = e[47]))
      },
      m(e, n) {
        v(e, t, n)
      },
      p(e, n) {
        16 & n[0] && o !== (o = e[48]) && k(t, 'd-src', o),
          16 & n[0] && i !== (i = e[47]) && k(t, 'alt', i),
          16 & n[0] && s !== (s = e[47]) && k(t, 'title', s)
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function st(e) {
    let t,
      n,
      o,
      i = e[48] + ''
    return {
      c() {
        ;(t = w('span')), (n = x(i)), k(t, 'title', (o = e[47]))
      },
      m(e, o) {
        v(e, t, o), f(t, n)
      },
      p(e, s) {
        16 & s[0] && i !== (i = e[48] + '') && z(n, i),
          16 & s[0] && o !== (o = e[47]) && k(t, 'title', o)
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function rt(e) {
    let t, n, o
    function i(e, t) {
      return 'text' === e[43].type ? st : it
    }
    let s = i(e),
      l = s(e)
    return {
      c() {
        ;(t = w('li')), l.c(), k(t, 'class', 'D-emot-item svelte-1v6b913')
      },
      m(i, s) {
        v(i, t, s),
          l.m(t, null),
          n ||
            ((o = $(t, 'click', function () {
              r(e[17](e[47], e[48], e[43].type)) &&
                e[17](e[47], e[48], e[43].type).apply(this, arguments)
            })),
            (n = !0))
      },
      p(n, o) {
        s === (s = i((e = n))) && l ? l.p(e, o) : (l.d(1), (l = s(e)), l && (l.c(), l.m(t, null)))
      },
      d(e) {
        e && h(t), l.d(), (n = !1), o()
      },
    }
  }
  function lt(e) {
    let t,
      n,
      o = Object.entries(e[43].items),
      i = []
    for (let t = 0; t < o.length; t += 1) i[t] = rt(Ye(e, o, t))
    return {
      c() {
        t = w('ul')
        for (let e = 0; e < i.length; e += 1) i[e].c()
        k(
          t,
          'class',
          (n = 'D-emot-items ' + (e[45] === e[3] ? 'D-emot-items-active' : '') + ' svelte-1v6b913')
        )
      },
      m(e, n) {
        v(e, t, n)
        for (let e = 0; e < i.length; e += 1) i[e].m(t, null)
      },
      p(e, s) {
        if (135184 & s[0]) {
          let n
          for (o = Object.entries(e[43].items), n = 0; n < o.length; n += 1) {
            const r = Ye(e, o, n)
            i[n] ? i[n].p(r, s) : ((i[n] = rt(r)), i[n].c(), i[n].m(t, null))
          }
          for (; n < i.length; n += 1) i[n].d(1)
          i.length = o.length
        }
        8 & s[0] &&
          n !==
            (n =
              'D-emot-items ' +
              (e[45] === e[3] ? 'D-emot-items-active' : '') +
              ' svelte-1v6b913') &&
          k(t, 'class', n)
      },
      d(e) {
        e && h(t), b(i, e)
      },
    }
  }
  function ct(e) {
    let t,
      n,
      o,
      i,
      s = e[42] + ''
    function r() {
      return e[30](e[45])
    }
    return {
      c() {
        ;(t = w('span')),
          k(t, 'class', (n = p(e[45] === e[3] ? 'D-emot-package-active' : '') + ' svelte-1v6b913'))
      },
      m(e, n) {
        v(e, t, n), (t.innerHTML = s), o || ((i = $(t, 'click', r)), (o = !0))
      },
      p(o, i) {
        ;(e = o),
          16 & i[0] && s !== (s = e[42] + '') && (t.innerHTML = s),
          8 & i[0] &&
            n !== (n = p(e[45] === e[3] ? 'D-emot-package-active' : '') + ' svelte-1v6b913') &&
            k(t, 'class', n)
      },
      d(e) {
        e && h(t), (o = !1), i()
      },
    }
  }
  function at(e) {
    let t,
      n,
      o,
      i,
      r,
      l,
      c,
      a,
      m,
      d,
      u,
      p,
      g,
      y,
      C,
      z,
      L,
      A,
      S,
      M,
      T,
      _,
      N,
      O,
      j,
      P,
      R,
      I = Le('preview') + '',
      q = e[14],
      H = []
    for (let t = 0; t < q.length; t += 1) H[t] = We(Je(e, q, t))
    let B = e[10] && Qe(e)
    u = new Ne({})
    let U = !e[0] && Xe(e),
      F = e[0] && Ze(e)
    const V = [tt, et],
      G = []
    function Y(e, t) {
      return e[7] && e[8] ? 0 : 1
    }
    ;(M = Y(e)), (T = G[M] = V[M](e))
    let J = e[6] && nt(e),
      Z = e[2] && ot(e)
    return {
      c() {
        ;(t = w('div')), (n = w('div'))
        for (let e = 0; e < H.length; e += 1) H[e].c()
        ;(o = D()),
          (i = w('textarea')),
          (l = D()),
          B && B.c(),
          (c = D()),
          (a = w('div')),
          (m = w('div')),
          (d = w('div')),
          ee(u.$$.fragment),
          (p = D()),
          U && U.c(),
          (g = D()),
          (y = w('div')),
          F && F.c(),
          (C = D()),
          (z = w('button')),
          (L = x(I)),
          (S = w('button')),
          T.c(),
          (N = D()),
          J && J.c(),
          (O = D()),
          Z && Z.c(),
          k(i, 'name', ft),
          k(
            i,
            'class',
            (r = 'D-input-content ' + (e[9].content.is ? '' : 'D-error') + ' svelte-1v6b913')
          ),
          k(i, 'placeholder', e[12].ph),
          k(n, 'class', 'D-input svelte-1v6b913'),
          k(d, 'class', 'D-emot-btn svelte-1v6b913'),
          k(m, 'class', 'D-actions-left svelte-1v6b913'),
          k(
            z,
            'class',
            (A =
              'D-cancel D-btn D-btn-main ' +
              (!e[9].content.value.length && 'D-disabled') +
              ' svelte-1v6b913')
          ),
          k(S, 'class', 'D-send D-btn D-btn-main svelte-1v6b913'),
          (S.disabled = _ = e[7] || !e[8]),
          k(y, 'class', 'D-actions-right svelte-1v6b913'),
          k(a, 'class', 'D-actions D-select-none svelte-1v6b913'),
          k(t, 'class', 'D-submit svelte-1v6b913')
      },
      m(s, r) {
        v(s, t, r), f(t, n)
        for (let e = 0; e < H.length; e += 1) H[e].m(n, null)
        f(n, o),
          f(n, i),
          E(i, e[9].content.value),
          e[25](i),
          f(n, l),
          B && B.m(n, null),
          f(t, c),
          f(t, a),
          f(a, m),
          f(m, d),
          te(u, d, null),
          f(m, p),
          U && U.m(m, null),
          f(a, g),
          f(a, y),
          F && F.m(y, null),
          f(y, C),
          f(y, z),
          f(z, L),
          f(y, S),
          G[M].m(S, null),
          f(t, N),
          J && J.m(t, null),
          f(t, O),
          Z && Z.m(t, null),
          (j = !0),
          P ||
            ((R = [
              $(i, 'input', e[24]),
              $(i, 'input', e[16]),
              $(d, 'click', e[26]),
              $(z, 'click', e[15]),
              $(S, 'click', e[18]),
            ]),
            (P = !0))
      },
      p(e, s) {
        if (82432 & s[0]) {
          let t
          for (q = e[14], t = 0; t < q.length; t += 1) {
            const i = Je(e, q, t)
            H[t] ? H[t].p(i, s) : ((H[t] = We(i)), H[t].c(), H[t].m(n, o))
          }
          for (; t < H.length; t += 1) H[t].d(1)
          H.length = q.length
        }
        ;(!j ||
          (512 & s[0] &&
            r !==
              (r = 'D-input-content ' + (e[9].content.is ? '' : 'D-error') + ' svelte-1v6b913'))) &&
          k(i, 'class', r),
          512 & s[0] && E(i, e[9].content.value),
          e[10] ? (B ? B.p(e, s) : ((B = Qe(e)), B.c(), B.m(n, null))) : B && (B.d(1), (B = null)),
          e[0]
            ? U &&
              (W(),
              X(U, 1, 1, () => {
                U = null
              }),
              Q())
            : U
            ? (U.p(e, s), 1 & s[0] && K(U, 1))
            : ((U = Xe(e)), U.c(), K(U, 1), U.m(m, null)),
          e[0] ? (F ? F.p(e, s) : ((F = Ze(e)), F.c(), F.m(y, C))) : F && (F.d(1), (F = null)),
          (!j ||
            (512 & s[0] &&
              A !==
                (A =
                  'D-cancel D-btn D-btn-main ' +
                  (!e[9].content.value.length && 'D-disabled') +
                  ' svelte-1v6b913'))) &&
            k(z, 'class', A)
        let l = M
        ;(M = Y(e)),
          M === l
            ? G[M].p(e, s)
            : (W(),
              X(G[l], 1, 1, () => {
                G[l] = null
              }),
              Q(),
              (T = G[M]),
              T ? T.p(e, s) : ((T = G[M] = V[M](e)), T.c()),
              K(T, 1),
              T.m(S, null)),
          (!j || (384 & s[0] && _ !== (_ = e[7] || !e[8]))) && (S.disabled = _),
          e[6] ? (J ? J.p(e, s) : ((J = nt(e)), J.c(), J.m(t, O))) : J && (J.d(1), (J = null)),
          e[2] ? (Z ? Z.p(e, s) : ((Z = ot(e)), Z.c(), Z.m(t, null))) : Z && (Z.d(1), (Z = null))
      },
      i(e) {
        j || (K(u.$$.fragment, e), K(U), K(T), (j = !0))
      },
      o(e) {
        X(u.$$.fragment, e), X(U), X(T), (j = !1)
      },
      d(n) {
        n && h(t),
          b(H, n),
          e[25](null),
          B && B.d(),
          ne(u),
          U && U.d(),
          F && F.d(),
          G[M].d(),
          J && J.d(),
          Z && Z.d(),
          (P = !1),
          s(R)
      },
    }
  }
  const mt = 'text',
    dt = 'nick',
    ut = 'mail',
    pt = 'site',
    ft = 'content',
    gt = /^\w+([-.]\w+)*@\w+([-.]\w+)*(\.[a-z]{2,5})+$/
  function vt(e, t, n) {
    let o, i, s
    d(e, xe, (e) => n(33, (o = e))),
      d(e, De, (e) => n(34, (i = e))),
      d(e, ye, (e) => n(35, (s = e)))
    let r = s
    const l = _()
    let c,
      {
        cancel: a = !1,
        pid: m = '',
        rid: u = '',
        wordLimit: p = { nick: 0, mail: 0, site: 0, content: 0 },
      } = t,
      f = localStorage.discuss,
      g = !1,
      v = 0,
      h = {},
      b = {},
      w = !1,
      y = !1,
      x = !1
    const D = [
      { key: dt, locale: Le(dt), type: mt },
      { key: ut, locale: Le(ut), type: 'email' },
      { key: pt, locale: Le(pt), type: mt },
    ]
    let $,
      k = {
        nick: { value: '', is: !1 },
        mail: { value: '', is: !1 },
        site: { value: '', is: !0 },
        content: { value: '', is: !1 },
      },
      C = '',
      z = p.content
    function E() {
      for (const [e, t] of Object.entries(k)) f[e] = t.value.trim()
      ;(localStorage.discuss = JSON.stringify(f)),
        (function () {
          let e = k.content.value
          const t = []
          e.replace(/\[(.*?)\]/g, (e, n) => {
            t.push(n)
          })
          for (const n of t) {
            const t = b[n]
            if (!t) continue
            const o = `<img class='D-comment-emot' src='${t}' alt='${n}'/>`
            e = e.replace(`[${n}]`, o)
          }
          n(1, (C = e))
        })()
    }
    function L() {
      E(), A()
    }
    function A() {
      try {
        const { nick: e, mail: t, site: o, content: i } = k,
          { nick: s, mail: r, site: l, content: c } = p,
          a = e.value.length,
          m = t.value.length,
          d = o.value.length
        ;(e.is = (0 === s && a > 1) || (a > 1 && a <= s)),
          (0 === r && gt.test(t.value)) || (m <= r && gt.test(t.value)) ? (t.is = !0) : (t.is = !1),
          (0 === d && 0 === l) ||
          ((function (e) {
            try {
              const t = new URL(e)
              if (
                /^https?:\/\//.test(e) &&
                /([A-Za-z\d]{1,30}\.)+[A-Za-z\d]{2,5}$/.test(t.hostname)
              )
                return !0
            } catch (e) {}
            return !1
          })(o.value) &&
            (d <= l || 0 === l))
            ? (d && (o.value = new URL(o.value).origin), (o.is = !0))
            : (o.is = !1)
        const u = new DOMParser().parseFromString(C, 'text/html'),
          f = u.body.textContent.length + u.querySelectorAll('img').length
        ;(i.is = (0 === c && f > 1) || (f > 1 && f <= c)),
          n(9, k),
          n(8, (x = e.is && t.is && o.is && i.is))
      } catch (e) {
        console.error(e)
      }
    }
    M(() => {
      !(function () {
        try {
          f = JSON.parse(f) || {}
          for (const [e, t] of Object.entries(f)) n(9, (k[e].value = t || ''), k)
        } catch (e) {
          f = {}
        }
      })(),
        (async function () {
          const e = r.emotMaps
          ;/\.json$/.test(e)
            ? n(4, (h = await Ae({ url: e, method: 'GET' })))
            : n(
                4,
                (h =
                  e ||
                  ((e) => {
                    e =
                      (e || 'https://lib.baomitu.com/discuss/1.2.2').replace(/\/$/, '') +
                      '/assets/emot/'
                    const t = {}
                    for (const n of Me) t[n] = e + n + '.png'
                    return {
                      '😀': {
                        type: 'text',
                        items: {
                          'grinning face': '😀',
                          'grinning face with big eyes': '😃',
                          'grinning face with smiling eyes': '😄',
                          'beaming face with smiling eyes': '😁',
                          'grinning squinting face': '😆',
                          'grinning face with sweat': '😅',
                          'rolling on the floor laughing': '🤣',
                          'face with tears of joy': '😂',
                          'slightly smiling face': '🙂',
                          'upside down face': '🙃',
                          'winking face': '😉',
                          'smiling face with smiling eyes': '😊',
                          'smiling face with halo': '😇',
                          'smiling face with hearts': '🥰',
                          'smiling face with heart eyes': '😍',
                          'star struck': '🤩',
                          'face blowing a kiss': '😘',
                          'kissing face': '😗',
                          'smiling face': '☺️',
                          'kissing face with closed eyes': '😚',
                          'kissing face with smiling eyes': '😙',
                          'face savoring food': '😋',
                          'face with tongue': '😛',
                          'winking face with tongue': '😜',
                          'zany face': '🤪',
                          'squinting face with tongue': '😝',
                          'money mouth face': '🤑',
                          'hugging face': '🤗',
                          'face with hand over mouth': '🤭',
                          'shushing face': '🤫',
                          'thinking face': '🤔',
                          'zipper mouth face': '🤐',
                          'face with raised eyebrow': '🤨',
                          'neutral face': '😐',
                          'expressionless face': '😑',
                          'face without mouth': '😶',
                          'smirking face': '😏',
                          'unamused face': '😒',
                          'face with rolling eyes': '🙄',
                          'grimacing face': '😬',
                          'lying face': '🤥',
                          'relieved face': '😌',
                          'pensive face': '😔',
                          'sleepy face': '😪',
                          'drooling face': '🤤',
                          'sleeping face': '😴',
                          'face with medical mask': '😷',
                          'face with thermometer': '🤒',
                          'face with head bandage': '🤕',
                          'nauseated face': '🤢',
                          'face vomiting': '🤮',
                          'sneezing face': '🤧',
                          'hot face': '🥵',
                          'cold face': '🥶',
                          'woozy face': '🥴',
                          'dizzy face': '😵',
                          'exploding head': '🤯',
                          'cowboy hat face': '🤠',
                          'partying face': '🥳',
                          'smiling face with sunglasses': '😎',
                          'nerd face': '🤓',
                          'face with monocle': '🧐',
                          'confused face': '😕',
                          'worried face': '😟',
                          'slightly frowning face': '🙁',
                          'frowning face': '☹️',
                          'face with open mouth': '😮',
                          'hushed face': '😯',
                          'astonished face': '😲',
                          'flushed face': '😳',
                          'pleading face': '🥺',
                          'frowning face with open mouth': '😦',
                          'anguished face': '😧',
                          'fearful face': '😨',
                          'anxious face with sweat': '😰',
                          'sad but relieved face': '😥',
                          'crying face': '😢',
                          'loudly crying face': '😭',
                          'face screaming in fear': '😱',
                          'confounded face': '😖',
                          'persevering face': '😣',
                          'disappointed face': '😞',
                          'downcast face with sweat': '😓',
                          'weary face': '😩',
                          'tired face': '😫',
                          'yawning face': '🥱',
                          'face with steam from nose': '😤',
                          'pouting face': '😡',
                          'angry face': '😠',
                          'face with symbols on mouth': '🤬',
                          'smiling face with horns': '😈',
                          'angry face with horns': '👿',
                          skull: '💀',
                          'skull and crossbones': '☠️',
                          'pile of poo': '💩',
                          'clown face': '🤡',
                          ogre: '👹',
                          goblin: '👺',
                          ghost: '👻',
                          alien: '👽',
                          'alien monster': '👾',
                          robot: '🤖',
                          'grinning cat': '😺',
                          'grinning cat with smiling eyes': '😸',
                          'cat with tears of joy': '😹',
                          'smiling cat with heart eyes': '😻',
                          'cat with wry smile': '😼',
                          'kissing cat': '😽',
                          'weary cat': '🙀',
                          'crying cat': '😿',
                          'pouting cat': '😾',
                          'see no evil monkey': '🙈',
                          'hear no evil monkey': '🙉',
                          'speak no evil monkey': '🙊',
                        },
                      },
                      [`<img src=${t['鼓掌']}>`]: { type: 'image', items: t },
                    }
                  })(r.emotCDN))
              )
          !(function () {
            try {
              for (const e in h) {
                if (h[e].type === mt) continue
                const t = h[e].items
                b = { ...b, ...t }
              }
            } catch (e) {
              console.log(e)
            }
          })()
        })(),
        L()
    }),
      T(() => {
        A(), i()
      })
    return (
      (e.$$set = (e) => {
        'cancel' in e && n(0, (a = e.cancel)),
          'pid' in e && n(19, (m = e.pid)),
          'rid' in e && n(20, (u = e.rid)),
          'wordLimit' in e && n(21, (p = e.wordLimit))
      }),
      (e.$$.update = () => {
        if (2097154 & e.$$.dirty[0]) {
          n(10, (z = p.content))
          const e = new DOMParser().parseFromString(C, 'text/html')
          n(11, ($ = e.body.textContent.length + e.body.querySelectorAll('img').length))
        }
      }),
      [
        a,
        C,
        g,
        v,
        h,
        c,
        w,
        y,
        x,
        k,
        z,
        $,
        r,
        l,
        D,
        function () {
          n(6, (w = !w))
        },
        L,
        function (e, t, o) {
          const i = k.content.value
          let s = c.selectionStart,
            r = c.selectionEnd
          const l = i.substring(0, s),
            a = i.substring(r)
          let m
          c.focus(),
            o === mt
              ? (n(9, (k.content.value = `${l}${t}${a}`), k), (m = (l + t).length))
              : (n(9, (k.content.value = `${l}[${e}]${a}`), k), (m = (l + e).length + 2)),
            E(),
            (H(), I).then(() => {
              c.setSelectionRange(m, m)
            })
        },
        async function () {
          try {
            if (!y && !x) return
            const e = {
              type: 'COMMIT_COMMENT',
              nick: k.nick.value,
              mail: k.mail.value,
              site: k.site.value,
              content: C,
              path: r.path,
              pid: m,
              rid: u,
            }
            n(7, (y = !0))
            const t = localStorage.DToken
            t && (e.token = t)
            const i = await Ae({ url: r.serverURLs, data: e })
            !i.data && i.msg.includes('login') && o({ type: 'error', text: Le('pleaseLogin') }),
              Array.isArray(i.data) &&
                (i.data.length || o({ type: 'success', duration: 5e3, text: Le('commentsAudit') }),
                l('submitComment', { comment: i.data, pid: m }),
                n(9, (k.content.value = ''), k),
                E(),
                n(6, (w = !1)))
          } catch (e) {
            console.error('Comment failure:', e), o({ type: 'error', text: Le('sendError') })
          } finally {
            n(7, (y = !1))
          }
        },
        m,
        u,
        p,
        function (e) {
          ;(k[e.key].value = this.value), n(9, k)
        },
        (e, t) => (t.target.type = e.type),
        function () {
          ;(k.content.value = this.value), n(9, k)
        },
        function (e) {
          j[e ? 'unshift' : 'push'](() => {
            ;(c = e), n(5, c)
          })
        },
        () => n(2, (g = !g)),
        () => l('onSetting'),
        () => l('onRefresh'),
        () => l('onCancel', !0),
        (e) => n(3, (v = e)),
      ]
    )
  }
  class ht extends ie {
    constructor(e) {
      super(), oe(this, e, vt, at, l, { cancel: 0, pid: 19, rid: 20, wordLimit: 21 }, Fe, [-1, -1])
    }
  }
  function bt(e) {
    const t = Date.now() - e,
      n = 36e5,
      o = parseInt(t / 864e5),
      i = parseInt(t / n),
      s = parseInt(t / 6e4),
      { now: r, minutes: l, hours: c, days: a } = Le('timeAgo')
    return 0 === s
      ? r
      : s < 64
      ? s + l
      : i < 24
      ? i + c
      : o < 7
      ? o + a
      : (function (e) {
          const t = new Date(e)
          return `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, 0)}-${t
            .getDate()
            .toString()
            .padStart(2, 0)}`
        })(e)
  }
  function wt(e) {
    g(
      e,
      'svelte-73dzgt',
      '.D-comments-count span.svelte-73dzgt.svelte-73dzgt{margin-right:4px;font-size:22px;font-weight:bold}.D-comments.svelte-73dzgt.svelte-73dzgt{margin-top:20px;position:relative;padding:15px;border-radius:10px;border:solid 1px var(--D-Low-Color)}.D-comments.svelte-73dzgt.svelte-73dzgt:hover{border-color:rgba(144, 147, 153, 0.7);transition:all 0.8s}.D-comments.svelte-73dzgt:hover>.D-reply.svelte-73dzgt{opacity:1}.D-comment.svelte-73dzgt.svelte-73dzgt{display:flex}.D-comments-child .D-comments.svelte-73dzgt.svelte-73dzgt{margin:0;border:0;border-radius:0;margin-left:40px;padding-top:15px;border-top:dashed 1px var(--D-Low-Color)}.D-comments-child .D-avatar.svelte-73dzgt.svelte-73dzgt{width:32px;height:32px}.D-comments-child .D-reply.svelte-73dzgt.svelte-73dzgt{right:0}.D-comments-child-more.svelte-73dzgt.svelte-73dzgt{cursor:pointer;color:#818181;margin-left:40px;padding-left:30px;font-size:12px;position:relative}.D-comments-child-more.svelte-73dzgt.svelte-73dzgt::after{content:"";top:50%;left:0;width:26px;height:1px;position:absolute;background:rgba(129, 129, 129, 0.5)}.D-comments-child-more.svelte-73dzgt svg.svelte-73dzgt{width:13px;height:13px;fill:currentColor;vertical-align:middle}.D-headers.svelte-73dzgt.svelte-73dzgt{display:flex;align-items:center}.D-heads.svelte-73dzgt.svelte-73dzgt{display:flex;flex-direction:column}.D-avatar.svelte-73dzgt.svelte-73dzgt{width:40px;height:40px;margin-right:10px;border-radius:50%}.D-nick.svelte-73dzgt.svelte-73dzgt{color:inherit;font-weight:600;text-decoration:none}.D-tag.svelte-73dzgt.svelte-73dzgt{padding:2px 4px;color:#fff;margin-left:5px;font-size:12px;border-radius:3px}.D-master.svelte-73dzgt.svelte-73dzgt{background:#ffa51e}.D-stick.svelte-73dzgt.svelte-73dzgt{background:var(--D-stick-Color)}time.D-time.svelte-73dzgt.svelte-73dzgt{color:#bbb;font-size:0.75rem}.D-content.svelte-73dzgt.svelte-73dzgt{margin:10px 0;font-size:0.9rem;white-space:pre-wrap;word-break:break-all}.D-content.svelte-73dzgt p{display:inline}.D-content.svelte-73dzgt img{width:100%}.D-reply.svelte-73dzgt.svelte-73dzgt{position:absolute;opacity:0;right:15px;top:15px;padding:6px 10px;color:#fff;font-size:13px;text-align:center;cursor:pointer;background-color:var(--D-main-Color);border:none;border-radius:8px;transition:all 0.3s ease-out}'
    )
  }
  function yt(e, t, n) {
    const o = e.slice()
    return (o[13] = t[n]), (o[14] = t), (o[15] = n), o
  }
  function xt(e) {
    let t,
      n,
      o = e[13].nick + ''
    return {
      c() {
        ;(t = w('span')), (n = x(o)), k(t, 'class', 'D-nick svelte-73dzgt')
      },
      m(e, o) {
        v(e, t, o), f(t, n)
      },
      p(e, t) {
        1 & t && o !== (o = e[13].nick + '') && z(n, o)
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function Dt(e) {
    let t,
      n,
      o,
      i = e[13].nick + ''
    return {
      c() {
        ;(t = w('a')),
          (n = x(i)),
          k(t, 'class', 'D-nick svelte-73dzgt'),
          k(t, 'href', (o = e[13].site)),
          k(t, 'target', '_blank')
      },
      m(e, o) {
        v(e, t, o), f(t, n)
      },
      p(e, s) {
        1 & s && i !== (i = e[13].nick + '') && z(n, i),
          1 & s && o !== (o = e[13].site) && k(t, 'href', o)
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function $t(e) {
    let n
    return {
      c() {
        ;(n = w('span')),
          (n.textContent = `${e[5].master}`),
          k(n, 'class', 'D-master D-tag svelte-73dzgt')
      },
      m(e, t) {
        v(e, n, t)
      },
      p: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function kt(e) {
    let n
    return {
      c() {
        ;(n = w('span')),
          (n.textContent = `${e[5].stick}`),
          k(n, 'class', 'D-stick D-tag svelte-73dzgt')
      },
      m(e, t) {
        v(e, n, t)
      },
      p: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function Ct(e) {
    let t,
      n,
      o,
      i,
      s,
      r,
      l,
      c = e[13].rnick + ''
    return {
      c() {
        ;(t = w('a')),
          (n = w('strong')),
          (o = x('@')),
          (i = x(c)),
          (s = x(':')),
          (l = D()),
          k(t, 'href', (r = '#' + e[13].pid))
      },
      m(e, r) {
        v(e, t, r), f(t, n), f(n, o), f(n, i), f(n, s), v(e, l, r)
      },
      p(e, n) {
        1 & n && c !== (c = e[13].rnick + '') && z(i, c),
          1 & n && r !== (r = '#' + e[13].pid) && k(t, 'href', r)
      },
      d(e) {
        e && h(t), e && h(l)
      },
    }
  }
  function zt(e) {
    let t, n
    return (
      (t = new ht({ props: { cancel: !0, pid: e[3], rid: e[4], wordLimit: e[2] } })),
      t.$on('onCancel', e[6]),
      t.$on('submitComment', e[7]),
      {
        c() {
          ee(t.$$.fragment)
        },
        m(e, o) {
          te(t, e, o), (n = !0)
        },
        p(e, n) {
          const o = {}
          8 & n && (o.pid = e[3]),
            16 & n && (o.rid = e[4]),
            4 & n && (o.wordLimit = e[2]),
            t.$set(o)
        },
        i(e) {
          n || (K(t.$$.fragment, e), (n = !0))
        },
        o(e) {
          X(t.$$.fragment, e), (n = !1)
        },
        d(e) {
          ne(t, e)
        },
      }
    )
  }
  function Et(e) {
    let t, n, o, i
    ;(n = new Tt({
      props: {
        comments: e[13].isMore ? e[13].replys : e[13].replys.slice(0, 3),
        replying: e[1],
        wordLimit: e[2],
      },
    })),
      n.$on('onReply', e[8]),
      n.$on('submitComment', e[7])
    let s = !e[13].isMore && e[13].replys.length > 3 && Lt(e)
    return {
      c() {
        ;(t = w('div')), ee(n.$$.fragment), (o = D()), s && s.c(), k(t, 'class', 'D-comments-child')
      },
      m(e, r) {
        v(e, t, r), te(n, t, null), f(t, o), s && s.m(t, null), (i = !0)
      },
      p(e, o) {
        const i = {}
        1 & o && (i.comments = e[13].isMore ? e[13].replys : e[13].replys.slice(0, 3)),
          2 & o && (i.replying = e[1]),
          4 & o && (i.wordLimit = e[2]),
          n.$set(i),
          !e[13].isMore && e[13].replys.length > 3
            ? s
              ? s.p(e, o)
              : ((s = Lt(e)), s.c(), s.m(t, null))
            : s && (s.d(1), (s = null))
      },
      i(e) {
        i || (K(n.$$.fragment, e), (i = !0))
      },
      o(e) {
        X(n.$$.fragment, e), (i = !1)
      },
      d(e) {
        e && h(t), ne(n), s && s.d()
      },
    }
  }
  function Lt(e) {
    let t,
      n,
      o,
      i,
      s,
      r,
      l,
      c = Le('moreCommentsChild').replace('$counter', e[13].replys.length - 3) + ''
    function a() {
      return e[9](e[13], e[14], e[15])
    }
    return {
      c() {
        ;(t = w('div')),
          (n = x(c)),
          (o = D()),
          (i = y('svg')),
          (s = y('path')),
          k(
            s,
            'd',
            'M10.291 4.163a.466.466 0 00-.707 0L6.437 7.659 3.291 4.163a.465.465 0 00-.707 0 .6.6 0 000 .785l3.5 3.89c.094.103.22.162.353.162.133 0 .26-.059.354-.163l3.5-3.889a.6.6 0 000-.785z'
          ),
          k(i, 'viewBox', '0 0 13 13'),
          k(i, 'class', 'svelte-73dzgt'),
          k(t, 'class', 'D-comments-child-more svelte-73dzgt')
      },
      m(e, c) {
        v(e, t, c), f(t, n), f(t, o), f(t, i), f(i, s), r || ((l = $(t, 'click', a)), (r = !0))
      },
      p(t, o) {
        ;(e = t),
          1 & o &&
            c !== (c = Le('moreCommentsChild').replace('$counter', e[13].replys.length - 3) + '') &&
            z(n, c)
      },
      d(e) {
        e && h(t), (r = !1), l()
      },
    }
  }
  function At(e) {
    let t,
      n,
      o,
      i,
      s,
      l,
      c,
      a,
      d,
      u,
      p,
      g,
      b,
      y,
      C,
      E,
      L,
      A,
      S,
      M,
      T,
      _,
      N,
      O,
      j,
      P,
      R,
      I,
      q = bt(e[13].time) + '',
      H = e[13].content + ''
    function B(e, t) {
      return e[13].site ? Dt : xt
    }
    let U = B(e),
      F = U(e),
      V = e[13].master && $t(e),
      G = e[13].stick && kt(e),
      Y = e[13].pid && Ct(e),
      J = e[1] === e[13].id && zt(e),
      Z = e[13].replys && e[13].replys.length && Et(e)
    return {
      c() {
        ;(t = w('div')),
          (n = w('div')),
          (o = w('img')),
          (c = D()),
          (a = w('div')),
          (d = w('div')),
          (u = w('div')),
          (p = w('div')),
          F.c(),
          (g = D()),
          V && V.c(),
          (b = D()),
          G && G.c(),
          (y = D()),
          (C = w('time')),
          (E = x(q)),
          (L = D()),
          (A = w('div')),
          Y && Y.c(),
          (S = w('span')),
          (M = D()),
          (T = w('button')),
          (T.textContent = `${Le('reply')}`),
          (_ = D()),
          J && J.c(),
          (N = D()),
          Z && Z.c(),
          (O = D()),
          k(o, 'class', 'D-avatar svelte-73dzgt'),
          m(o.src, (i = e[5].imgLoading)) || k(o, 'src', i),
          k(o, 'd-src', (s = e[13].avatar)),
          k(o, 'alt', (l = e[13].nick)),
          k(p, 'class', 'D-head'),
          k(C, 'class', 'D-time svelte-73dzgt'),
          k(u, 'class', 'D-heads svelte-73dzgt'),
          k(d, 'class', 'D-headers svelte-73dzgt'),
          k(S, 'class', 'svelte-73dzgt'),
          k(A, 'class', 'D-content svelte-73dzgt'),
          k(a, 'class', 'D-comment-main'),
          k(n, 'class', 'D-comment svelte-73dzgt'),
          k(T, 'class', 'D-reply svelte-73dzgt'),
          k(t, 'class', 'D-comments svelte-73dzgt'),
          k(t, 'id', (j = e[13].id))
      },
      m(i, s) {
        v(i, t, s),
          f(t, n),
          f(n, o),
          f(n, c),
          f(n, a),
          f(a, d),
          f(d, u),
          f(u, p),
          F.m(p, null),
          f(p, g),
          V && V.m(p, null),
          f(p, b),
          G && G.m(p, null),
          f(u, y),
          f(u, C),
          f(C, E),
          f(a, L),
          f(a, A),
          Y && Y.m(A, null),
          f(A, S),
          (S.innerHTML = H),
          f(t, M),
          f(t, T),
          f(t, _),
          J && J.m(t, null),
          f(t, N),
          Z && Z.m(t, null),
          f(t, O),
          (P = !0),
          R ||
            ((I = $(T, 'click', function () {
              r(e[6](e[13].id, e[13].pid)) && e[6](e[13].id, e[13].pid).apply(this, arguments)
            })),
            (R = !0))
      },
      p(n, i) {
        ;(e = n),
          (!P || (1 & i && s !== (s = e[13].avatar))) && k(o, 'd-src', s),
          (!P || (1 & i && l !== (l = e[13].nick))) && k(o, 'alt', l),
          U === (U = B(e)) && F ? F.p(e, i) : (F.d(1), (F = U(e)), F && (F.c(), F.m(p, g))),
          e[13].master
            ? V
              ? V.p(e, i)
              : ((V = $t(e)), V.c(), V.m(p, b))
            : V && (V.d(1), (V = null)),
          e[13].stick
            ? G
              ? G.p(e, i)
              : ((G = kt(e)), G.c(), G.m(p, null))
            : G && (G.d(1), (G = null)),
          (!P || 1 & i) && q !== (q = bt(e[13].time) + '') && z(E, q),
          e[13].pid ? (Y ? Y.p(e, i) : ((Y = Ct(e)), Y.c(), Y.m(A, S))) : Y && (Y.d(1), (Y = null)),
          (!P || 1 & i) && H !== (H = e[13].content + '') && (S.innerHTML = H),
          e[1] === e[13].id
            ? J
              ? (J.p(e, i), 3 & i && K(J, 1))
              : ((J = zt(e)), J.c(), K(J, 1), J.m(t, N))
            : J &&
              (W(),
              X(J, 1, 1, () => {
                J = null
              }),
              Q()),
          e[13].replys && e[13].replys.length
            ? Z
              ? (Z.p(e, i), 1 & i && K(Z, 1))
              : ((Z = Et(e)), Z.c(), K(Z, 1), Z.m(t, O))
            : Z &&
              (W(),
              X(Z, 1, 1, () => {
                Z = null
              }),
              Q()),
          (!P || (1 & i && j !== (j = e[13].id))) && k(t, 'id', j)
      },
      i(e) {
        P || (K(J), K(Z), (P = !0))
      },
      o(e) {
        X(J), X(Z), (P = !1)
      },
      d(e) {
        e && h(t), F.d(), V && V.d(), G && G.d(), Y && Y.d(), J && J.d(), Z && Z.d(), (R = !1), I()
      },
    }
  }
  function St(e) {
    let t,
      n,
      o = e[0],
      i = []
    for (let t = 0; t < o.length; t += 1) i[t] = At(yt(e, o, t))
    const s = (e) =>
      X(i[e], 1, 1, () => {
        i[e] = null
      })
    return {
      c() {
        for (let e = 0; e < i.length; e += 1) i[e].c()
        t = x('')
      },
      m(e, o) {
        for (let t = 0; t < i.length; t += 1) i[t].m(e, o)
        v(e, t, o), (n = !0)
      },
      p(e, [n]) {
        if (255 & n) {
          let r
          for (o = e[0], r = 0; r < o.length; r += 1) {
            const s = yt(e, o, r)
            i[r]
              ? (i[r].p(s, n), K(i[r], 1))
              : ((i[r] = At(s)), i[r].c(), K(i[r], 1), i[r].m(t.parentNode, t))
          }
          for (W(), r = o.length; r < i.length; r += 1) s(r)
          Q()
        }
      },
      i(e) {
        if (!n) {
          for (let e = 0; e < o.length; e += 1) K(i[e])
          n = !0
        }
      },
      o(e) {
        i = i.filter(Boolean)
        for (let e = 0; e < i.length; e += 1) X(i[e])
        n = !1
      },
      d(e) {
        b(i, e), e && h(t)
      },
    }
  }
  function Mt(e, t, n) {
    let o, i
    d(e, De, (e) => n(10, (o = e))), d(e, ye, (e) => n(11, (i = e)))
    let { comments: s = [] } = t,
      { replying: r = [] } = t,
      { wordLimit: l = { nick: 0, mail: 0, site: 0, content: 0 } } = t,
      c = i
    const a = _()
    M(() => {
      o()
    }),
      T(() => {
        o()
      })
    let m = '',
      u = ''
    return (
      (e.$$set = (e) => {
        'comments' in e && n(0, (s = e.comments)),
          'replying' in e && n(1, (r = e.replying)),
          'wordLimit' in e && n(2, (l = e.wordLimit))
      }),
      [
        s,
        r,
        l,
        m,
        u,
        c,
        function (e, t) {
          n(3, (m = t || e)), n(4, (u = e)), a('onReply', e)
        },
        function (e) {
          const { comment: t, pid: n } = e.detail
          a('submitComment', { comment: t, pid: n })
        },
        function (t) {
          N.call(this, e, t)
        },
        (e, t, o) => {
          n(0, (t[o].isMore = !0), s)
        },
      ]
    )
  }
  class Tt extends ie {
    constructor(e) {
      super(), oe(this, e, Mt, St, l, { comments: 0, replying: 1, wordLimit: 2 }, wt)
    }
  }
  function _t(e) {
    g(
      e,
      'svelte-9s94zw',
      '.D-comments-headers.svelte-9s94zw{display:flex;justify-content:space-between}.D-more.svelte-9s94zw{display:flex;justify-content:center;margin:16px 0 10px}.D-more-button.svelte-9s94zw{opacity:0.8;width:auto;min-width:80px;height:36px;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:8px 16px;line-height:20px;font-weight:600;font-size:12px;border-radius:12px;background-color:var(--D-main-Color)}'
    )
  }
  function Nt(e) {
    let t,
      n,
      o,
      i,
      s = Le('comment') + ''
    return {
      c() {
        ;(t = w('div')), (n = x(e[2])), (o = D()), (i = x(s)), k(t, 'class', 'D-comments-count')
      },
      m(e, s) {
        v(e, t, s), f(t, n), f(t, o), f(t, i)
      },
      p(e, t) {
        4 & t && z(n, e[2])
      },
      d(e) {
        e && h(t)
      },
    }
  }
  function Ot(e) {
    let t, n, o, i, s, r, l
    const c = [Pt, jt],
      a = []
    function m(e, t) {
      return e[4] ? 0 : 1
    }
    return (
      (o = m(e)),
      (i = a[o] = c[o](e)),
      {
        c() {
          ;(t = w('div')),
            (n = w('button')),
            i.c(),
            k(n, 'class', 'D-more-button svelte-9s94zw'),
            (n.disabled = e[1]),
            k(t, 'class', 'D-more svelte-9s94zw')
        },
        m(i, c) {
          v(i, t, c), f(t, n), a[o].m(n, null), (s = !0), r || ((l = $(n, 'click', e[7])), (r = !0))
        },
        p(e, t) {
          let r = o
          ;(o = m(e)),
            o === r
              ? a[o].p(e, t)
              : (W(),
                X(a[r], 1, 1, () => {
                  a[r] = null
                }),
                Q(),
                (i = a[o]),
                i ? i.p(e, t) : ((i = a[o] = c[o](e)), i.c()),
                K(i, 1),
                i.m(n, null)),
            (!s || 2 & t) && (n.disabled = e[1])
        },
        i(e) {
          s || (K(i), (s = !0))
        },
        o(e) {
          X(i), (s = !1)
        },
        d(e) {
          e && h(t), a[o].d(), (r = !1), l()
        },
      }
    )
  }
  function jt(e) {
    let n,
      o = Le('more') + ''
    return {
      c() {
        n = x(o)
      },
      m(e, t) {
        v(e, n, t)
      },
      p: t,
      i: t,
      o: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function Pt(e) {
    let n, o
    return (
      (n = new Pe({})),
      {
        c() {
          ee(n.$$.fragment)
        },
        m(e, t) {
          te(n, e, t), (o = !0)
        },
        p: t,
        i(e) {
          o || (K(n.$$.fragment, e), (o = !0))
        },
        o(e) {
          X(n.$$.fragment, e), (o = !1)
        },
        d(e) {
          ne(n, e)
        },
      }
    )
  }
  function Rt(e) {
    let t,
      n,
      o,
      i,
      s,
      r,
      l,
      c = e[2] && Nt(e)
    ;(s = new Tt({ props: { comments: e[0], replying: e[5], wordLimit: e[6] } })),
      s.$on('onReply', e[10]),
      s.$on('submitComment', e[8])
    let a = e[3] && Ot(e)
    return {
      c() {
        ;(t = w('div')),
          (n = w('div')),
          c && c.c(),
          (o = D()),
          (i = w('div')),
          ee(s.$$.fragment),
          (r = D()),
          a && a.c(),
          k(n, 'class', 'D-comments-headers svelte-9s94zw'),
          k(i, 'class', 'D-comments-list'),
          k(t, 'class', 'D-comments-wrap')
      },
      m(e, m) {
        v(e, t, m),
          f(t, n),
          c && c.m(n, null),
          f(t, o),
          f(t, i),
          te(s, i, null),
          f(t, r),
          a && a.m(t, null),
          (l = !0)
      },
      p(e, [o]) {
        e[2] ? (c ? c.p(e, o) : ((c = Nt(e)), c.c(), c.m(n, null))) : c && (c.d(1), (c = null))
        const i = {}
        1 & o && (i.comments = e[0]),
          32 & o && (i.replying = e[5]),
          64 & o && (i.wordLimit = e[6]),
          s.$set(i),
          e[3]
            ? a
              ? (a.p(e, o), 8 & o && K(a, 1))
              : ((a = Ot(e)), a.c(), K(a, 1), a.m(t, null))
            : a &&
              (W(),
              X(a, 1, 1, () => {
                a = null
              }),
              Q())
      },
      i(e) {
        l || (K(s.$$.fragment, e), K(a), (l = !0))
      },
      o(e) {
        X(s.$$.fragment, e), X(a), (l = !1)
      },
      d(e) {
        e && h(t), c && c.d(), ne(s), a && a.d()
      },
    }
  }
  function It(e, t, n) {
    let o, i, s
    d(e, xe, (e) => n(13, (o = e))),
      d(e, De, (e) => n(14, (i = e))),
      d(e, ye, (e) => n(15, (s = e)))
    let r = s
    const l = _()
    let c,
      { comment: a = [] } = t,
      m = !1,
      u = [],
      p = 0,
      f = 1,
      g = 1,
      v = !1,
      h = !1,
      b = ''
    async function w() {
      try {
        const { data: e, msg: t } = await Ae({
          url: r.serverURLs,
          data: { type: 'GET_COMMENT', path: r.path, pageNo: f },
        })
        if (!e) throw new Error(t)
        n(2, (p = e.counts)),
          (g = e.pageCount),
          n(0, (u = [...u, ...e.comments])),
          n(6, (c = e.wordNumber)),
          l('onComment', u.length),
          l('wordLimit', e.wordNumber)
      } catch (e) {
        console.error('Request failed', e),
          o({ type: 'error', time: 1500, text: Le('commentsError') }),
          l('onCommentError')
      }
      n(3, (v = g > f))
    }
    M(() => {
      w()
    }),
      T(() => {
        i()
      })
    return (
      (e.$$set = (e) => {
        'comment' in e && n(9, (a = e.comment))
      }),
      (e.$$.update = () => {
        513 & e.$$.dirty && n(0, (u = [...a, ...u]))
      }),
      [
        u,
        m,
        p,
        v,
        h,
        b,
        c,
        async function () {
          n(1, (m = !0)), n(4, (h = !0)), f < g && (f++, await w(), n(1, (m = !1)), n(4, (h = !1)))
        },
        function (e) {
          for (const t of u)
            if (t.id === e.detail.pid) {
              t.replys = [...e.detail.comment, ...(t.replys || [])]
              break
            }
          n(0, u), n(9, a)
        },
        a,
        ({ detail: e }) => n(5, (b = e)),
      ]
    )
  }
  class qt extends ie {
    constructor(e) {
      super(), oe(this, e, It, Rt, l, { comment: 9 }, _t)
    }
  }
  function Ht(e) {
    g(
      e,
      'svelte-1u1ezql',
      '.D-footer.svelte-1u1ezql{text-align:right;font-size:0.75em;margin-top:1em}'
    )
  }
  function Bt(e) {
    let n, o, i, s, r
    return {
      c() {
        ;(n = w('div')),
          (o = x('Powered by ')),
          (i = w('strong')),
          (i.innerHTML = '<a href="https://Discuss.js.org" target="_blank">Discuss</a>'),
          (s = x(' v')),
          (r = x(Se)),
          k(n, 'class', 'D-footer svelte-1u1ezql')
      },
      m(e, t) {
        v(e, n, t), f(n, o), f(n, i), f(n, s), f(n, r)
      },
      p: t,
      i: t,
      o: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function Ut(e, t, n) {
    let o
    d(e, ye, (e) => n(0, (o = e)))
    let i = o
    return (
      M(() => {
        !(async function () {
          const e = document.getElementById('Discuss-Visitors')
          if (!e) return
          const t = { url: i.serverURLs, data: { type: 'COUNTER', path: i.path } },
            { data: n } = await Ae(t)
          n && (e.innerText = n)
        })()
      }),
      []
    )
  }
  class Ft extends ie {
    constructor(e) {
      super(), oe(this, e, Ut, Bt, l, {}, Ht)
    }
  }
  const Vt = 'D-zIndex'
  let Gt
  if ((document.currentScript && (Gt = document.currentScript.src), !Gt)) {
    const e = document.getElementsByTagName('script')
    e.length && (Gt = e[e.length - 1].src)
  }
  if (!Gt) throw new Error('Automatic publicPath is not supported in this browser')
  ;(Gt = Gt.replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\/[^/]+$/, '/')),
    (window.DChunk = [])
  const Yt = { admin: 'discuss.admin.js' }
  function Jt(e) {
    let t, n
    return (
      (t = new qt({ props: { comment: e[3] } })),
      t.$on('onComment', e[7]),
      t.$on('wordLimit', e[9]),
      t.$on('onCommentError', e[8]),
      {
        c() {
          ee(t.$$.fragment)
        },
        m(e, o) {
          te(t, e, o), (n = !0)
        },
        p(e, n) {
          const o = {}
          8 & n && (o.comment = e[3]), t.$set(o)
        },
        i(e) {
          n || (K(t.$$.fragment, e), (n = !0))
        },
        o(e) {
          X(t.$$.fragment, e), (n = !1)
        },
        d(e) {
          ne(t, e)
        },
      }
    )
  }
  function Wt(e) {
    let n,
      o = Le('notComments') + ''
    return {
      c() {
        n = x(o)
      },
      m(e, t) {
        v(e, n, t)
      },
      p: t,
      i: t,
      o: t,
      d(e) {
        e && h(n)
      },
    }
  }
  function Qt(e) {
    let n, o
    return (
      (n = new Pe({})),
      {
        c() {
          ee(n.$$.fragment)
        },
        m(e, t) {
          te(n, e, t), (o = !0)
        },
        p: t,
        i(e) {
          o || (K(n.$$.fragment, e), (o = !0))
        },
        o(e) {
          X(n.$$.fragment, e), (o = !1)
        },
        d(e) {
          ne(n, e)
        },
      }
    )
  }
  function Kt(e) {
    let t, n, o, i, s, r, l, c, a, m, d, u, p, g, b
    var y = ke
    y && (t = L(y, {})),
      (r = new ht({ props: { wordLimit: e[4] } })),
      r.$on('onRefresh', e[6]),
      r.$on('onSetting', e[5]),
      r.$on('submitComment', e[10])
    let x = e[0] && Jt(e)
    const $ = [Qt, Wt],
      C = []
    function z(e, t) {
      return e[1] ? 0 : e[2] ? 1 : -1
    }
    return (
      ~(m = z(e)) && (d = C[m] = $[m](e)),
      (g = new Ft({})),
      {
        c() {
          t && ee(t.$$.fragment),
            (n = D()),
            (o = w('div')),
            (i = w('div')),
            (s = D()),
            ee(r.$$.fragment),
            (l = D()),
            x && x.c(),
            (c = D()),
            (a = w('div')),
            d && d.c(),
            (p = D()),
            ee(g.$$.fragment),
            k(i, 'class', 'D-admin-wrap'),
            k(a, 'class', 'D-loading-comments'),
            k(a, 'style', (u = e[1] || e[2] ? '' : 'margin:0')),
            k(o, 'id', 'Discuss'),
            k(o, 'class', 'Discuss')
        },
        m(e, d) {
          t && te(t, e, d),
            v(e, n, d),
            v(e, o, d),
            f(o, i),
            f(o, s),
            te(r, o, null),
            f(o, l),
            x && x.m(o, null),
            f(o, c),
            f(o, a),
            ~m && C[m].m(a, null),
            f(o, p),
            te(g, o, null),
            (b = !0)
        },
        p(e, [i]) {
          if (y !== (y = ke)) {
            if (t) {
              W()
              const e = t
              X(e.$$.fragment, 1, 0, () => {
                ne(e, 1)
              }),
                Q()
            }
            y
              ? ((t = L(y, {})), ee(t.$$.fragment), K(t.$$.fragment, 1), te(t, n.parentNode, n))
              : (t = null)
          }
          const s = {}
          16 & i && (s.wordLimit = e[4]),
            r.$set(s),
            e[0]
              ? x
                ? (x.p(e, i), 1 & i && K(x, 1))
                : ((x = Jt(e)), x.c(), K(x, 1), x.m(o, c))
              : x &&
                (W(),
                X(x, 1, 1, () => {
                  x = null
                }),
                Q())
          let l = m
          ;(m = z(e)),
            m === l
              ? ~m && C[m].p(e, i)
              : (d &&
                  (W(),
                  X(C[l], 1, 1, () => {
                    C[l] = null
                  }),
                  Q()),
                ~m
                  ? ((d = C[m]),
                    d ? d.p(e, i) : ((d = C[m] = $[m](e)), d.c()),
                    K(d, 1),
                    d.m(a, null))
                  : (d = null)),
            (!b || (6 & i && u !== (u = e[1] || e[2] ? '' : 'margin:0'))) && k(a, 'style', u)
        },
        i(e) {
          b ||
            (t && K(t.$$.fragment, e),
            K(r.$$.fragment, e),
            K(x),
            K(d),
            K(g.$$.fragment, e),
            (b = !0))
        },
        o(e) {
          t && X(t.$$.fragment, e), X(r.$$.fragment, e), X(x), X(d), X(g.$$.fragment, e), (b = !1)
        },
        d(e) {
          t && ne(t, e), e && h(n), e && h(o), ne(r), x && x.d(), ~m && C[m].d(), ne(g)
        },
      }
    )
  }
  function Xt(e, t, n) {
    let o, i
    d(e, xe, (e) => n(12, (o = e))), d(e, ye, (e) => n(13, (i = e)))
    let s,
      r,
      l = !0,
      c = !0,
      a = !1,
      m = []
    function u() {
      !(function (e) {
        const t = document.querySelector('.D-admin-wrap')
        ;[...document.body.querySelectorAll('*:not(._msg)')].forEach((n) => {
          if (t.contains(n)) return
          const o = window.getComputedStyle(n).zIndex
          if ('close' === e) return n.classList.remove(Vt)
          'open' === e && o > 0 && n.classList.add(Vt)
        })
        let n,
          o = document.querySelector('#Discuss')
        for (; 'BODY' !== n; )
          (o = o.parentElement),
            (n = o.nodeName),
            o.classList.contains(Vt) && o.classList.remove(Vt)
      })('open'),
        (s = window.discussAdmin.init({ ...i, el: '.D-admin-wrap', show: !0 }))
    }
    function p({ detail: e }) {
      e || n(2, (a = !0)), n(1, (c = !1))
    }
    return [
      l,
      c,
      a,
      m,
      r,
      function () {
        if (
          (window.discussAdmin
            ? u()
            : (o({ text: Le('settingMsg') }),
              ((e, t) => {
                if (window.DChunk.includes(e)) return t()
                window.DChunk.push(e)
                const n = document.createElement('script')
                ;(n.src = Gt + Yt[e]),
                  (n.onload = () => {
                    ;(n.onload = null), t(), n.parentNode && n.parentNode.removeChild(n)
                  }),
                  document.head.appendChild(n)
              })('admin', u)),
          s)
        )
          for (const e of s.$$.ctx)
            '[object Object]' === Object.prototype.toString.call(e) &&
              'function' == typeof e.onOpenAdmin &&
              e.onOpenAdmin('open')
      },
      function () {
        o({ time: 1500, text: Le('refreshMsg') }),
          n(0, (l = !l)),
          n(1, (c = !0)),
          n(3, (m = [])),
          setTimeout(() => {
            n(0, (l = !l))
          }, 1e3)
      },
      p,
      function () {
        p({})
      },
      function ({ detail: e }) {
        n(4, (r = e))
      },
      function (e) {
        n(3, (m = e.detail.comment))
      },
    ]
  }
  class Zt extends ie {
    constructor(e) {
      super(), oe(this, e, Xt, Kt, l, {})
    }
  }
  async function en(e, t) {
    if (!e || !t) throw new Error('"url" or "path" cannot be empty')
    const n = { url: e, method: 'post', data: { type: 'COUNTER', path: t } },
      { data: o } = await Ae(n)
    return o
  }
  async function tn(e, t) {
    if (!e) throw new Error('"url" cannot be empty')
    const n = { url: e, method: 'post', data: { type: 'RECENT_COMMENT', reply: t } },
      { data: o } = await Ae(n)
    return o
  }
  async function nn(e, t, n) {
    if (!e || !t) throw new Error('"url" or "paths" cannot be empty')
    const o = { url: e, method: 'post', data: { type: 'COMMENT_COUNT', paths: t, reply: n } },
      { data: i } = await Ae(o)
    return i
  }
  let on
  function sn(e) {
    console.warn(
      'Disucss:',
      `"${e}" will be removed in a future version, please use "get${e}" instead.`
    )
  }
  var rn = (window.Discuss = {
    init: function (t) {
      var n
      ;(window.DLoad = !1), (n = (t = t || {}).lang), (Ee = 'en' === n ? ze : Ce)
      const o = {
        master: Le('master'),
        stick: Le('stick'),
        ph: Le('content'),
        path: location.pathname,
        visitStat: !0,
        imgLoading: e,
      }
      if (
        (ye.set(Object.assign(o, t)),
        on && on.$destroy(),
        (on = new Zt({ target: document.querySelector(t.el) })),
        t.color)
      ) {
        const e = document.createElement('style')
        ;(e.textContent = `:root{--D-main-Color:${t.color}}`), document.head.appendChild(e)
      }
    },
    getVisitStat: en,
    getRecentComment: tn,
    getCommentCount: nn,
    VisitStat: async function (...e) {
      return sn('VisitStat'), await en(...e)
    },
    RecentComment: async function (...e) {
      return sn('RecentComment'), await tn(...e)
    },
    CommentCount: async function (...e) {
      return sn('CommentCount'), await nn(...e)
    },
  })
  return rn
})()

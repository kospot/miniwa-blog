---
layout: PostLayout
title: 'React State的特性总结'
date: 2022-05-13 20:13:32
tags: ['设计原理']
summary: react的数据主要来源于props和state，state作为内部数据，其变更更新频繁，也更容易出问题，这里主要介绍state相关的一些特性。
---

react 的数据主要来源于 props 和 state，其中 props 是外部数据，state 是内部数据，组件内部通过 state 来保存组件的状态，不同于 vue，它是单向的，由 state 驱动视图的变更。state 的改变统一由 setState api 进行管理。当需要跟外部交互时，使用 props。相对于 props，state 的变更更为频繁和重要，它可能影响到组件的性能，或者显示，这里主要学习一下 state 的特性。

## 一、State 特性理解

### 1、函数式更新和直接更新

因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
如需要，可以使用函数式更新，将函数传递给 setState，该函数将接收先前的 state，并返回一个更新后的值。

```
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});

// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

### 2、数据是向下流动的

不管是父组件或是子组件都无法知道某个组件是有状态的还是无状态的，并且它们也并不关心它是函数组件还是 class 组件。
这就是为什么称 state 为局部的或是封装的的原因。除了拥有并设置了它的组件，其他组件都无法访问。

只能通过把组件自身的 state，作为其他组件的 props 向下传递

```
<FormattedDate date={this.state.date} />

function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

### 4、hook 和 class 的区别

class：当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state。
hook：useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。

```
 constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
     };
  }
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }


const [state, setState] = useState({});
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
```

### 5、更新 State 不触发 Render

当 setState 用相同的值进行更新时，会跳出更新，不触发渲染。Object.is 做浅层比较（对于对象）
对于对象类型的，每次 set 不管值变不变都会触发 render。只有用 ref 包裹的对象才不会触发 render
基础类型的值，即使用 ref 包裹，也会触发 render
https://codepen.io/kospot/pen/zYRKeZr

```
function Test(){
    const refVal = useRef(2)
    const [stateNum, setStateNum] = useState(refVal.current);
    const testRefNum = () => {
        refVal.current = 10
        setStateNum(refVal.current)
    }


    const refVal = useRef({val: 2})
    const [stateObj, setStateObj] = useState(refVal.current);
    const testRefObject = () => {
        refVal.current.val = 10
        setStateObj(refVal.current)
    }
    console.log('in render', stateNum, stateObj)
    return (
        <div>
          <p> stateNum : {{stateNum}}</p>
          <p> stateObj: {{stateObj.val}}</p>
          <button onClick={() => testRefNum()}>
            testRefNum
          </button>
          <button onClick={() => testRefObject()}>
            testRefObject
          </button>
        </div>
    );
}

ReactDOM.render(
 <Test />,
  document.getElementById('root')
);
```

## 二、State 同步和异步

出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。

### 1、同步异步

State 的同步异步，指的是 setState 方法是同步执行还是异步执行，执行了是否立即生效。

异步更新：多次调用 setState，不会触发多次 render，会把 setState 合并更新，再执行 render
同步更新：每次 setState 都会触发 render，render 完后继续往下执行

### 2、案例分析

Demo： react 的 setState 执行顺序
暂时无法在文档外展示此内容

React 基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等，在 React 中这套事件机制被称之为合成事件。
如果 setState 不是由合成事件触发的，那么就会直接执行 diff 和渲染。
setTimeout/setInterval/Promise.then(fn)/fetch 回调/xhr 网络回调时 都是非合成时间，react 无法控制。而采用同步更新机制。

参考文档：

https://juejin.cn/post/6959885030063603743

https://juejin.cn/post/6990635194415841288

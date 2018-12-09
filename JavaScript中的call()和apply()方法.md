### JavaScript中的call()和apply()以及bind()方法

[TOC]

在JS中，`call`、`bind`、`apply`三者都是用来手动改变函数的`this`的指向的。

##### 1、首先我们来看看this指向的理解

举例说明：

```javascript
//例子1
var name = "angel",age = 16,gender = "女";
var obj = {
    name: "sophia",
    sex: this.gender,//此处this指向window
    age : this.age,//同上
    introduce: function() {
        console.log(this.name+",性别："+ this.gender+ "年龄："+ this.age);
        //此处的所有this指向obj
    }
};
console.log(obj.age);//16
obj.introduce();//sophia,性别：undefined年龄：16

//例子2
var hometown = "天水";
function say(){
    var user = "sophia";
    console.log(this.user);//undefined
    console.log(this.hometown);//天水    此处this指向window
}
say(); 
```

> 注意：`this`的指向在`创建函数`的时候是决定不了，只有在`调用`的时候才能决定，**谁调用的就指向谁**。（this永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的）

##### 2、接下来看看this遇到return时的情形

```javascript
//返回值为对象时：
//实例1；
function Example() {
    this.user = "sophia";
    return {};
}
var eg1 = new Example();
console.log(eg1.user); // undefined

//实例2
function Example() {
    this.user = "sophia";
    return function(){};
}
var eg1 = new Example();
console.log(eg1.user); // undefined


//实例3
function Example() {
    this.user = "sophia";
    return undefined;
}
var eg1 = new Example();
console.log(eg1.user); // sophia

//实例4
function Example() {
    this.user = "sophia";
    return ;
}
var eg1 = new Example();
console.log(eg1.user); // sophia
//实例5
function Example() {
    this.user = "sophia";
    return null;
}
var eg1 = new Example();
console.log(eg1.user); // sophia
```

> 总之，如果当返回值是一个对象，那么`this`指向的就是该返回对象，如果返回值不是一个对象那么`this`还是指向函数实例。（尽管null也是对象，然而这里this仍指向函数实例）

call和apply唯一区别就在于函数参数的传递方式不同，`call`是以`逗号` 的形式，`apply`是以`数组`的形式。

##### 3、call()

举例说明：

```javascript
var a = {
    user = "sophia",
    say: function() {
         console.log(this.user);
    }
};
var b = a.say;
b(); // undefined --->谁调用this指向谁；这里this指向window
//下面我们使用call()来改变this指向；
var a = {
    user = "sophia",
    say: function() {
         console.log(this.user);
    }
};
var b = a.say;
b.call(a); //this指向了对象a，结果打印： sophia
```

`call()`方法的第一位参数用来改变`this`指向，后面的参数则需要`罗列`出来，中间用逗号隔开；

```javascript
var a = {
    user: "sophia",
    say : function(m,n){
        console.log(this.user);
        console.log(m*n);
    }
};
var b = a.say;
b.call(a,2,8); // sophia   16
```

##### 4、apply()

`apply()` 方法的应用场景和`call() `相似，第一参数用来改变`this`指向，而`apply()`的第二参数则必须是一个`数组`；

注意：如果`call() `、`apply()`的第一参数写的是`null`，那么`this`指向`window`对象。

##### 5、bind()

```javascript
var a = {
    age: 18,
    say : function() {
        console.log("我今年"+this.age);
    }
};
var b = a.say;
var c = b.bind(a);
console.log(c); //ƒ (){console.log(this.user);}
console.log(c()); // 我今年18； undefined
```

由此我们可以知道`bind()`可以让对应的函数想什么时候调用就什么时候调用，并且可以将参数在执行的时候添加。

```javascript
var a = {
    gender: "女",
    fn: function(o,p,q){
        console.log(this.gender);
        console.log(o,p,q);
    }
};
var b = a.fn;
var c = b.bind(a,6,5);
c();// 女   6 5 undefined
```


# 物业助手

基于 [umijs](https://umijs.org/zh/guide/) 框架搭建的物业助手

## 维护开发

```
＃安装依赖
yarn or yarn install

# 开发
yarn start

# 打包
yarn run build
```

## 开发规范文档

[standard-doc](http://work.lidig.net:8088/framework/front-framework/standard-doc)

## 样式约定
	颜色、间距、字体大小等都以定义变量的方式存在
    
* 颜色值: 定义在 **src/themes/templates/light.js**，继承 `antd` 的变量名约定
* 间距、字体: 定义在 **src/themes/var.less** ，变量名自定义

具体页面的属性使用变量名赋值

```css
.inputIcon {
  color: @normal-color;
}
.inputIconFocus {
  color: @primary-color;
}
```

## 代码规范

* 使用`eslint`、`stylelint`搭配`husky`、`lint-staged`做JS、TS和CSS语法检查
* 使用`commitizen`做代码提交规范控制，需要`npm install -g commitizen`，然后用`git cz`代替`git commit`

## 自适应方案

[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

根据设计稿统一使用px单位赋值

## 注意点

* 新建组件流程：大驼峰命名文件名，文件夹下新建 `index.{jsx|tsx}` 和 `index.less`。

## LICENSE

MIT

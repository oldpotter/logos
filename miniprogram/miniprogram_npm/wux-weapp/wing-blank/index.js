"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/classNames")),_styleToCssString=_interopRequireDefault(require("../helpers/styleToCssString"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-wingblank"},size:{type:String,value:"default"},bodyStyle:{type:[String,Object],value:"",observer:function(e){this.setData({extStyle:(0,_styleToCssString.default)(e)})}}},data:{extStyle:""},computed:{classes:["prefixCls, size",function(e,t){return{wrap:(0,_classNames2.default)(e,_defineProperty({},"".concat(e,"--").concat(t),t))}}]}});
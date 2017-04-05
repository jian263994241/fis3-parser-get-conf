var oConf = null;
var contextPath = '';
var ifExcluded;
var path = require('path');
var fs = require('fs');

/**
 * 发布过程中的 __getConf() 与 __context() 方法
 * @author 康永胜
 * @date   2017-01-12T17:14:31+0800
 * @param  {[type]}                 content [description]
 * @param  {[type]}                 file    [description]
 * @param  {[type]}                 opt     [description]
 * @return {[type]}                         [description]
 */
module.exports = function(content, file, opt){
  contextPath = opt['contextPath'] || '';

  if (!oConf) {
    try{
      oConf = _getConfContent(opt['confFile']);
    }catch(e){
      console.log(e);
      throw 'fis3-parser-get-conf|获取配置信息失败。';
    }

    ifExcluded = opt.ifExcluded || _ifExcluded;
  }
  /*处理html css js文件*/
  if (file.isHtmlLike || file.isCssLike || file.isJsLike) {
    /*__getConf 方法*/
    content = content.replace(/__getConf\(\s*(['"]?)([^)]*?)\1\s*\)/ig, function(all, value1, value2){
      var prop = _getPropertyTool(value2);
      if(file.isJsLike){
        return value1 + prop + value1;
      }
      return prop;
    });

    /*__context 方法*/
    content = content.replace(/__context\(\s*(['"]?)([^)]*?)\1\s*\)/ig, function(all, value1, value2){
      value2 = value2 || '';
      value2 = contextPath + value2;
      if(file.isJsLike){
        value1 = value1 || "'";
        value2 = value1 + value2 + value1;
      }
      return value2;
    });
    
    /*__seajs_mod_id__ 方法*/
    content = content.replace(/__seajs_mod_id__/ig, function(all){
      return 'seajs.data.ids[\'' + file.subpath + '\']';
    });

    return content;
  }

  return content;
}

/**
 * 用于根据属性值列表从配置中获取配置信息
 * @author 康永胜
 * @date   2017-01-22T16:39:12+0800
 * @param  {String}                 propertiesStr [以 "." 分割的属性列表]
 * @return {String}                               [属性值]
 */
function _getPropertyTool(propertiesStr){
  if(ifExcluded(propertiesStr)){
    return '';
  }
  
  propertiesStr = propertiesStr || '';
  propertiesStr = propertiesStr.trim();

  if(!propertiesStr || !oConf){
    return '';
  }

  var properties = propertiesStr.split('.');
  var length = properties.length;
  var result = '';
  var currentDomain = oConf;

  for (var i = 0; i < length; i++) {
    currentDomain = result = currentDomain[properties[i]];
    if(!result)break;
  }

  return result;
}

/**
 * 是否将所访问的属性隐藏
 * @author 康永胜
 * @date   2017-01-22T16:40:30+0800
 * @param  {String}                 propertiesStr [以 "." 分割的属性列表]
 * @return {boolean}                              [是否隐藏属性]
 */
function _ifExcluded(propertiesStr){
  return false;
}

/**
 * 获取配置文件的内容
 * @author 康永胜
 * @date   2017-02-10T10:37:44+0800
 * @param  {String}                 confFile [配置文件名称]
 * @return {Object}                          [配置文件内容]
 */
function _getConfContent(confFile){
  var confFile = path.join(process.cwd(), confFile || 'fdp-config.js');

  if(!fs.existsSync(confFile)){
    confFile = path.join(process.cwd(), 'fdp-conf.js');
  }

  oConf = require(confFile);

  return oConf;
}

var oConf = null;
var ifExcluded;
var path = require('path');
/**
 * 发布过程中的 __getConf() 与 __prependContextPath() 方法
 * @author 康永胜
 * @date   2017-01-12T17:14:31+0800
 * @param  {[type]}                 content [description]
 * @param  {[type]}                 file    [description]
 * @param  {[type]}                 opt     [description]
 * @return {[type]}                         [description]
 */
module.exports = function(content, file, opt){
  if (!oConf) {
    try{
      oConf = require(path.join(process.cwd(), opt['confFile'] || 'fdp-conf.js'));
    }catch(e){
      throw 'fis3-parser-get-conf|当前目录中没有配置文件。';
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
    return content;
  }else{
    return content;
  }
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

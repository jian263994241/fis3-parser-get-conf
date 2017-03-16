'use strict';
const rewire = require('rewire');
const should = require('should');
var index;

describe('index.js测试', function(){

  it('加载模块', function(){
    should.doesNotThrow(function(){
      index = rewire('../index.js');
    });
  });

  describe('导出方法测试', function(){
    var content;
    var file;
    var opts;

    beforeEach(function (){
      content = '<p></p>';
      file = {isHtmlLike: true};
      opts = {confFile: './package.json'};
    });

    it('未指定配置文件', function(){
      opts = {};
      should.throws(function(){
        index(content, file, opts).should.equal(content);
      });
    });

    it('不获取任何属性', function(){
      index(content, file, opts).should.equal(content);
    });

    it('获取作者姓名属性', function(){
      opts['contextPath'] = '/app'
      content = '<p class="__getConf(author.name)" data-target="__context(/test)"></p>';
      index(content, file, opts).should.equal('<p class="康永胜" data-target="/app/test"></p>');
      delete opts['contextPath'];
    });

    it('css类型文件', function(){
      content = '.__getConf(name){z-index: 100;}';
      file = {isCssLike: true};
      index(content, file, opts).should.equal('.fis3-parser-get-conf{z-index: 100;}');
    });

    it('js类型文件', function(){
      content = '__getConf("name");__context("/app");__context(/app);__context()';
      file = {isJsLike: true};
      index(content, file, opts).should.equal('"fis3-parser-get-conf";"/app";\'/app\';\'\'');
    });

    it('非js html css类型的文件', function(){
      content = '<p class="__getConf(author.name)"></p>';
      file = {};
      index(content, file, opts).should.equal(content);
    });

    it('获取不允许获取的配置', function(){
      content = '<p class="__getConf(main)"></p>';
      opts.ifExcluded = function(propsStr){
        return 'main' === propsStr;
      };
      index.__set__('oConf', null);
      index(content, file, opts).should.equal('<p class=""></p>');
    });
  });


  describe('私有方法测试', function(){
    describe('_ifExcluded', function(){
      var _ifExcluded;
      before(function(){
        _ifExcluded = index.__get__('_ifExcluded');
      });
      it('普通调用应当返回false', function(){
        _ifExcluded('dsdfsf').should.equal(false);
      });
    });

    describe('_getPropertyTool', function(){
      var _getPropertyTool;
      before(function(){
        _getPropertyTool = index.__get__('_getPropertyTool');
      });
      it('不传入参数，返回空', function(){
        _getPropertyTool().should.equal('');
      });

      it('查找不存在的属性', function(){
        should.equal(_getPropertyTool('name.version'), undefined);
      });
    });
  });

});
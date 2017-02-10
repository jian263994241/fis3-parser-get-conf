# fis3-parser-get-conf

该模块用于在fis3发布项目时为前端js、html以及css代码提供获取服务器端配置信息的能力。

## 使用方法

### 安装模块
    npm install -g fis3-parser-get-conf

### 使用基础功能
    fis.match('*', function(){
      parser: fis.plugin('get-conf')
    });

### 配置项
    fis.match('*', {
      parser: fis.plugin('get-conf', {
        confFile: "./conf.json", 
        ifExcluded: function(propStr){
          return propStr in {'redis.pass': 1};
        }
      })
    });

+ `confFile` : 服务器端配置文件的路径(相对于当前工作目录)。如果该参数未配置, 则优先使用 **./fdp-config.js** 文件, 如果 **./fdp-config.js** 文件不存在, 则使用  **./fdp-conf.js** 文件。`__getConf` 方法获取的正是该文件中的属性。
+ `ifExcluded`: 是否排除某些属性的判别方法，每次 `__getConf` 方法被调用之前 `ifExcluded` 方法都会被调用，用以判断是否忽略该属性。该方法接受到的参数为 `__getConf` 的参数，如果该方法返回 `true`，则忽略该属性， `__getConf` 方法将得到一个空字符串的返回值。该方法主要用于防止敏感信息泄露。

### 在js文件中获取配属性
    var url = __getConf('fdp-sso-client.fdp-sso-server-uri');

### 在html文件中获取配属性
    <a href="__getConf(fdp-sso-client.fdp-sso-server-uri)"></a>

### 关于__getConf方法的参数
`__getConf` 方法的参数如果是用 `.` 分割，则表示是递归获取对象属性。如 `__getConf(fdp-sso-client.fdp-sso-server-uri)` 表示获取配置文件中 `fdp-sso-client` 对象的 `fdp-sso-server-uri` 属性值。

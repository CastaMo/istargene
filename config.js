/**
 * 项目配置文件
 */

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,

    host: "localhost",

    // mongodb配置(后续可能用到)
    db: "mongodb://127.0.0.1/istargene",
    
    // 端口号
    port: 8000,
}

if ( config.debug )
    config.db = 'mongodb://127.0.0.1/istargene';

module.exports = config;
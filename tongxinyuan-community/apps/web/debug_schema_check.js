
const pb = require('pocketbase')
const fs = require('fs')

// 模拟 Migration 环境太复杂，直接用 API 查询 Schema 更快
// 或者直接查看 sqlite? 
// 还是写一个 node 脚本调用 pb 库？不需要，前端有 debug_fetch.js 可以改一下。

//创建一个简单的 JS 脚本通过 API 获取 Schema
// 因为直接读 DB 文件不方便。
async function checkSchema() {
    try {
        const fetch = (await import('node-fetch')).default;
        // 需要管理员权限才能看完整 Schema 吗？
        // 尝试公开 API
        const resp = await fetch('http://127.0.0.1:8090/api/collections/beneficiary_documents', {
            method: 'GET'
        });
        const data = await resp.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

checkSchema();

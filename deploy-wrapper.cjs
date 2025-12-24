/**
 * deploy-wrapper.cjs - 杭州云合智联专用版
 * 功能：执行 EdgeOne 增量部署并展示实时状态
 */
const { exec } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.EDGEONE_API_TOKEN;
const PROJECT = process.env.EDGEONE_PROJECT_NAME;

let deployState = {
    status: 'RUNNING',
    logs: [],
    startTime: new Date().toLocaleString('zh-CN')
};

function log(msg) {
    const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
    console.log(entry);
    deployState.logs.push(entry);
}

function startDeployment() {
    if (!TOKEN || !PROJECT) {
        deployState.status = 'FAILED';
        log("错误: 缺少环境变量 EDGEONE_API_TOKEN 或 EDGEONE_PROJECT_NAME");
        return;
    }

    log(`正在同步项目 [${PROJECT}] 至 EdgeOne...`);

    // 增量部署核心命令：去掉 --force 实现差异比对上传
    const cmd = `edgeone pages deploy ./dist -n "${PROJECT}" -t "${TOKEN}"`;

    const process = exec(cmd);

    process.stdout.on('data', (data) => log(data.trim()));
    process.stderr.on('data', (data) => log(`[警告] ${data.trim()}`));

    process.on('close', (code) => {
        if (code === 0) {
            deployState.status = 'SUCCESS';
            log("🎉 增量上传完成！全球边缘节点已同步。");
        } else {
            deployState.status = 'FAILED';
            log(`❌ 上传失败，退出码: ${code}`);
        }
    });
}

// 建立健康检查与监控 Web 服务器
http.createServer((req, res) => {
    if (req.url === '/health') { res.writeHead(200); res.end('OK'); return; }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>云合智联 | 部署中心</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #f1f5f9; padding: 40px; }
                .card { background: #1e293b; padding: 25px; border-radius: 12px; border: 1px solid #334155; max-width: 700px; margin: auto; }
                .status { display: inline-block; padding: 5px 12px; border-radius: 6px; font-weight: bold; margin-bottom: 15px; }
                .RUNNING { background: #1d4ed8; } .SUCCESS { background: #065f46; } .FAILED { background: #991b1b; }
                .log-area { background: #000; color: #4ade80; padding: 15px; border-radius: 6px; font-family: monospace; height: 300px; overflow-y: auto; white-space: pre-wrap; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>${PROJECT} 部署状态</h2>
                <div class="status ${deployState.status}">状态: ${deployState.status}</div>
                <p>开始时间: ${deployState.startTime}</p>
                <div class="log-area">${deployState.logs.join('\n') || '等待日志...'}</div>
                <p style="font-size: 12px; color: #64748b; margin-top: 15px;">Powered by Hangzhou Yunhe Intelligence Technology Co., Ltd.</p>
            </div>
        </body>
        </html>
    `);
}).listen(PORT, () => {
    log(`监控服务已在端口 ${PORT} 启动`);
    startDeployment();
});
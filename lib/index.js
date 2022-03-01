#!/usr/bin/env node
/*
 * @Descripttion: 自定义脚手架
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2021-12-30 11:07:44
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-03-01 22:58:21
 */
const download = require('download')
const { version } = require('../package.json');
const templates = require('./template');
const commander = require('commander');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const fs = require('fs-extra')
const spinner = ora('Loading undead unicorns');

function cmd() {
  // 查看版本
  commander.version(chalk.green(version))

  // 查看模板列表
  commander
    .command('list')
    // 指令 | 描述 | 默认值
    .option('-D', '显示模板详情')
    .description('查看模板列表')
    .action((p) => {
      const keys = Object.keys(p)
      const haveDetails = keys.includes('D')
      for (const key in templates) {
        const t = templates[key]
        if (haveDetails) {
          console.log(`模板名称: ${chalk.green(key)}`);
          console.log(`模板链接: ${t.template}\n`);
        } else {
          console.log(chalk.green(key));
        }
      }
    })

  commander
    .command('create <template> <project-name>')
    .description('创建项目')
    .action((templateName, projectName, cmd) => {
      if (!templates[templateName]) {
        console.log(chalk.red(`${templateName} 模板不存在`));
        return
      }
      downloadTemplate(templateName, projectName)
    })

  // 解析指令
  commander.parse(process.argv)
}

/**
 * 下载模板
 * @param {*} templateName 
 * @param {*} projectName 为 . 的时候就是当前目录
 */
function downloadTemplate(templateName, projectName) {
  spinner.start('创建中...');
  const tempPorjectName = projectName
  const basePath = process.cwd();
  const projectPath = path.join(basePath, projectName === '.' ? '' : projectName);
  projectName = projectName === '.' ? path.basename(basePath) : tempPorjectName;
  const template = templates[templateName];
  download(template.link, projectPath, { extract: true })
    .then(() => {
      // 将文件提取到当前目录
      const dir = fs.readdirSync(projectPath);
      // 模板原始文件夹
      if (dir.length === 1) {
        const originProjectDir = path.join(projectPath, dir[0]);
        fs.copySync(originProjectDir, projectPath);
        fs.removeSync(originProjectDir);
      }
    })
    .then(() => costomize(projectName));
}

// 字符串替换
function costomize(projectName) {
  // const 
  if (projectName === '.') { // 项目名称选用当前文件夹名称
    projectName = path.basename(process.cwd());
  }
  spinner.succeed(chalk.green('创建完成\n'));
  spinner.stop();
}

cmd()
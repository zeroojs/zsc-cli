#!/usr/bin/env node
const ora = require('ora');
const chalk = require('chalk');
const rimraf = require('rimraf');
const program = require('commander');
const templates = require('./template');
const download = require('download-git-repo');
const { version } = require('../package.json');
const path = require('path');
const spinner = ora('Loading undead unicorns');

program.version(chalk.green(version))

// 模板列表
program
  .command('list')
  .description('查看模板列表')
  .action(_ => {
    for (let key in templates) {
      console.log(chalk.yellow(key));
      console.log(chalk.green(templates[key].template) + '\n');
    }
  })

program
  .command('create <template> <project-name>')
  .description('初始化项目')
  // .option('-c, --clone', '使用git 克隆项目')
  .action((template, projectName, cmd) => {
    if (!templates[template]) {
      console.log(chalk.red(`No ${template} template`));
      return
    }
    spinner.start('开始下载...');
    download(`direct:${templates[template].template}`, projectName, { clone: true }, err => {
      if (err) {
        // git 空目录错误忽略
        if ((err + '').indexOf('git checkout') > -1) {
          // process.exit();
        } else {
          spinner.fail(chalk.green('下载失败 \n' + err));
          process.exit();
        }
      }
      // 格式化
      const projectPath = path.join(process.cwd(), projectName)
      const format = templates[template].format
      format(projectPath, projectName)

      // 删除 .git
      rimraf.sync(path.join(projectPath, './.git'));

      spinner.succeed(chalk.green('创建完成\n'));

      // 创建完成 信息提示
      console.log(`cd ${chalk.green(projectName)}\n`);
      console.log('npm install');
      console.log(chalk.grey('or'));
      console.log('yarn\n');
    });
  })

program.parse(process.argv)
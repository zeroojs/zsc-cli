/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2021-06-15 14:00:59
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-01-04 21:47:19
 */
const fs = require('fs');
const path = require('path');

const MATCH_WORD = '<%=projectName%>'

module.exports = {
  'vue': {
    link: 'https://gitlab.com/cli19/vue-template/-/archive/main/vue-template-main.zip',
    template: 'https://gitlab.com/cli19/vue-template.git', // vue@2.6x vue-cli@4.x
    format(projectPath, projectName) {
      const varList = [
        'README.md',
        'package.json',
        'src/views/Home.vue'
      ]

      varList.forEach(item => {
        const filePath = path.join(projectPath, item)
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' })
        fs.writeFileSync(filePath, content.replace(MATCH_WORD, projectName))
      })
    }
  },
  'vue:h5': {
    template: 'https://gitlab.com/cli19/vue-h5-template.git', // vue@2.6x vue-cli@4.x --h5
    format(projectPath, projectName) {
      let package = fs.readFileSync(path.join(projectPath, './package.json'), 'utf-8')
      package = JSON.parse(package)
      package.name = projectName
      fs.writeFileSync(path.join(projectPath, './package.json'), JSON.stringify(package, null, 2), { encoding: 'utf-8' })
    }
  },
  'vue:setup': {
    template: 'https://gitlab.com/cli19/vue-h5-template.git', // vue 3
    format(projectPath, projectName) {}
  },
  'vue:composition': {
    template: 'https://gitlab.com/cli19/vue-h5-template.git', // @vue/componsition-api
    format(projectPath, projectName) {}
  }
}
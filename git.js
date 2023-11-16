const chalk = require('chalk')
const axios = require('axios')
const spawn = require('cross-spawn')
const SocksProxyAgent = require('socks-proxy-agent')
const httpsAgent = new SocksProxyAgent('socks5://127.0.0.1:1086')

const gitToken = Buffer.from('meiway1024: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', 'utf-8').toString('base64')
const baseUrl = 'https://api.github.com'
const defaultHeaders = {
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  Authorization: `Basic ${gitToken}`
}

const githubRequest = (path = '', data = {}, method = 'GET', headers = defaultHeaders) => {
  return axios({
    method,
    url: baseUrl + path,
    headers,
    data,
    httpsAgent
  })
}

class Git {
  static async init(dir, projectName, description) {
    if (!description) description = 'egg后端项目'
    await Git.initializeLocalDir(dir)
    let remoteRepoItem = await Git.createGitRepo(projectName, description)
    await Git.initLocal(dir, projectName, remoteRepoItem.svn_url)
    await Git.updateRepoTheme(projectName)
  }
  static async initLocal(outDir, projectName, remoteRepo) {
    try {
      Git.commitDir(outDir, projectName)
      Git.addRemoteRepo(outDir, remoteRepo)
      Git.pushBranchMasterToRemoteRepo(outDir)
      Git.addBranchTest(outDir)
      Git.pushBranchTestToRemoteRepo(outDir)
      // Git.addBranchGray(outDir);
      // Git.pushBranchGrayToRemoteRepo(outDir);
    } catch (e) {
      console.error(chalk.cyan('git init failed'))
      console.log(e)
      throw e
    }
  }

  static async createGitRepo(projectName, description) {
    console.log(chalk.cyan('Creating github repo...'))

    try {
      let res = await githubRequest(
        '/orgs/meiway/repos',
        {
          name: projectName, //项目名称
          description, //项目描述
          private: true
        },
        'POST'
      )
      return res.data
    } catch (error) {
      console.log(error)
      throw new Error('创建GitHub项目失败,请检查是否是重名项目')
    }
  }

  static async updateRepoTheme(repo) {
    const putHeader = Object.assign(defaultHeaders, {
      Accept: 'application/vnd.github.mercy-preview+json'
    })
    return githubRequest(
      `/repos/meiway/${repo}/topics`,
      {
        names: ['custom-backend']
      },
      'PUT',
      putHeader
    )
  }

  static initializeLocalDir(outDir) {
    console.log(chalk.cyan('Initializeing empty Git repository...'))
    spawn.sync('git', ['init'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Initialized empty Git repository success!!!'))
  }

  static commitDir(outDir, projectName) {
    console.log(chalk.cyan('Commiting repo...'))
    spawn.sync('git', ['add', '.'], {
      stdio: 'ignore',
      cwd: outDir
    })
    spawn.sync('git', ['commit', '-m', `"init ${projectName}"`], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Commit repo success!!!'))
  }

  static addRemoteRepo(outDir, remoteRepo) {
    console.log(chalk.cyan('Adding remote repo...'))
    spawn.sync('git', ['remote', 'add', 'origin', remoteRepo], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Added remote repo success!!!'))
    console.log()
  }

  static pushBranchMasterToRemoteRepo(outDir) {
    console.log(chalk.cyan('Pushing master to remote...'))
    spawn.sync('git', ['push', '-u', 'origin', 'master'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Pushed master to remote success!!!'))
    console.log()
  }

  static async pushBranchTestToRemoteRepo(outDir) {
    console.log(chalk.cyan('Pushing test to remote...'))
    spawn.sync('git', ['push', 'origin', 'test:test'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Pushed test to remote success!!!'))
    console.log()
  }

  static addBranchTest(outDir) {
    console.log(chalk.cyan('Adding branch test...'))
    spawn.sync('git', ['branch', 'test'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Added branch test success!!!'))
    console.log()
  }

  static pushBranchGrayToRemoteRepo(outDir) {
    console.log(chalk.cyan('Pushing gray to remote...'))
    spawn.sync('git', ['push', 'origin', 'gray:gray'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Pushed gray to remote success!!!'))
    console.log()
  }

  static addBranchGray(outDir) {
    console.log(chalk.cyan('Adding branch gray...'))
    spawn.sync('git', ['branch', 'gray'], {
      stdio: 'ignore',
      cwd: outDir
    })
    console.log(chalk.cyan('Added branch gray success!!!'))
    console.log()
  }
}

module.exports = Git

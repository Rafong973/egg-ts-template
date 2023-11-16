const spawn = require("cross-spawn");
const ora = require("ora");
const logUpdate = require("log-update");
const spinner = ora();
const Git = require("./git");

let args = process.argv.slice(2);
let projectName = args[0];

const installPackage = (dir) => {
  return new Promise((resolve, reject) => {
    spinner.start(`Installing packages with npm`);
    const sp = spawn("npm", ["install"], {
      stdio: [0, "pipe", "pipe"],
      cwd: dir,
      env: Object.assign(
        {
          FORCE_COLOR: true,
          npm_config_color: "always",
          npm_config_progress: true,
        },
        process.env
      ),
    });

    let stdoutLogs = "";
    let stderrLogs = "";

    sp.stdout &&
      sp.stdout.setEncoding("utf8").on("data", (data) => {
        stdoutLogs += data;
        spinner.stop();
        logUpdate(stdoutLogs);
        spinner.start();
      });

    sp.stderr &&
      sp.stderr.setEncoding("utf8").on("data", (data) => {
        stderrLogs += data;
        spinner.stop();
        logUpdate.clear();
        logUpdate.stderr(stderrLogs);
        logUpdate(stdoutLogs);
        spinner.start();
      });
    sp.on("close", (code) => {
      spinner.stop();
      // Clear output when succeeded
      if (code === 0) {
        logUpdate.clear();
        logUpdate.stderr.clear();
      }
      resolve({
        code,
        pm: "npm",
      });
    });
  });
};

module.exports = {
  templateData() {
    return {
      projectName,
    };
  },
  prompts: [
    {
      name: "database",
      message: "数据库名称",
      default: "egg_test",
    },
    {
      name: "description",
      message: "Github项目描述",
      default: projectName,
    },
    {
      name: "author",
      type: "string",
      message: "作者",
      default: "{gitUser.name}",
      store: true,
    },
    {
      name: "isUploadToGithub",
      message: "是否上传到Github",
      choices: ["yes", "no"],
      type: "list",
      default: "yes",
    },
  ],
  actions() {
    if (!process.argv.slice(2)[0]) {
      console.log(
        this.chalk.red("请执行正确的命令，如:npm run cli project_xxx")
      );
      process.exit(1);
    }

    const actions = [
      {
        type: "add",
        files: `**`,
        templateDir: `template`,
      },
      {
        type: "move",
        patterns: {
          gitignore: ".gitignore",
          "app/model/temp": `/app/model/${this.answers.database.replace(
            /(_|-)([a-zA-Z])/g,
            (match) => {
              return `${match.toUpperCase()}`.replace(
                /(_|-)/g,
                ""
              );
            }
          )}`,
        },
      },
    ];

    return actions;
  },
  async completed() {
    let dir = this.outDir;
    if (this.answers.isUploadToGithub == "yes") {
      await Git.init(dir, projectName, this.answers.description);
    }
    await installPackage(dir);

    const cd = () => {
      console.log(`\t${this.chalk.cyan("cd")} ${dir}`);
    };

    console.log();
    console.log(this.chalk.bold(`  To get started:\n`));
    cd();
    console.log(`\tnpm run dev\n`);
    console.log(this.chalk.bold(`  To run for production:\n`));
    cd();
    console.log(`\tnpm run start`);
    console.log();
  },
};

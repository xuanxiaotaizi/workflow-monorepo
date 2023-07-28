/*
 * @Author: wanggang(wanggang220713@credithc.com)
 * @Date: 2023-07-20 11:45:55
 * @LastEditors: wanggang
 * @LastEditTime: 2023-07-26 18:22:41
 * @Description:
 */
import fs from "fs";
import path from "path";
import rootCheck from "root-check";
import figlet from "figlet";
import semver from "semver";
import dotenv from "dotenv";
import userHome from "user-home";
import minimist from "minimist";
import colors from "colors/safe";
import { NODE_VERSION, DEFAULT_HOME, NPM_NAME } from "./const";
import { log, npm } from "@workflow/utils";
import Commander from "./command";

export default class Workflow {
  public args?: minimist.ParsedArgs;
  public config?: object;
  public logger?: any;
  public pkg?: any;
  constructor() {
    this.init();
  }

  async init() {
    this.logger = log;
    this.pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    this.args = minimist(process.argv.slice(2), {
      alias: {
        h: "help",
        v: "version",
      },
    });

    this.logger.debug("输入参数", this.args);

    //this.checkPkgVersion();
    // this.checkNodeVersion();
    // this.checkIsRoot();
    // this.checkUserHome();
    // this.checkArgs(this.args);
    // this.checkEnv();

    //await this.checkGlobalUpdate();

    const commander = new Commander(this.pkg)
    commander.register()
  }

  /**
   * @Description: 检查版本号
   * @return {*}
   * @author: wanggang(wanggang220713@credithc.com)
   */
  checkPkgVersion() {
    this.printBanner();
  }

  /**
   * @Description: 检查Node版本号
   * @return {*}
   * @author: wanggang(wanggang220713@credithc.com)
   */
  checkNodeVersion() {
    if (!semver.gte(process.version, NODE_VERSION)) {
      throw new Error(
        `当前Node版本为 ${process.version} 您需要安装 v${NODE_VERSION}以上的版本！`
      );
    }
  }

  /**
   * @Description: 检查用户主目录
   * @return {*}
   * @author: wanggang(wanggang220713@credithc.com)
   */
  checkUserHome() {
    if (!userHome || !fs.existsSync(userHome)) {
      throw new Error("当前登录用户主目录不存在！");
    }
  }


  /**
   * @Description: 检验参数
   * @param {*} args
   * @return {*}
   * @author: wanggang(wanggang220713@credithc.com)
   */
  checkArgs(args: minimist.ParsedArgs) {
    if (args.debug) {
      this.logger.level='debug';
    } else {
      this.logger.level='info';
    }
  }

  /**
   * @Description: 检查用户是否为root账户并降级
   * @return {*}
   * @author: wanggang(wanggang220713@credithc.com)
   */
  checkIsRoot() {
    rootCheck();
  }

  checkEnv() {
    dotenv.config({
      path: path.resolve(userHome, ".env"),
    });
    this.config = this.createCliConfig(); // 准备基础配置
    this.logger.debug("环境变量", this.config);
  }

  async checkGlobalUpdate() {
    const currentVersion = this.pkg.version;
    const lastVersion = await npm.getNpmLatestSemverVersion(
      NPM_NAME,
      currentVersion
    );
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
      this.logger.warn(
        colors.yellow(
          `请手动更新 ${NPM_NAME}，当前版本：${this.pkg.version}，最新版本：${lastVersion} 更新命令： npm install -g ${NPM_NAME}`
        )
      );
    }
  }

  createCliConfig() {
    const worfConfig = {
      home: userHome,
    };
    if (process.env.CLI_HOME) {
      worfConfig["workflowHome"] = path.join(userHome, process.env.CLI_HOME);
    } else {
      worfConfig["workflowHome"] = path.join(userHome, DEFAULT_HOME);
    }
    return worfConfig;
  }
  
  objectKeys(obj:any){
    const keys =  []
    for(let i in obj){
      keys.push(i)
    }

    return keys
  }

  printBanner() {
    figlet.text(
      "workflow",
      {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default",
      },
      (err, data) => {
        if (err) {
          this.logger.error(err);
          process.exit(2);
        }
        const keys = this.objectKeys(this.args)
        if (keys.length === 1) {
          this.logger.notice(`\n${data}`);
          this.logger.notice(
            `Workflow，current version: v${this.pkg.version}, homepage: https://github.com/xuanxiaotaizi/workflow-monorepo/tree/main/packages/core#readme`
          );
          this.logger.notice("Aims to improve front end workflow.");
          this.logger.notice("Run worf --help to see usage.");
        }
      }
    );
  }
}

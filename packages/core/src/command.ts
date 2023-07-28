/*
 * @Author: wanggang(wanggang220713@credithc.com)
 * @Date: 2023-07-25 15:21:39
 * @LastEditors: wanggang
 * @LastEditTime: 2023-07-27 08:59:16
 * @Description: 
 */
import yargs from 'yargs';
export default class Commander{
  // private pkg?:any
  // private args?:any
  constructor(pkg:any){
    // this.pkg = pkg
    // this.args = args
  }
  register(){
    const cli = yargs()
    yargs.command("add", "Add a new note")
    .command("list", "List all notes")
    .help().argv;

  //  console.log(args)

  }
}
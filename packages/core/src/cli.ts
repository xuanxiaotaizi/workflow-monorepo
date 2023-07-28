/*
 * @Author: wanggang(wanggang220713@credithc.com)
 * @Date: 2023-07-25 14:44:20
 * @LastEditors: wanggang
 * @LastEditTime: 2023-07-26 15:34:27
 * @Description:
 */
import importLocal from "import-local";
import { log } from "@workflow/utils";
import Workflow from "./index";

export default function entry() {
  if (importLocal(__filename)) {
    log.info("cli", "正在使用本地版本");
  } else {
    new Workflow();
  }
}

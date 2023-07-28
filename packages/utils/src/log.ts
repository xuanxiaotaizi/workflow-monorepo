/*
 * @Author: wanggang(wanggang220713@credithc.com)
 * @Date: 2023-07-20 18:16:54
 * @LastEditors: wanggang
 * @LastEditTime: 2023-07-26 15:17:17
 * @Description: 
 */
import npmlog from 'npmlog'

npmlog.heading = 'workflow' // 自定义头部
npmlog.addLevel('success', 2000, { fg: 'green', bold: true }) 
npmlog.addLevel('debug', 1000, { fg: 'cyan', bold: true },'debug') 

export default npmlog


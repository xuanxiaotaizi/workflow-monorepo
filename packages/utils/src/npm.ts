/*
 * @Author: wanggang(wanggang220713@credithc.com)
 * @Date: 2023-07-24 11:43:42
 * @LastEditors: wanggang
 * @LastEditTime: 2023-07-25 14:40:56
 * @Description: 
 */
import axios from "axios";
import semver from "semver";

// 获取 registry 信息
export function getNpmRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' :
    'https://registry.npm.taobao.org';
}

// 从 registry 获取 npm 的信息
export function getNpmInfo(npm:string, registry?:string) {
  const register = registry || getNpmRegistry();
  const url = `${register}/${npm}`
  return axios.get(url).then(function(response) {
    try {
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error
    }
  });
}

// 获取某个 npm 的最新版本号
export function getLatestVersion(npm:string, registry:string) {
  return getNpmInfo(npm, registry).then(function (data) {
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      console.error('没有 latest 版本号', data);
      throw new Error('Error: 没有 latest 版本号')
    }
    const latestVersion = data['dist-tags'].latest;
    return latestVersion;
  });
}

// 获取某个 npm 的所有版本号
export function getVersions(npm:string, registry?:string) {
  return getNpmInfo(npm, registry).then(function (body) {
    const versions = Object.keys(body.versions);
    return versions;
  });
}

// 根据指定 version 获取符合 semver 规范的最新版本号
export function getLatestSemverVersion(baseVersion:string, versions:any) {
  versions = versions
    .filter(function (version:string) { return semver.satisfies(version, "^" + baseVersion); })
    .sort(function (a:string, b:string) {
      return semver.gt(b, a);
    });
  return versions[0];
}

// 根据指定 version 和包名获取符合 semver 规范的最新版本号
export function getNpmLatestSemverVersion(npm:string, baseVersion:string, registry?:string) {
  return getVersions(npm, registry).then(function (versions) {
    return getLatestSemverVersion(baseVersion, versions);
  });
}

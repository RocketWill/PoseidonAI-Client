/*
 * @Author: Will Cheng chengyong@pku.edu.cn
 * @Date: 2024-07-24 16:52:06
 * @LastEditors: Will Cheng chengyong@pku.edu.cn
 * @LastEditTime: 2024-07-30 21:00:55
 * @FilePath: /PoseidonAI-Client/src/utils/token.ts
 * @Description:
 *
 * Copyright (c) 2024 by chengyong@pku.edu.cn, All Rights Reserved.
 */
export default {
  get() {
    return window.sessionStorage.getItem('TOKEN');
  },
  save(token: string) {
    window.sessionStorage.setItem('TOKEN', token);
  },
};

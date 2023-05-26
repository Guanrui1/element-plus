import { withInstall } from '@element-plus/utils' // 引入 withInstall （组件条件 install 属性用，使用时直接 使用 use 即可安装组件
import Dialog from './src/dialog.vue' // 引入 Dialog 组件

export const ElDialog = withInstall(Dialog) // Dialog 组件添加 install 属性，并重命名为 ElDialog
export default ElDialog // 导出 ElDialog 组件

export * from './src/use-dialog' // 导出 use-dialog属性?
export * from './src/dialog' // 导出 dialog.ts 内容?
export * from './src/constants' // 导出 constants?

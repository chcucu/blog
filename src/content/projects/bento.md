---
title: 'Bento'
description: '面向 Paper / Spigot / Folia 的 YAML 菜单框架，把 GUI 逻辑从代码里抽出来。'
year: 2026
role: '作者'
stack: ['Java', 'Paper API', 'YAML', 'Folia']
status: '持续维护'
repo: 'https://github.com/chcucu/BentoMenu'
demo: 'https://modrinth.com/project/AQ3n1LCg'
order: 2
---

## 背景

服务器里的菜单会越来越多：主菜单、商店、传送、活动、管理面板。如果每个菜单都写一遍 inventory 逻辑，改一次文案就要重新编译、重新发版。

Bento 想解决的就是这件事：用 YAML 描述菜单，把布局、图标、点击动作从 Java 代码里拆出来。

## 做法

- 一个 YAML 文件描述整个菜单：行数、槽位、物品、模型数据、点击动作；
- 支持 Paper、Spigot、Folia，兼容 1.18 到 26.x；
- 提供可运行的示例 addon，MIT 协议；
- 菜单渲染与点击处理尽量不产生整包刷新，减少无意义的物品更新。

## 性能

在 4 核 / 8 GB 的测试机上，用 200 个 mineflayer bot 做的保守测试：

- 200 名玩家同时打开菜单：TPS 稳定在 20.00；
- 30 秒内 2,225 次随机点击：TPS 19.25–20.00；
- 平均点击处理 0.061 ms，平均渲染 4.00 ms；
- 5,632 次渲染产生 38,680 次物品更新，没有整包刷新。

## 已知限制

混合端（Mohist、Arclight）只做尽力兼容；Folia 的区域调度在混合端可能表现不同；26.3 目前只验证到启动与插件启用。资源包需要服主自行分发，插件只提供模型数据。

## 链接

- 源码：https://github.com/chcucu/BentoMenu
- 下载：https://modrinth.com/project/AQ3n1LCg

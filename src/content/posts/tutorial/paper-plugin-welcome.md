---
title: '写一个 Paper 欢迎插件：从事件监听到配置热重载'
description: '用一个不到 200 行的插件，把「玩家进服时发送欢迎消息」这件小事做完整：事件、配置、颜色、重载与构建。'
date: 2026-08-26
lang: zh
category: tutorial
tags: ['Minecraft', '插件', 'Java']
coverWord: '插件'
---

「玩家进服时发一条欢迎消息」是很多人写的第一个 Bukkit/Paper 插件。它足够小，可以一次讲清楚；也足够完整，能覆盖插件开发里最常用的几个环节。

这篇教程用 Paper API 写一个可配置、可重载的欢迎插件。

## 项目结构

```text
PaperWelcome/
├── build.gradle.kts
└── src/main/
    ├── java/dev/example/welcome/
    │   ├── WelcomePlugin.java
    │   └── WelcomeListener.java
    └── resources/
        ├── plugin.yml
        └── config.yml
```

## plugin.yml

```yaml
name: PaperWelcome
version: 1.0.0
main: dev.example.welcome.WelcomePlugin
api-version: '1.21'
commands:
  welcome:
    description: 重新加载欢迎配置
    usage: /welcome reload
    permission: paperwelcome.reload
permissions:
  paperwelcome.reload:
    default: op
```

`api-version` 要和服务器的主版本对应。写错通常不会立刻报错，但会在启动日志里留下警告。

## 主类与配置

```java
package dev.example.welcome;

import org.bukkit.plugin.java.JavaPlugin;

public final class WelcomePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        saveDefaultConfig();
        getServer().getPluginManager().registerEvents(
            new WelcomeListener(this), this
        );
        getLogger().info("PaperWelcome enabled.");
    }

    public void reload() {
        reloadConfig();
        getLogger().info("Welcome config reloaded.");
    }
}
```

`saveDefaultConfig()` 会在第一次启动时把 jar 里的 `config.yml` 复制到插件数据目录；之后服务器管理员修改的是数据目录里的版本，而不是 jar 里的版本。

## 监听玩家进服

```java
package dev.example.welcome;

import net.kyori.adventure.text.minimessage.MiniMessage;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public final class WelcomeListener implements Listener {

    private final WelcomePlugin plugin;
    private final MiniMessage mini = MiniMessage.miniMessage();

    public WelcomeListener(WelcomePlugin plugin) {
        this.plugin = plugin;
    }

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        String template = plugin.getConfig().getString(
            "message",
            "<green>欢迎回来，<player>！</green>"
        );

        String message = template.replace(
            "<player>", event.getPlayer().getName()
        );

        event.getPlayer().sendMessage(mini.deserialize(message));
    }
}
```

这里用 Adventure 的 MiniMessage，而不是老式的 `§` 颜色代码。它支持可读的标签，也能安全地处理玩家名，不会因为名字里带特殊字符而破坏格式。

## config.yml

```yaml
# 支持 MiniMessage 颜色标签
message: "<green>欢迎回来，<player>！</green> <gray>输入 /help 查看指令。</gray>"
```

## 重载命令

```java
@Override
public boolean onCommand(
    CommandSender sender,
    Command command,
    String label,
    String[] args
) {
    if (args.length == 1 && args[0].equalsIgnoreCase("reload")) {
        reload();
        sender.sendMessage("欢迎配置已重新加载。");
        return true;
    }

    sender.sendMessage("用法：/welcome reload");
    return true;
}
```

重载时只重新读取配置，不重新注册监听器。这样可以避免同一次进服事件被触发两次。

## 构建

```kotlin
plugins {
    java
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(21))
}

repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.21.4-R0.1-SNAPSHOT")
}
```

执行 `./gradlew build`，把 `build/libs/PaperWelcome-1.0.0.jar` 放进服务器的 `plugins` 目录，重启即可。

## 可以继续做的事

这个插件只有两个类，但已经具备了继续扩展的基础：

- 把欢迎消息拆成首次进服和回访两套；
- 支持从配置文件里读取多条随机消息；
- 在玩家第一次进服时发放一个新手礼包；
- 把进服记录写入数据库，做简单的在线统计。

下一步通常不是加更多功能，而是想清楚：这条消息到底想解决什么问题。如果只是「让服务器看起来热闹」，那它很快就会变成一条被所有人忽略的刷屏信息。

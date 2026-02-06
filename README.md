# 运行文档

本项目基于 [**React Native**](https://reactnative.dev)，使用 [`@react-native-community/cli`](https://github.com/react-native-community/cli) 创建。

## 开始之前

> **注意**：请先完成 [环境搭建](https://reactnative.dev/docs/set-up-your-environment) 再进行以下步骤。

---

## 第一步：安装依赖

在项目根目录执行：

```sh
pnpm install
```

---

## 第二步：安装 iOS Pods

进入 **ios** 目录并安装 CocoaPods 依赖：

```sh
cd ios
bundle exec pod install
cd ..
```

首次使用 CocoaPods 时如未安装 bundler，可先执行 `bundle install`。  
每次更新原生依赖后，需重新执行上述 `pod install`。

更多说明见 [CocoaPods 入门](https://guides.cocoapods.org/using/getting-started.html)。

---

## 第三步：构建并运行（仅 iOS）

1. **启动 Metro**（在项目根目录）：

```sh
pnpm start
```

2. **新开一个终端**，在项目根目录运行 iOS 应用：

```sh
pnpm run ios
```

若环境正确，应用会在 iOS 模拟器或已连接的真机上启动。  
也可在 **Xcode** 中打开 `ios/doctor.xcworkspace` 进行构建和运行。

---

## 修改应用与重载

用编辑器修改 `App.tsx` 等文件，保存后应用会通过 [Fast Refresh](https://reactnative.dev/docs/fast-refresh) 自动更新。

需要**完全重新加载**时，在 iOS 模拟器中按 <kbd>R</kbd>。

---

## 常见问题

若上述步骤无法正常运行，可参考官方 [故障排除](https://reactnative.dev/docs/troubleshooting)。

---

## 延伸阅读

- [React Native 官网](https://reactnative.dev)
- [环境搭建](https://reactnative.dev/docs/environment-setup)
- [入门教程](https://reactnative.dev/docs/getting-started)
- [官方博客](https://reactnative.dev/blog)
- [GitHub 仓库](https://github.com/facebook/react-native)
# doctor

## Getting Started

This project is built with [**React Native**](https://reactnative.dev) and bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

---

## Before You Begin

> **Note:** Make sure you have completed the [Environment Setup](https://reactnative.dev/docs/set-up-your-environment) before following the steps below.

---

## Step 1: Install Dependencies

Run the following command in the project root directory:

```sh
pnpm install
```

---

## Step 2: Install iOS Pods

Navigate to the **ios** directory and install CocoaPods dependencies:

```sh
cd ios
bundle exec pod install
cd ..
```

If you are using CocoaPods for the first time and do not have Bundler installed, run:

```sh
bundle install
```

Whenever native dependencies are updated, you should run `pod install` again.

For more information, see the [CocoaPods Getting Started Guide](https://guides.cocoapods.org/using/getting-started.html).

---

## Step 3: Build and Run (iOS Only)

### 1. Start Metro

In the project root directory:

```sh
pnpm start
```

### 2. Run the iOS App

Open a **new terminal window**, then run:

```sh
pnpm run ios
```

If your environment is configured correctly, the app will launch on the iOS simulator or a connected device.

You can also open `ios/doctor.xcworkspace` in **Xcode** to build and run the project.

---

## Editing the App & Reloading

Edit files such as `App.tsx` using your preferred editor.
After saving, the app will automatically update using [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

To perform a **full reload**, press **R** in the iOS simulator.

---

## Troubleshooting

If you encounter issues during setup or running the app, refer to the official [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting).

---

## Learn More

* [React Native Official Website](https://reactnative.dev)
* [Environment Setup Guide](https://reactnative.dev/docs/environment-setup)
* [Getting Started Guide](https://reactnative.dev/docs/getting-started)
* [React Native Blog](https://reactnative.dev/blog)
* [React Native GitHub Repository](https://github.com/facebook/react-native)


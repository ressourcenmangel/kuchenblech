# Kuchenblech

> Enhanced theme for [Fractal](https://fractal.build/), a tool to help you build & document web component libraries

## 🚧 Requirements

* [node.js](https://nodejs.org/) v7.x.x
* [yarn](https://yarnpkg.com/) v0.24.0 or newer for dependency management
* IDE or editor with [EditorConfig](http://editorconfig.org/) enabled

## 🚦 Getting started

- Watch for changes: In the project root run `npm run webpack:watch`
- Start Fractal: Enter desired project folder (i.e. `/tests/simple`) and run `yarn fractal start` this should open the local URL in your browser.

## Kuchenblech deployment

A big part of this setup is about how we work with the *Kuchenblech* theme. Its open-source repository is maintained by our [ressourcenmangel organization on GitHub](https://github.com/ressourcenmangel).

You can use the *Kesselblech* theme in the *Kuchenblech* boilerplate with the related [npm package](https://www.npmjs.com/package/@rsm/kuchenblech). If you want to contribute and use the new version in this repository, you have to commit your changes to the GitHub repository and publish it with a new version tag on [**npm**](https://www.npmjs.com).

1. Commit your changes with a [proper commit message](#commits) to the [GitHub repository](https://github.com/ressourcenmangel/kuchenblech)
2. Create a version commit:
    * Add your changes to the [changelog](#changelog)
    * Update the version number in `package.json` and the changelog.
    * Commit message: "🔖 Version X.X.X"
3. Add a tag with version to this commit ("X.X.X")
4. Push to master branch (make sure to push all tags!)
5. Publish on **npm**
    * Run `npm login` and fill in your login data from your **npm** account (make sure you have the rights to publish in the *@rsm* namespace)
    * Run `npm publish`

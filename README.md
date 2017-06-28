# pandora-bot-line

A simple LINE Messenger bot made with NodeJS

## Getting Started

### Install

Install LINE official sdk for nodeJS using [npm](https://www.npmjs.com/):

``` bash
$ npm install express
$ npm install @line/bot-sdk
```

### Documentation

See LINE official sdk [documentation](https://line.github.io/line-bot-sdk-nodejs/).

## How To Use

Make the .env according to .env.example

* fill channel access token and channel secret according to line developer page
* choose command symbol. only message starts with command symbol that will be processed

Register every command at command folder.

The filename should be based on the command that will be registered, without command symbol.
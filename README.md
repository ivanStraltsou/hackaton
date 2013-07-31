hackaton
========

This story is about http://img0.liveinternet.ru/images/attach/c/5//3970/3970473_sprite198.swf

Installation
-
*required:*
  1. node v0.10.0+
  2. npm
  3. Google Chrome(stable in > v28)

run following commands in your command prompt or terminal:
  > npm install
  > node app

Application will be started on port 3001, you should see the following message in your terminal:\n
  > Express server listening on port 3001

After that test application will be available on http://localhost:3001

You are done.

Info
---
- Main file for animation logic is ./public/javascripts/animation-provider.js *(pay it maximum attention, others are just wiring all together)*
- Bower components are already downloaded and stored in repo. No additional steps are required to configure it.
- Application consists of two routes, which are wired with angularjs.
- SVG implementation is a bit raw and has sufficient perfomance issues with parts number > 10(small code duplication :( )
- Shark example should consist from min 15 parts (if you want to see the beautiful one)


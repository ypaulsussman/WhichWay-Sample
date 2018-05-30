# WhichWay Sample Code

This repo contains samples of my contributions to WhichWay, a mobile-first, decoupled React and Ruby on Rails application aiming to provide intuitive career guidance to potential postsecondary students. (_For more information on the process and strategy underlying this app, please see_ [the lead designer's product overview.](http://www.t-winters.com/#/whichway-mvp/))

While WhichWay's development was put on indefinite hiatus with the discontinuation of ECMC's Innovation Lab, [ECMC Group](https://www.ecmc.org/about-us/index.html) has (*very*) generously allowed several of the team to publicly display some samples of their work from the project. A personal thanks to that institution: this was wholly unexpected, and very much appreciated.

For my duties on the front-end team, I... 
* built various components (_e.g._ `Hex.js` _and_ `SkillProfilerPage.js`); 
* styled them in SCSS (_e.g._ `Hex.scss` _and_ `SkillProfilerPage.scss`); 
* connected several of them to the app's Redux store (_e.g._`SkillProfilerAction.js`_, not present, _and_ `SkillProfilerReducer.js`);
* enabled asynchronous behavior via the redux-saga middleware (_e.g._`SkillProfilerApi.js`); and
* hit 95+% test coverage (_measured via Istanbul_) via Jest and Enzyme (_e.g._`SkillProfilerPage.test.js`).

These files combined with several dozen other components to form the working WhichWay MVP. You can view a walkthrough screencast of the complete app's functionality [in this video.](https://www.dropbox.com/s/3iyambkt3tbt42r/WhichWay_Walkthrough.mp4?dl=0)

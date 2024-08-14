# Illusion Engine

POC for a VN engine in the browser or as a install stack to run locally.

## Requirements

| Thing | Version | Reasoning |
| ----------- | ----------- | ----------- | 
| Node | 22.1.X + | Build / Compilation |
| Yarn | 4.3.X +  | Build / Compilation |
| Browser (Chrome) | 126.0.X.Y +  | Runtime |
| Browser (Firefox) | 128.0 +  | Runtime |


## Getting Started

* Ensure you have the Requirements installed
* Open your comandLine of choise to the root directory
* For first time runs, run the following combination command `yarn install && yarn boot`
* For any consecutive runs just `yarn boot` will suffices
* once completed you should see a message indicating how to access the running dev-server


![Done](./documentation/boot.png)

`yarn boot`, runs the following chain:
> yarn install
> yarn test
> yarn dev

# Features

Comprehensive list of expected features and their completion is available under `Features.md`

# Example Sources Used

All media is owned by their respective sources and has no relation to Illusion Engine and are for demo purposes only.

Example BG:  

- source: moewalls.com
- reference: `assets/bg-audio.mp4`

Example Chars:  

- source: Typemoon Wiki
- reference: `/char/Aoko.png`

Example BGM: 


| Reference | source | Arist | Title |
| ----------- | ----------- | ----------- | ----------- | 
| `/audio/bgm/bgm.m4a` | https://www.youtube.com/watch?v=foRefp4MlOI | Arika | 「blan_」|
| `/audio/bgm/bgm-story.m4a` | Depths of Elusive Realms BGM from Wuthering Waves | TBD | TBD |


Example SFX and Voice snippets: random audio bites from youtube:

| Reference | Description |
| ----------- | ----------- |
| `/audio/sfx/ah.wav` | GawGura - A |
| `/audio/sfx/ayaya.wav` | ayaya snippet from anime Kiniro Mosaic |
| `/audio/voice/yo-da-yo.wav` | voice snippet from v-tuber Nakiri Ayame |

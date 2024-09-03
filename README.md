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

Comprehensive list of expected features and their completion is available under `./Features.md` or bellow at [an exert](#features-exert)


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


# Features Exert

## Core Features

| Feature | Status | Description |
| ----------- | ----------- | ----------- | 
| Responsive | ![Done](./documentation/done.svg) | Game should obviously be playable at various permutations of the 16:9 ratio |
| Splash Screens | ![Done](./documentation/done.svg) | Unskippable screens that usually have the developer or warnings (i.e: epelipsy warnings) |
| Main Menu | ![Done](./documentation/done.svg) | A Clean main menue automatically displayed post splash screens |
| Game Engine - Core | ![Done](./documentation/done.svg) | Ability read and structure chapter / scene / transition data, as well as reactivly change child layers depending on what changed between previous transition and current transition. |
| Layer: 0 Backdrop | ![Done](./documentation/done.svg) | Ability to display and transition to / from, static images to videos. Should always be 100% of game-space |
| Layer: 1 Effects | ![Done](./documentation/done.svg) | Ability to display static and dynamic effects, (i.e: screen edge pulsing red indicating low-life, etc.) |
| Layer: 2 Characters | ![Partial](./documentation/partial.svg) | Ability to display static and dynamic characters at designated safe-locations |
| Layer: 3 UI | ![Done](./documentation/done.svg) | The text display / icons and capture of interactions for progression |
| Layer: 4 Choices | ![Done](./documentation/done.svg) | Ability to select a branching choice from 2 or more options. |
| Layer: 5 TopLayer | ![Done](./documentation/done.svg) | The menu flyout and Modal handle for Saving / Loading |
| Game Engine - Display | ![Done](./documentation/done.svg) | Ability display multiple layering of content (0 lowest, 999 heighest). 0: Background (video or static image). 1: Effects, 2: Characters, 3 UI overlay, 4: User Choices, 5: Active Menu AND/OR Modals |
| New Game | ![Done](./documentation/done.svg) | Ability to start a new game with no state attached. |
| Options - Core | ![Done](./documentation/done.svg) | All VN games have options relating to text display speed and auto wait timings, as well as custom volume sliders for each channel (BGM vs sfx etc). |
| Audio Chanels | ![Done](./documentation/done.svg) | All games should have the feature / ability to play multiple different tracks over the top of each other, e.g: play a voice line while the BGM is still playing. |
| Custom Pointers | ![Done](./documentation/done.svg) | Most if not all games have custom cursor pointers and effects. |
| Manual Progression | ![Done](./documentation/done.svg) | progression of the scene / chapter (if scene is over), when users interact with the game. |
| Skip Scene | ![Partial](./documentation/partial.svg) | Skip function should take the user to the next breakpoint, either the next branching choice or the end of the current scene / chapter (not fully sure if we should use chapter of scene here) |
| Auto Progression | ![Done](./documentation/done.svg) | When toggled, should automatically progress to the next transition once the defined `delay` has been eclipsed. If the current line is voiced the completion of the voiced line should be what triggers the delay counter otherwise this should be triggerd by completion of the text reveal |
| Save | ![Done](./documentation/done.svg) | Ability to save and store these staves between gaming sessions. |
| Load | ![Incomplete](./documentation/incomplete.svg) | Ability to load a previous save. |
| Exit | ![Done](./documentation/done.svg) | Should be able to fully close the game from the main menu. *Can't actualy self-close your own tab* |
| Hisory | ![Done](./documentation/done.svg) | Should be to view the history of lines played to the user and replay any voiced lines if they have been stored. |
| View Backdrop | ![Done](./documentation/done.svg) | Should be to view the Backdrop, free of any effects and/or overlays. |


## Extra Features

| Feature | Status | Description |
| ----------- | ----------- | ----------- | 
| Continue | ![Partial](./documentation/partial.svg) | Ability to continue from the exact place the user ended their last session. |
| Skip Scene Context Explainer | ![Partial](./documentation/partial.svg) | When a user opts to skip a scene / transition, they should be prompted with a small explainer detailing the scene they are skipping |
| Options - extra | ![Incomplete](./documentation/incomplete.svg) | All games should have other options for how visual texts are displayed |
| History | ![Incomplete](./documentation/incomplete.svg) | History should clear, or indicate that it is now fragmented, on skip. |
| Layer_3 - Characters | ![Incomplete](./documentation/incomplete.svg) | Ability for characters to be slightly animated while / when they start a line when a change of speaker occurs. |
| Layer_4 - Choices | ![Partial](./documentation/partial.svg) | Ability to select a branching choice from 1 or more options, and allow for options to be hidden / disabled due to missing previous interactions |

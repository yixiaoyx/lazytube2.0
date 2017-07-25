# Lazytube 2.0
Made by Sijian Deng, Sijia Chen, Yi Xiao and David Zhou during Facebook Hackathon 2017

Lazytube is a handy tool that intends to pause and resume video/music playbackfor you when you leave or return to your computer. It uses OpenCV for face recognition and works best with a front camera.

Version 2.0 is a Chrome extension specifically intended for Youtube playback. It uses Chrome Native Messaging API to let the Python script in Version 1.0 and the Chrome extension talk to each other.

**System prerequisite:** 
- OpenCV2;
- Currently compatible with OS X and Linux;

**Usage:**
- Run `host/install_host.sh` in Terminal;
- Load everything in `chrome_ext` into Chrome as an unpacked extension;
- Wait a few seconds for the camera to start; if nothing happens, hit `Reload`;

**New feature:**
- If you manually pauses the video, it stays paused, i.e. your leaving and returning to seat will not toggle the video on;
- Try laughing wholeheartedly towards the camera ... It knows whether you are truly happy or not :)


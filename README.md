# Android Split-Flap Display

A high-fidelity Android application simulating a mechanical split-flap display. It features realistic 3D animations, sequential character cycling, and polyphonic "clack" sounds.

![Splitflap Display, courtesy of https://www.youtube.com/@dave.madison](./splitflapdisplay.jpg)
Splitflap Display, courtesy of https://www.youtube.com/@dave.madison

## Features
- **Realistic Animation**: HTML/CSS 3D transforms wrapped in a high-performance native WebView.
- **Authentic Logic**: Flaps rotate sequentially through the alphabet to reach the target letter.
- **Sound**: Polyphonic audio engine plays a sharp "clack" for every individual flap movement.
- **Data**: Uses a filtered Scrabble dictionary (6-8 letter words).

## Project Structure
- `app/src/main/assets/`: Contains the core logic (HTML, CSS, JS) and sound files.
- `app/src/main/java/`: Native Android WebView implementation.

## Build Instructions

### Prerequisites
- JDK 17 or higher.
- Android SDK.

### Setup
1. **Configure SDK Location**:
   Create a file named `local.properties` in the root directory and add the path to your Android SDK:
   ```properties
   sdk.dir=/Users/YOUR_USER/Library/Android/sdk
   ```
   *(Note: Adjust the path if your SDK is located elsewhere)*

2. **Verify Configuration**:
   Ensure `gradle.properties` contains:
   ```properties
   android.useAndroidX=true
   ```

### Building the APK
Open a terminal in the project root and run:

```bash
./gradlew assembleDebug
```

The APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

### Installing
1. Transfer the APK to your Android device.
2. Install it (allow installation from unknown sources).
3. Tap the screen once to ensure audio permissions are active.

## Assets
- The internal word list is pre-generated in `app/src/main/assets/words.js`.
- Replace `app/src/main/assets/clack.mp3` with your own sound file if desired.
# splitflap-display-android

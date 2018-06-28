# telepresence-dashboard
Dashboard for MoMo robot
This repository contains an UI for controlling MyRobotLab InMoov service via a local web server.

InMoov is an open sourced robot design by Gael Langevin. MyRobotLab is an Open Source Java Framework for
Robotics and Creative Machine Control.

# Requirements and Setup


This UI requires Node.js and Express to run the server and web client. To install Node.js go here: https://nodejs.org/en/download/

Then install Express from the command line with the following command:

$	npm install express

Copy the whole repository locally and open two command lines: one for the server and one for the socket.

The socket has to be started first, locate the socket file in the socket directory and start the .py program. The socket should start running after which it is possible to start the server itself by locating another command line to directory with server.js file and inputting "npm start".

# How to Use

## localhost:3000

After successfully starting the server and the socket, open "localhost:3000" on the web browser. A site with two text bars, a drop-down menu and 9 buttons should open.

By clicking the buttons the server sends gesture codes to the socket.

The upper, slim text bar is used to send desirable speech text straight to MyRobotLab and the lower one can be used to send custom code to perform different gestures, for example.

The drop-down menu can be used to access different scenarios, meaning gesture codes that have been divided into different themes.

## localhost:3000/vision

The UI allows for the user to inspect the space around the robot via a webcam that has been plugged into the robot. Currently, the following functionalities have been implemented and are ready to use: head movement of the robot, receiving audio feedback, streaming live speech from the user to the participants (raw, unchanged voice) and using Google Cloud's Speech API to send a voice message via MyRobotLab. In the next section, instructions for all these functionalities will be given.

### Head Movement

The head of the robot can be moved by directly clicking on the screen. As of now, the coordinates are not absolute and there are so-called "buffer-zones" where the robot does not necessarily turn its head on a horizontal axis as much as was required. In such a case, the user should make a wider movement to produce horizontal feedback. By clicking the buttons in the upper-right corner, the robot does not move its head, rather, it only performs the functionalities embedded to the control buttons. The webcamera also gives the controller audio feed from the space the robot is in, allowing for smoother communication between the user and the participants.

### Streaming Live Speech

It is possible to send live audio stream from the user to the participants. The audio feedback will not go through MyRobotLab but rather, is sent straight from the microphone of the operating computer to a speaker that has been installed to the robot. The audio stream can be started by clicking the "Stream" button that is located in the upper-right corner of the screen. This will initiate the live audio stream functionality enabling the user to directly communicate with the participants. The volume of the stream can be controlled by using the volume bar that has been inserted above the "Stream" button. It should be noted that too high volumes will produce noise, disrupting the stream. The stream can be stopped by clicking the "Stream" button for a 2nd time.

### Communication via MyRobotLab (Communication through the robot)

Communication can also be done by having the user speak, and convert that speech to text, which will then be sent to MyRobotLab and turned into the robot's own speech. The service uses Google Cloud's Speech API, for which the user needs local credentials and access rights to the project. Quickstart for installing Google Cloud SDK can be found here: https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries. Also, installing gcloud becomes necessary in order to use the API, instructions: https://cloud.google.com/sdk/docs/.

Having setup all the necessary installations the Speech API can be used to convert speech to text by holding down the "Space" button when wanting to convert a message. Note: the message can be atmost one minute long, after which the service will not be able to convert the message. The message will be sent to the API when "Space" is released. A latency of a few seconds can be expected for the speech to be converted to text, depending on the Wifi-signal. The language settings for the Speech API can be changed under "routes" directory from the voice.js file's "languageCode" variable.

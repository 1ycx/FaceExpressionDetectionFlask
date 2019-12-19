# Expression Detection Using Flask

## Project Plan

- [x] Find a proper Face Expression detection model.
- [x] Take live video from webcam with OpenCV.
- [x] Use OpenCV haarcascades for face detection.
- [x] Use ML model to predict expression.
- [x] Integrate the model with the program.
- [x] Build flask prototype.
- [x] Make sure the flask app is running properly locally.
- [x] Write client side javascript to take frames from the video to send to the server for detection.
- [x] Handle the server response and draw on canvas proper bounding boxes.
- [ ] Deploy the flask app online for initial testing.
- [ ] Find & Integrate Text Mood Detection model.
- [ ] Design a Good looking UI.
- [ ] Maybe write some testcases ? IDK.

## Setup

* Clone the git repo.
* Unzip the file.
* Navigate inside and open a CMD/Powershell Terminal.
* Create a virtual env using 
    * Windows: `python -m venv myvirtualenv`
    * Linux: `python3 -m venv myvirtualenv`
* Activate virtual environment
    * Windows: 
        * Powershell - `myvirtualenv\Scripts\activate.ps1`
        * CMD - `myvirtualenv\Scripts\activate.bat`
    * Linux: `source myvirtualenv/bin/activate`
* Install required packages
    * Windows: `pip install -r requirements.txt`
    * Linux: `pip3 install -r requirements.txt`
* Make sure to have latest Chrome/Firefox Installed.
* To run, 
    * Windows: `python server.py`
    * Linux: `python3 server.py`

## Issues
Any problems ? Feel free to open up a new issue.

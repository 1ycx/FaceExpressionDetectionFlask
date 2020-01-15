#!/usr/bin/env python
import cv2
import json
import numpy as np
import classifier

from flask import Flask, render_template,  request
from keras.models import model_from_json

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Load Haarcascade File
face_detector = cv2.CascadeClassifier("ml_folder/haarcascade_frontalface_default.xml")

# Load the Model and Weights
model = model_from_json(open("ml_folder/facial_expression_model_structure.json", "r").read())
model.load_weights('ml_folder/facial_expression_model_weights.h5')
model._make_predict_function()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/uploade', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        # f.save("somefile.jpeg")
        # f = request.files['file']

        f = request.files['file'].read()
        npimg = np.fromstring(f, np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
        face_properties = classifier.classify(img, face_detector, model)

        return json.dumps(face_properties)


if __name__ == '__main__':

    # Run the flask app
    app.run()
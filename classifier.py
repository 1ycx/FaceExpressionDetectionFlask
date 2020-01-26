
from keras.preprocessing import image as im

import cv2
import json
import numpy as np

def classify(frame, face_detector, model):

    # Emotions
    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    gray = frame

    # Detect faces
    detected_faces = face_detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=10, minSize=(5, 5), flags=cv2.CASCADE_SCALE_IMAGE)

    # Face properties
    face_prop = []

    # Faces are detected more than 0 i.e not 0
    if len(detected_faces) > 0:
        # x,y = x,y coordinates
        # w,h = width, height
        for (x, y, w, h) in detected_faces:
            frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            img = cv2.rectangle(gray, (x, y), (x + w, y + h), (255, 0, 0), 2)

            adjust_img = img[y:y+h, x:x+w]  # Crop img to the face
            adjust_img = cv2.resize(adjust_img, (48, 48))  # Resize img to fit the ML model

            img_tensor = im.img_to_array(adjust_img)
            img_tensor = np.expand_dims(img_tensor, axis=0)

            img_tensor /= 255  # pixels are in scale of [0, 255]. normalize all pixels in scale of [0, 1]

            predictions = model.predict(img_tensor)  # store probabilities of 2 facial expressions
            label = emotions[np.argmax(predictions)]  # Get label with most probability

            confidence = np.max(predictions)  # Get the confidence of that label

            confidence *= 100 # Multiple probability by 100

            detect = dict()
            detect['label'] = label
            detect['score'] = str(confidence).split(".")[0]
            detect['x'] = str(x)
            detect['y'] = str(y)
            detect['width'] = str(w)
            detect['height'] = str(h)

            face_prop.append(detect)
            print(face_prop)
            
            cv2.putText(frame, label + " : " + str(confidence), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
    cv2.imwrite("somefile.jpeg", frame)

    # output_json = json.dumps([face.__dict__ for face in face_prop])
    return face_prop


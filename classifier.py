from keras.models import model_from_json
from keras.preprocessing import image as im

import cv2
import numpy as np

def classify(frame, face_detector, model):

    # Emotions
    emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convert img to GrayScale

    # Detect faces
    detected_faces = face_detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=10, minSize=(5, 5), flags=cv2.CASCADE_SCALE_IMAGE)

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

            cv2.putText(frame, label + " : " + str(confidence), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    
    return frame


def main():
    cap = cv2.VideoCapture(0)

    # Load Haarcascade File
    face_detector = cv2.CascadeClassifier("haarcascades/haarcascade_frontalface_default.xml")

    # Load the Model and Weights
    model = model_from_json(open("ml_folder/facial_expression_model_structure.json", "r").read())
    model.load_weights('ml_folder/facial_expression_model_weights.h5')

    while(True):
        # Capture frame-by-frame
        ret, frame = cap.read()

        op_frame = classify(frame, face_detector, model)

        # Display the resulting frame
        cv2.imshow('frame', op_frame)
        # yield op_frame

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

main()
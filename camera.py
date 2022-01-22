import cv2
import classifier
from keras.models import model_from_json

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        self.model = model_from_json(open("ml_folder/facial_expression_model_structure.json", "r").read())
        self.model.load_weights('ml_folder/facial_expression_model_weights.h5')
    
    def __del__(self):
        self.video.release()
    
    def get_frame(self):
        success, frame = self.video.read()
        
        if success:
            frame = classifier.classify(frame, self.face_detector, self.model)
            _, jpeg = cv2.imencode('.jpg', frame)
            return jpeg.tobytes()
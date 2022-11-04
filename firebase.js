const firebaseConfig = {
    apiKey: "AIzaSyB_B5o2D0lm8GFAvcLQPi0DGfDIUf8mBpU",
    authDomain: "todo-app-fdc5a.firebaseapp.com",
    projectId: "todo-app-fdc5a",
    storageBucket: "todo-app-fdc5a.appspot.com",
    messagingSenderId: "533898034314",
    appId: "1:533898034314:web:6aeee581315d96c8a58173",
    measurementId: "G-MLD1LDFFJX"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var db = firebase.firestore(); 
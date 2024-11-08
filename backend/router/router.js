const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ctrl')
const multer  = require('multer');
const StudentModel = require('../models/student');


// add use
router.post('/createstudent', ctrl.adduser);
//login user
router.post('/loginuser', ctrl.loginuser)
// Present and Absent
router.post('/Status', ctrl.Status);
// leave
router.post('/Leave', ctrl.Leave);
// table 
router.post('/table',ctrl.table);
router.get('/User',ctrl.User);
router.post('/check',ctrl.check);




// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads'); // Ensure this directory exists
  },
  filename: async function (req, file, cb) {
      try {
          // Get student ID from request body
          const studentId = req.body.id;
          const student = await StudentModel.findOne({ id: studentId });

          // Check if the student exists
          if (!student) {
              return cb(new Error('Student not found')); // Handle case where student is not found
          }

          // Generate a unique filename based on student ID
          const uniqueName = `${student.id}.png`;
          cb(null, uniqueName); // Save the file as <student_id>.png

          // Push the new image filename to the student's images array
          
          student.img = uniqueName; // Replace the old image with the new one
          await student.save();  // Save the updated student document
          console.log(student);
          
      } catch (error) {
          cb(error); // Pass any errors to the callback
      }
  }
});

// Configure multer with storage settings
const upload = multer({ storage: storage });

router.post('/profile', upload.single('image'), async (req, res) => {
  try {
      console.log('*********** Image Uploaded ***********');
      const student = await StudentModel.findOne({ id: req.body.id });

      // Check if the student exists
      const path = req.file ? req.file.filename : null;
      if (path && student ) {
          res.send({ message: 'Image uploaded successfully', path: `/uploads/${path}`,data:student });
      } else {
          res.status(400).send({ error: 'Image upload failed' });
      }
  } catch (error) {
      console.error('Error during image upload:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});


module.exports = router


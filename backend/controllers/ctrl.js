const StudentModel = require('../models/student');
const Counter = require('../models/counter'); // Import the Counter model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let obj = {};



///add user
obj.adduser = async (req, res) => {
    console.log('************ User Add ***************');
    let { body } = req;

    if (body && body.name && body.email && body.password) {
        console.log('if condition true');

        try {
            // Generate a hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.password, salt);

            // Retrieve and increment the counter
            const counter = await Counter.findOneAndUpdate(
                { name: 'userId' },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );

            // Create a new user with a unique id
            let newUser = new StudentModel({
                id: counter.count, // Use the incremented count as the unique id
                name: body.name,
                email: body.email,
                password: hashedPassword,
                img: ' ',
                status: [],
                Application:[],
                date: [ ] // Ensure this matches the schema definition
            });

            // Generate a JWT token
            const token = jwt.sign({ email: body.email }, 'shhhhh');

            // Save the user to the database
            let create = await newUser.save();
            if (create) {
                
                res.send({
                    message: 'User created successfully',
                    data: create,
                    'token': token,
                });
            } else {
                res.status(500).send('An error occurred, please try again');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating user',
                error: error.message
            });
        }
    } else {
        console.log('Incomplete request body');
        res.status(400).send('Incomplete request body');
    }
};




//login use
obj.loginuser = async (req, res)=> {
    const { email, password } = req.body;
    if (email && password) {
        
    try {
        // res.send(`${email} and ${password}`)
        // Find user by email
        const checkuser = await StudentModel.findOne({ email });
        if (!checkuser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, checkuser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

    //    Generate a JWT token
       const token = jwt.sign({ email:email }, 'shhhhh');
       res.cookie('token', token); // Set cookie before sending response
        // Send response with token and user info
        res.status(200).json({
            token: token,
            data :checkuser,
            role: 'User',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }else{
        res.send('Please Enter correct body',req.body)
    }
};

// upload image
obj.upload = async(req, res)=>{

}

// Present  this api present and absent
obj.Status = async (req, res) => {
    const { body } = req;

    // Ensure both `id` and `status` are present in the request body
    if (body.id && body.status) {
        try {
            // Find the student by ID
            const student = await StudentModel.findOne({ id: body.id });

            if (student) {
                // Push the status "Present" to the `status` array
                // let number = parseInt(body.id); 
                student.status.push(body.status);
                student.date.push(new Date());

                // Save changes to the database
                await student.save();

                // Send a success response
                res.status(200).send({
                    message:'Student Updata data',
                    data :student,
                    date : student.date,
                });
            } else {
                res.status(404).send('Student not found');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).send('An error occurred while updating data');
        }
    } else {
        // Bad request response if `id` or `status` is missing
        res.status(400).send('Please send correct body');
    }
};

// this api handle leave
obj.Leave = async (req, res) => {
    const { body } = req;

    // Ensure `id`, `status`, and `application` are present in the request body
    if (body.id && body.status && body.application) {
        try {
            // Find the student by ID
            const student = await StudentModel.findOne({ id: body.id });

            if (student) {
                // Push the new status, application, and date
                student.status.push(body.status);
                student.Application.push(body.application);  // Ensure spelling is consistent with the schema
                student.date.push(new Date());

                // Save changes to the database
                await student.save();

                // Send a success response
                res.status(200).send({
                    message: 'Leave API is working',
                    data: student,
                    date : student.date,
                });
            } else {
                res.status(404).send({ error: 'Student not found' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).send({ error: 'An error occurred while updating data' });
        }
    } else {
        // Bad request response if `id`, `status`, or `application` is missing
        res.status(400).send({ error: 'Please send correct body' });
    }
};
obj.table= async (req, res) => {
    const { body } = req;

    // Check if `id` is provided in the request
    if (body.id) {
        try {
            // Fetch the student from the database using the provided ID
            const student = await StudentModel.findOne({ id: body.id });

            if (student) {
                // Format the response data to match frontend requirements
                const rows = student.status.map((status, index) => ({
                    date: student.date[index] ? new Date(student.date[index]).toLocaleDateString() : 'N/A',
                    name: student.name,
                    rollNumber: student.id,
                    status: status,
                    img:student.img
                }));

                // Respond with the formatted data and additional student details
                res.status(200).send({
                    message: 'Student data retrieved successfully',
                    data: rows,
                    detail: {
                        id: student.id,
                        name: student.name,
                        email: student.email,
                        img: student.img,
                    }
                });
            } else {
                res.status(404).send('Student not found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            res.status(500).send('An error occurred while fetching data');
        }
    } else {
        res.status(400).send('Please provide a valid student ID');
    }
};

/// User
obj.User= async (req, res) => {
        try {
            // Fetch the student from the database using the provided ID
            const student = await StudentModel.find();
            if (student) {
                // Respond with the formatted data and additional student details

                const studentData = student.map((student) => ({
                    ...student._doc,  // Spread existing student fields
                    img: student.img ? `http://localhost:3000/uploads/${student.img}` : null,  // Construct image URL
                  }));


                res.status(200).send({
                    message: 'Student data retrieved successfully',
                    data:studentData,
                });
            } else {
                res.status(404).send('Student not found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            res.status(500).send('An error occurred while fetching data');
        }
};

obj.check = async function (req,res) {
    const {token} =req.body;
    jwt.verify(token, 'shhhhh', function(err, decoded) {
       if (err) {
        res.status(400).json({data:'your are worng'})
    }
    else{
        res.status(200).json({message:"your are correct",data:decoded})
    }
      });
}

module.exports = obj;

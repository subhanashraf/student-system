// const Counter = require('../models/Counter');

// const incrementUserCount = async () => {
//     try {
//         const updatedCounter = await Counter.findOneAndUpdate(
//             {},
//             { $inc: { count: 1 } },
//             { new: true, upsert: true } // Create if it doesn't exist
//         );
//         return updatedCounter.count; // Return the updated count
//     } catch (error) {
//         console.error('Error updating user count:', error);
//         throw new Error('Unable to update user count');
//     }
// };

// module.exports = { incrementUserCount };

const db = require('./db');

async function update() {
  try {
    await db.query("UPDATE meal_booking SET Booking_date = CURDATE() WHERE YEAR(Booking_date) = 2023");
    await db.query("UPDATE payment SET Pay_date = CURDATE() WHERE YEAR(Pay_date) = 2023");
    console.log('Successfully updated 2023 dates to the current date!');
  } catch (error) {
    console.error('Error updating dates:', error);
  } finally {
    process.exit(0);
  }
}

update();

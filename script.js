// Initialize habit list from local storage if available
let habits = JSON.parse(localStorage.getItem('habits')) || [];

document.getElementById('addHabitBtn').addEventListener('click', addHabit);

document.addEventListener('DOMContentLoaded', displayHabits);

// Add a new habit
function addHabit() {
    let habitName = prompt('Enter the name of your new habit:');
    let reminderTime = prompt('Enter the reminder time (24-hour format, e.g., 14:30 for 2:30 PM):');
    
    if (habitName) {
        // Validate the reminder time format (HH:MM)
        if (reminderTime && !/^\d{2}:\d{2}$/.test(reminderTime)) {
            alert('Invalid time format. Please enter time in HH:MM format.');
            return; // Exit if time format is invalid
        }

        let newHabit = {
            name: habitName,
            completedDates: [],
            reminderTime: reminderTime || null
        };

        // Add to habits array and save to local storage
        habits.push(newHabit);
        localStorage.setItem('habits', JSON.stringify(habits));

        // If reminder time is set, schedule it
        if (newHabit.reminderTime) {
            setReminder(newHabit, habits.length - 1); // Schedule reminder for this habit
        }
        
        displayHabits();
    }
}

// Set reminder for a habit
function setReminder(habit, habitIndex) {
    if (!habit.reminderTime) return; // Avoid errors if no reminder time is set

    let [hours, minutes] = habit.reminderTime.split(':').map(Number);
    let now = new Date();
    let reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // If the reminder time is already past for today, set it for the next day
    if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
    }

    let timeUntilReminder = reminderTime - now;

    // Ensure the reminder works after calculating the time
    setTimeout(() => {
        alert(`Reminder: It's time to do your habit: ${habit.name}`);
        // After showing the reminder, reschedule it for the next day
        setReminder(habit, habitIndex);
    }, timeUntilReminder);
}

// Mark a habit as done for today
function markAsDone(habitIndex) {
    let today = new Date().toLocaleDateString();
    if (!habits[habitIndex].completedDates.includes(today)) {
        habits[habitIndex].completedDates.push(today);
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    displayHabits();
}

// Display all habits
function displayHabits() {
    let habitList = document.querySelector('.habit-list');
    habitList.innerHTML = ''; // Clear existing list

    habits.forEach((habit, index) => {
        let habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        
        let habitText = document.createElement('span');
        habitText.textContent = habit.name;
        
        let markDoneButton = document.createElement('button');
        markDoneButton.textContent = 'Mark as Done';

        // If habit is completed today, disable the button
        let today = new Date().toLocaleDateString();
        if (habit.completedDates.includes(today)) {
            habitItem.style.backgroundColor = '#d4edda'; // Completed color
            markDoneButton.disabled = true;
            markDoneButton.textContent = 'Completed';
        }

        // Display reminder time if set
        if (habit.reminderTime) {
            let reminderText = document.createElement('span');
            reminderText.textContent = `Reminder set for: ${habit.reminderTime}`;
            habitItem.appendChild(reminderText);
        }

        markDoneButton.onclick = () => markAsDone(index);

        habitItem.appendChild(habitText);
        habitItem.appendChild(markDoneButton);
        
        habitList.appendChild(habitItem);
    });
}



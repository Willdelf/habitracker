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
            reminderText.textContent = `Reminder: ${habit.reminderTime}`;
            habitItem.appendChild(reminderText);
        }

        markDoneButton.onclick = () => markAsDone(index);

        habitItem.appendChild(habitText);
        habitItem.appendChild(markDoneButton);
        
        habitList.appendChild(habitItem);
    });
}



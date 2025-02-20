// Initialize habit list from local storage if available
let habits = JSON.parse(localStorage.getItem('habits')) || [];

document.getElementById('addHabitBtn').addEventListener('click', addHabit);

function addHabit() {
    let habitName = prompt('Enter the name of your new habit:');
    if (habitName) {
        let newHabit = {
            name: habitName,
            completedDates: []
        };

        // Add to habits array and save to local storage
        habits.push(newHabit);
        localStorage.setItem('habits', JSON.stringify(habits));
        
        displayHabits();
    }
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

        markDoneButton.onclick = () => markAsDone(index);

        habitItem.appendChild(habitText);
        habitItem.appendChild(markDoneButton);
        
        habitList.appendChild(habitItem);
    });
}

// Load and display habits when the page is ready
displayHabits();


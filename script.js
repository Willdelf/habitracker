const habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentMonth = 0; // Starts from January
const year = 2025;
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

document.addEventListener('DOMContentLoaded', () => {
    displayHabits();
    generateCalendar(currentMonth);

    // Existing event listeners
    document.getElementById('prevMonthBtn').addEventListener('click', showPreviousMonth);
    document.getElementById('nextMonthBtn').addEventListener('click', showNextMonth);
    document.getElementById('addHabitBtn').addEventListener('click', addHabit);
    document.getElementById('habitList').addEventListener('click', handleHabitClick);

    // New toggle event listener on the heading
    document.getElementById('habitListToggle').addEventListener('click', toggleHabitList);
});

function generateCalendar(month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear existing calendar

    const monthName = months[month];
    const monthHeader = document.createElement('div');
    monthHeader.classList.add('month-name');
    monthHeader.textContent = `${monthName} ${year}`;
    calendar.appendChild(monthHeader);

    // Create the days of the week
    daysOfWeek.forEach(day => {
        const dayOfWeek = document.createElement('div');
        dayOfWeek.textContent = day;
        calendar.appendChild(dayOfWeek);
    });

    // Empty space before the first day of the month
    const startDay = firstDayOfMonth.getDay();
    for (let i = 0; i < startDay; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement('button');
        dayButton.textContent = day;

        const dateString = `${month + 1}-${day}-${year}`;
        let habitStatus = 'not-done';

        const selectedHabit = getSelectedHabit();
        if (selectedHabit && selectedHabit.completedDates.includes(dateString)) {
            habitStatus = 'done';
        }

        dayButton.classList.add(habitStatus);
        dayButton.addEventListener('click', () => toggleDayCompletion(day, month, year)); // Attach click event
        calendar.appendChild(dayButton);
    }

    document.getElementById('currentMonthDisplay').textContent = `${monthName} ${year}`;
}

function showPreviousMonth() {
    if (currentMonth > 0) {
        currentMonth--;
    } else {
        currentMonth = 11; // Loop back to December
    }
    generateCalendar(currentMonth);
}

function showNextMonth() {
    if (currentMonth < 11) {
        currentMonth++;
    } else {
        currentMonth = 0; // Loop back to January
    }
    generateCalendar(currentMonth);
}

function addHabit() {
    const habitName = prompt('Enter the name of your new habit:');
    if (habitName) {
        const newHabit = {
            name: habitName,
            completedDates: [] // Empty array for completed dates
        };
        habits.push(newHabit);
        localStorage.setItem('habits', JSON.stringify(habits));
        displayHabits();
    }
}

function displayHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = ''; // Clear existing list

    habits.forEach((habit, index) => {
        const habitItem = document.createElement('li');
        habitItem.textContent = habit.name;
        habitItem.dataset.index = index;
        habitItem.classList.add('habit-item');

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteHabit(index);
        });

        habitItem.addEventListener('click', () => {
            selectHabit(index);
        });

        habitItem.appendChild(deleteBtn);
        habitList.appendChild(habitItem);
    });
}

function deleteHabit(index) {
    habits.splice(index, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    displayHabits();
}

function handleHabitClick(event) {
    const habitIndex = event.target.dataset.index;
    if (habitIndex !== undefined) {
        selectHabit(habitIndex);
    }
}

function selectHabit(index) {
    const selectedHabit = habits[index];
    if (selectedHabit) {
        document.querySelectorAll('#habitList li').forEach(item => item.classList.remove('selected'));
        document.querySelector(`#habitList li[data-index="${index}"]`).classList.add('selected');
        generateCalendar(currentMonth);
    }
}

function getSelectedHabit() {
    const selectedHabitIndex = [...document.querySelectorAll('#habitList li.selected')].map(item => item.dataset.index)[0];
    return selectedHabitIndex !== undefined ? habits[selectedHabitIndex] : null;
}

function toggleDayCompletion(day, month, year) {
    const selectedHabit = getSelectedHabit();
    if (!selectedHabit) {
        alert('Please select a habit first!');
        return;
    }

    const dateString = `${month + 1}-${day}-${year}`;

    if (selectedHabit.completedDates.includes(dateString)) {
        selectedHabit.completedDates = selectedHabit.completedDates.filter(date => date !== dateString);
    } else {
        selectedHabit.completedDates.push(dateString);
    }

    localStorage.setItem('habits', JSON.stringify(habits));
    generateCalendar(currentMonth);
}

function toggleHabitList() {
    const habitList = document.getElementById('habitList');
    const toggleHeading = document.getElementById('habitListToggle');

    if (habitList.style.display === 'none') {
        habitList.style.display = 'block';
        toggleHeading.textContent = 'Your Habits';
    } else {
        habitList.style.display = 'none';
        toggleHeading.textContent = 'Your Habits';
    }
}











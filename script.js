const habits = JSON.parse(localStorage.getItem('habits')) || [];
const goals = JSON.parse(localStorage.getItem('goals')) || [];
const weeklyResults = JSON.parse(localStorage.getItem('weeklyResults')) || [];
const year = 2025;
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let currentMonth = new Date().getMonth(); // Start with the current month

// Modal-related variables
const modal = document.getElementById('inputModal');
const modalInput = document.getElementById('modalInput');
const modalTitle = document.getElementById('modalTitle');
const saveModalBtn = document.getElementById('saveModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

let modalContext = null; // Tracks what the modal is adding (habit or goal)

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    displayHabits();
    displayGoals();
    generateCalendar(currentMonth);
    displayWeeklyIndicators();
    addEventListeners();
    checkAndResetWeeklyGoals();
}

function addEventListeners() {
    document.getElementById('prevMonthBtn').addEventListener('click', showPreviousMonth);
    document.getElementById('nextMonthBtn').addEventListener('click', showNextMonth);
    document.getElementById('addHabitBtn').addEventListener('click', () => openModal('habit'));
    document.getElementById('addGoalBtn').addEventListener('click', () => openModal('goal'));
    document.getElementById('habitList').addEventListener('click', handleHabitClick);
    document.getElementById('goalList').addEventListener('click', handleGoalClick);
    document.getElementById('habitListToggle').addEventListener('click', toggleHabitList);
    document.getElementById('goalListToggle').addEventListener('click', toggleGoalList);
    saveModalBtn.addEventListener('click', saveModal);
    closeModalBtn.addEventListener('click', closeModal);
}

function generateCalendar(month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();

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

        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
            dayButton.classList.add('today'); // Highlight the current day
        }

        dayButton.classList.add(habitStatus);
        dayButton.addEventListener('click', () => toggleDayCompletion(day, month, year)); // Attach click event
        calendar.appendChild(dayButton);
    }

    document.getElementById('currentMonthDisplay').textContent = `${monthName} ${year}`;
}

function showPreviousMonth() {
    currentMonth = (currentMonth > 0) ? currentMonth - 1 : 11; // Loop back to December
    generateCalendar(currentMonth);
    displayWeeklyIndicators();
}

function showNextMonth() {
    currentMonth = (currentMonth < 11) ? currentMonth + 1 : 0; // Loop back to January
    generateCalendar(currentMonth);
    displayWeeklyIndicators();
}

function openModal(context) {
    modalContext = context;
    modalTitle.textContent = context === 'habit' ? 'Add New Habit' : 'Add New Goal';
    modalInput.value = '';
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function saveModal() {
    const inputValue = modalInput.value.trim();
    if (!inputValue) return alert('Please enter a name!');

    if (modalContext === 'habit') {
        habits.push({ name: inputValue, completedDates: [] });
        localStorage.setItem('habits', JSON.stringify(habits));
        displayHabits();
    } else if (modalContext === 'goal') {
        goals.push({ name: inputValue, achieved: false });
        localStorage.setItem('goals', JSON.stringify(goals));
        displayGoals();
    }

    closeModal();
}

function addHabit() {
    openModal('habit');
}

function addGoal() {
    openModal('goal');
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

function displayGoals() {
    const goalList = document.getElementById('goalList');
    goalList.innerHTML = ''; // Clear existing list

    goals.forEach((goal, index) => {
        const goalItem = document.createElement('li');
        goalItem.textContent = goal.name;
        goalItem.dataset.index = index;
        goalItem.classList.add('goal-item');
        if (goal.achieved) {
            goalItem.classList.add('achieved');
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteGoal(index);
        });

        goalItem.appendChild(deleteBtn);
        goalList.appendChild(goalItem);
    });
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

// Remaining functions (e.g., `checkAndResetWeeklyGoals`, `displayWeeklyIndicators`) remain unchanged.















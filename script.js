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
    document.getElementById('addHabitBtn').addEventListener('click', addHabit);
    document.getElementById('habitList').addEventListener('click', handleHabitClick);
    document.getElementById('addGoalBtn').addEventListener('click', addGoal);
    document.getElementById('goalList').addEventListener('click', handleGoalClick);
    document.getElementById('habitListToggle').addEventListener('click', toggleHabitList);
    document.getElementById('goalListToggle').addEventListener('click', toggleGoalList);
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

function addGoal() {
    const goalName = prompt('Enter the name of your new goal:');
    if (goalName) {
        const newGoal = {
            name: goalName,
            achieved: false, // Initially not achieved
            date: new Date().toISOString() // Set the current date
        };
        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));
        displayGoals();
        displayWeeklyIndicators();
    }
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

        // Toggle achieved status
        const toggleAchievedBtn = document.createElement('button');
        toggleAchievedBtn.textContent = goal.achieved ? 'Mark as Not Achieved' : 'Mark as Achieved';
        toggleAchievedBtn.classList.add('toggle-achieved-btn');
        toggleAchievedBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleGoalAchieved(index);
        });

        goalItem.appendChild(deleteBtn);
        goalItem.appendChild(toggleAchievedBtn);
        goalList.appendChild(goalItem);
    });
}

function deleteGoal(index) {
    goals.splice(index, 1);
    localStorage.setItem('goals', JSON.stringify(goals));
    displayGoals();
    displayWeeklyIndicators();
}

function handleGoalClick(event) {
    const goalIndex = event.target.dataset.index;
    if (goalIndex !== undefined) {
        selectGoal(goalIndex);
    }
}

function selectGoal(index) {
    const selectedGoal = goals[index];
    if (selectedGoal) {
        document.querySelectorAll('#goalList li').forEach(item => item.classList.remove('selected'));
        document.querySelector(`#goalList li[data-index="${index}"]`).classList.add('selected');
    }
}

function toggleGoalAchieved(index) {
    goals[index].achieved = !goals[index].achieved;
    localStorage.setItem('goals', JSON.stringify(goals));
    displayGoals();
    displayWeeklyIndicators();
}

function toggleGoalList() {
    const goalList = document.getElementById('goalList');
    const toggleHeading = document.getElementById('goalListToggle');

    if (goalList.style.display === 'none') {
        goalList.style.display = 'block';
        toggleHeading.textContent = 'Your Goals';
    } else {
        goalList.style.display = 'none';
        toggleHeading.textContent = 'Your Goals';
    }
}

function displayWeeklyIndicators() {
    const weeklyIndicatorsTable = document.getElementById('weeklyIndicators');
    const weeks = getThreeWeeks();
    const goalsAchievedPerWeek = calculateGoalsAchievedPerWeek(weeks);

    weeklyIndicatorsTable.innerHTML = `
        <thead>
            <tr>
                <th>Week</th>
                <th>Goals Achieved / Total Goals</th>
            </tr>
        </thead>
        <tbody>
            ${goalsAchievedPerWeek.map((weekData, index) => `
                <tr>
                    <td>${weekData.label}</td>
                    <td>${weekData.achieved} / ${weekData.total}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function getThreeWeeks() {
    const currentDate = new Date();
    const currentWeek = getWeekDates(currentDate);
    const pastWeek = getWeekDates(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    const nextWeek = getWeekDates(new Date(currentDate.setDate(currentDate.getDate() + 14)));

    return [
        { label: 'Past Week', dates: pastWeek },
        { label: 'Current Week', dates: currentWeek },
        { label: 'Next Week', dates: nextWeek }
    ];
}

function getWeekDates(date) {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        weekDates.push(new Date(startOfWeek));
        startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
    return weekDates;
}

function calculateGoalsAchievedPerWeek(weeks) {
    return weeks.map(week => {
        const weekGoals = goals.filter(goal => {
            const goalDate = new Date(goal.date);
            return week.dates.some(date => date.toDateString() === goalDate.toDateString());
        });
        const achievedGoals = weekGoals.filter(goal => goal.achieved).length;
        return {
            label: week.label,
            achieved: achievedGoals,
            total: weekGoals.length
        };
    });
}

function checkAndResetWeeklyGoals() {
    const lastResetDate = new Date(localStorage.getItem('lastResetDate'));
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    // If today is Sunday and the last reset was not today, reset the weekly goals
    if (dayOfWeek === 0 && lastResetDate.toDateString() !== currentDate.toDateString()) {
        // Record the results of the past week
        const pastWeekResults = calculateGoalsAchievedPerWeek([{ label: 'Past Week', dates: getWeekDates(new Date(currentDate.setDate(currentDate.getDate() - 7))) }])[0];
        weeklyResults.push(pastWeekResults);
        localStorage.setItem('weeklyResults', JSON.stringify(weeklyResults));

        // Reset the goals
        goals.forEach(goal => {
            goal.achieved = false;
        });
        localStorage.setItem('goals', JSON.stringify(goals));
        localStorage.setItem('lastResetDate', currentDate.toISOString());
        displayGoals();
        displayWeeklyIndicators();
    }
}




















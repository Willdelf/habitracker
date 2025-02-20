document.addEventListener("DOMContentLoaded", function () {
    const habitList = document.getElementById("habitList");
    const calendarContainer = document.querySelector(".calendar-container");
    const calendar = document.getElementById("calendar");
    const addHabitBtn = document.getElementById("addHabitBtn");
    const monthDisplay = document.getElementById("currentMonthDisplay");
    let habits = [];
    let activeHabit = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function renderCalendar() {
        calendar.innerHTML = "";
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");
            dayElement.textContent = day;
            
            if (activeHabit && activeHabit.trackedDays.includes(day)) {
                dayElement.classList.add("tracked");
            }

            dayElement.addEventListener("click", function () {
                if (!activeHabit) return;
                
                if (activeHabit.trackedDays.includes(day)) {
                    activeHabit.trackedDays = activeHabit.trackedDays.filter(d => d !== day);
                } else {
                    activeHabit.trackedDays.push(day);
                }

                renderCalendar();
            });

            calendar.appendChild(dayElement);
        }
    }

    function updateMonthDisplay() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    document.getElementById("prevMonthBtn").addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateMonthDisplay();
        renderCalendar();
    });

    document.getElementById("nextMonthBtn").addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateMonthDisplay();
        renderCalendar();
    });

    addHabitBtn.addEventListener("click", function () {
        let habitName = prompt("Enter habit name:");
        if (!habitName) return;

        let newHabit = {
            name: habitName,
            trackedDays: []
        };
        habits.push(newHabit);
        renderHabits();
    });

    function renderHabits() {
        habitList.innerHTML = "";

        habits.forEach((habit, index) => {
            let habitElement = document.createElement("li");
            habitElement.classList.add("habit-item");
            habitElement.textContent = habit.name;
            
            if (habit === activeHabit) {
                habitElement.classList.add("active");
            }

            habitElement.addEventListener("click", function () {
                if (activeHabit === habit) {
                    activeHabit = null;
                    calendarContainer.style.display = "none";
                } else {
                    activeHabit = habit;
                    calendarContainer.style.display = "block";
                }
                renderHabits();
                renderCalendar();
            });

            habitList.appendChild(habitElement);
        });
    }

    updateMonthDisplay();
    renderHabits();
});






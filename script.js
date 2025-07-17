// Global Variables
let waterConsumed = 0;
let totalCalories = 0;
let workoutExercises = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setupNavigation();
    setupModals();
    setupFormHandlers();
    loadLocalStorageData();
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scroll Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Setup Modals
function setupModals() {
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// Form Handlers Setup
function setupFormHandlers() {
    // BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', handleBMICalculation);
    }

    // Workout Tracker
    const workoutForm = document.getElementById('workout-form');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleWorkoutEntry);
    }

    // Calorie Counter
    const calorieForm = document.getElementById('calorie-form');
    if (calorieForm) {
        calorieForm.addEventListener('submit', handleCalorieEntry);
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

// BMI Calculation
function handleBMICalculation(event) {
    event.preventDefault();
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (height && weight) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        displayBMIResult(bmi);
    }
}

function displayBMIResult(bmi) {
    const resultDiv = document.getElementById('bmi-result');
    let category, advice, color;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        advice = 'Consider gaining weight through a balanced diet and strength training.';
        color = '#3498db';
    } else if (bmi < 25) {
        category = 'Normal weight';
        advice = 'Great job! Maintain your healthy lifestyle.';
        color = '#27ae60';
    } else if (bmi < 30) {
        category = 'Overweight';
        advice = 'Consider a balanced diet and regular exercise to reach a healthy weight.';
        color = '#f39c12';
    } else {
        category = 'Obese';
        advice = 'Consult with a healthcare provider for personalized guidance.';
        color = '#e74c3c';
    }
    
    resultDiv.innerHTML = `
        <h3 style="color: ${color}; margin-bottom: 1rem;">Your BMI Result</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span>BMI Score:</span>
            <strong style="color: ${color};">${bmi.toFixed(1)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
            <span>Category:</span>
            <strong style="color: ${color};">${category}</strong>
        </div>
        <p style="background: ${color}20; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <strong>Advice:</strong> ${advice}
        </p>
    `;
    resultDiv.style.display = 'block';
}

// Workout Tracker
function handleWorkoutEntry(event) {
    event.preventDefault();
    
    const exercise = document.getElementById('exercise').value;
    const sets = parseInt(document.getElementById('sets').value);
    const reps = parseInt(document.getElementById('reps').value);
    const weight = parseFloat(document.getElementById('weight-used').value) || 0;
    
    const workoutEntry = {
        exercise,
        sets,
        reps,
        weight,
        timestamp: new Date().toLocaleTimeString()
    };
    
    workoutExercises.push(workoutEntry);
    displayWorkoutLog();
    saveToLocalStorage('workoutExercises', workoutExercises);
    
    document.getElementById('workout-form').reset();
}

function displayWorkoutLog() {
    const exerciseList = document.getElementById('exercise-list');
    
    exerciseList.innerHTML = workoutExercises.map((exercise, index) => `
        <div class="exercise-item">
            <div>
                <strong>${exercise.exercise}</strong>
                <br>
                <small>${exercise.sets} sets × ${exercise.reps} reps${exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}</small>
            </div>
            <div>
                <small>${exercise.timestamp}</small>
                <br>
                <button onclick="removeExercise(${index})" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Remove</button>
            </div>
        </div>
    `).join('');
}

function removeExercise(index) {
    workoutExercises.splice(index, 1);
    displayWorkoutLog();
    saveToLocalStorage('workoutExercises', workoutExercises);
}

// Calorie Counter
function handleCalorieEntry(event) {
    event.preventDefault();
    
    const food = document.getElementById('food').value;
    const calories = parseInt(document.getElementById('calories').value);
    
    const foodEntry = {
        food,
        calories,
        timestamp: new Date().toLocaleTimeString()
    };
    
    totalCalories += calories;
    displayCalorieLog(foodEntry);
    updateCalorieProgress();
    saveToLocalStorage('totalCalories', totalCalories);
    
    document.getElementById('calorie-form').reset();
}

function displayCalorieLog(foodEntry) {
    const foodList = document.getElementById('food-list');
    const newFoodItem = document.createElement('div');
    newFoodItem.className = 'food-item';
    newFoodItem.innerHTML = `
        <div>
            <strong>${foodEntry.food}</strong>
            <br>
            <small>${foodEntry.timestamp}</small>
        </div>
        <div>
            <strong>${foodEntry.calories} kcal</strong>
        </div>
    `;
    foodList.appendChild(newFoodItem);
}

function updateCalorieProgress() {
    const consumedCaloriesSpan = document.getElementById('consumed-calories');
    const progressBar = document.getElementById('calorie-progress');
    
    if (consumedCaloriesSpan) {
        consumedCaloriesSpan.textContent = totalCalories;
    }
    
    if (progressBar) {
        const percentage = Math.min((totalCalories / 2000) * 100, 100);
        progressBar.style.width = percentage + '%';
    }
}

// Water Tracker
function addWater(glasses) {
    waterConsumed += glasses;
    updateWaterDisplay();
    saveToLocalStorage('waterConsumed', waterConsumed);
}

function resetWater() {
    waterConsumed = 0;
    updateWaterDisplay();
    saveToLocalStorage('waterConsumed', waterConsumed);
}

function updateWaterDisplay() {
    const glassesSpan = document.getElementById('glasses-consumed');
    const waterLevel = document.getElementById('water-level');
    
    if (glassesSpan) {
        glassesSpan.textContent = waterConsumed;
    }
    
    if (waterLevel) {
        const percentage = Math.min((waterConsumed / 8) * 100, 100);
        waterLevel.style.height = percentage + '%';
    }
}

// Contact Form Handler
function handleContactSubmission(event) {
    event.preventDefault();
    
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    event.target.reset();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="background: ${type === 'success' ? '#27ae60' : '#3498db'}; color: white; padding: 1rem 2rem; border-radius: 8px; position: fixed; top: 100px; right: 20px; z-index: 3000; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(`fitlifepro_${key}`, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(`fitlifepro_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

function loadLocalStorageData() {
    const savedWater = loadFromLocalStorage('waterConsumed');
    if (savedWater !== null) {
        waterConsumed = savedWater;
        updateWaterDisplay();
    }
    
    const savedCalories = loadFromLocalStorage('totalCalories');
    if (savedCalories !== null) {
        totalCalories = savedCalories;
        updateCalorieProgress();
    }
    
    const savedWorkouts = loadFromLocalStorage('workoutExercises');
    if (savedWorkouts) {
        workoutExercises = savedWorkouts;
        displayWorkoutLog();
    }
}

// Export functions for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.addWater = addWater;
window.resetWater = resetWater;
window.removeExercise = removeExercise;
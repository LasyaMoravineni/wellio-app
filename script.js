document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- Testimonials Carousel -------------------- */
  let slideIndex = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto play every 5s
    setInterval(nextSlide, 5000);

    // Initialize first slide
    showSlide(slideIndex);
  }

  // Mobile Navbar Toggle
document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  /* -------------------- Assessment Form -------------------- */
const steps = document.querySelectorAll(".step");
  const nextBtns = document.querySelectorAll(".next-btn");
  const prevBtns = document.querySelectorAll(".prev-btn");
  const progressBar = document.getElementById("progressBar");
  let currentStep = 0;

  // === Show Step & Update Progress ===
  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
    if (progressBar) {
      const progress = ((index + 1) / steps.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  // === Navigation Buttons ===
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentStepEl = steps[currentStep];
      const requiredInputs = currentStepEl.querySelectorAll("[required]");

      let valid = true;
      requiredInputs.forEach(input => {
        if (input.type === "radio") {
          const name = input.name;
          if (!currentStepEl.querySelector(`input[name="${name}"]:checked`)) {
            valid = false;
          }
        } else if (!input.value) {
          valid = false;
        }
      });

      if (!valid) {
        alert("Please fill in all required fields!");
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  if (steps.length > 0) showStep(currentStep);

  // === Slider Input (Health Rating) ===
  const selfRating = document.getElementById("selfRating");
  const ratingValue = document.getElementById("ratingValue");
  if (selfRating && ratingValue) {
    selfRating.addEventListener("input", () => ratingValue.textContent = selfRating.value);
  }

  /* -------------------- Body Composition Calculator -------------------- */
  const calcBtn = document.getElementById("calcComposition");
  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      const height = parseFloat(document.getElementById("height").value);
      const weight = parseFloat(document.getElementById("weight").value);
      const age = parseInt(document.getElementById("age").value);
      const gender = document.getElementById("gender").value;

      if (!height || !weight || !age || !gender) {
        alert("Please enter height, weight, age, and gender.");
        return;
      }

      const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      document.getElementById("bmiResult").textContent = bmi;

      // Body Fat % (Deurenberg formula)
      const bodyFat = (
        1.20 * bmi +
        0.23 * age -
        10.8 * (gender === "male" ? 1 : 0) -
        5.4
      ).toFixed(1);
      document.getElementById("bodyFatResult").textContent = `${bodyFat}%`;

      // Visceral Fat Estimate
      let visceral;
      if (bmi < 18.5) visceral = "Low";
      else if (bmi < 25) visceral = "Normal";
      else if (bmi < 30) visceral = "High";
      else visceral = "Very High";
      document.getElementById("visceralResult").textContent = visceral;

      // Save composition data immediately
      const formdata = JSON.parse(localStorage.getItem("assessmentdata")) || {};
      formdata.height = height;
      formdata.weight = weight;
      formdata.bmi = bmi;
      formdata.bodyFat = bodyFat;
      formdata.visceralFat = visceral;
      formdata.gender = gender;
      localStorage.setItem("assessmentdata", JSON.stringify(formdata));
    });
  }

  /* -------------------- Form Submit -------------------- */
  const form = document.getElementById("assessmentForm");
  const viewResults = document.querySelector(".submit-btn");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Collect all data
      const data = {
        name: document.getElementById("name")?.value || "",
        age: document.getElementById("age")?.value || "",
        breakfast: document.querySelector('input[name="breakfast"]:checked')?.value || "",
        satisfaction: document.querySelector('input[name="satisfaction"]:checked')?.value || "",
        selfRating: document.getElementById("selfRating")?.value || "",
        height: document.getElementById("height")?.value || "",
        weight: document.getElementById("weight")?.value || "",
        bmi: document.getElementById("bmiResult")?.textContent || "",
        bodyFat: document.getElementById("bodyFatResult")?.textContent || "",
        visceralFat: document.getElementById("visceralResult")?.textContent || "",
        gender: document.getElementById("gender")?.value || ""
      };

      localStorage.setItem("assessmentdata", JSON.stringify(data));

      // Remove existing confirmation if any
      const existingBox = document.querySelector(".confirmation-box");
      if (existingBox) existingBox.remove();

      const overlay = document.createElement("div");
      overlay.className = "confirmation-overlay";

      const confirmationBox = document.createElement("div");
      confirmationBox.className = "confirmation-box";
      confirmationBox.innerHTML = `
        <button type="button" class="close-btn">&times;</button>
        <p>✅ Assessment submitted! Your data has been saved.</p>
        <a href="dashboard.html" class="go-dashboard-btn">View My Results</a>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(confirmationBox);
      confirmationBox.scrollIntoView({ behavior: "smooth" });

      const closeBox = () => {
        confirmationBox.remove();
        overlay.remove();
        viewResults.innerText = "View Results";
      };

      confirmationBox.querySelector(".close-btn").addEventListener("click", closeBox);
      overlay.addEventListener("click", closeBox);
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- Dashboard -------------------- */
  const elements = {
    name: document.getElementById("userName"),
    age: document.getElementById("userAge"),
    bmiValue: document.getElementById("bmiValue"),
    bmicategoryEl: document.getElementById("bmiCategory"),
    bodyFat: document.getElementById("bodyFatValue"),
    visceralFat: document.getElementById("visceralFatValue"),
    dashboardRating: document.getElementById("dashboardRating"),
    breakfast: document.getElementById("breakfastValue"),
    satisfaction: document.getElementById("satisfactionValue"),
    wellnessScore: document.getElementById("wellnessScore"),
    wellnessBar: document.getElementById("wellnessBar"),
    ratingBar: document.getElementById("ratingBar"),
    summaryText: document.getElementById("summaryText"),
    healthTip: document.getElementById("healthTip")
  };

  // Load stored data (use consistent key)
  const data = JSON.parse(localStorage.getItem("assessmentdata")) || {};

  /* -------------------- Populate Dashboard Fields -------------------- */
  if (elements.name) elements.name.textContent = data.name || "--";
  if (elements.age) elements.age.textContent = data.age || "--";
  if (elements.bmiValue) elements.bmiValue.textContent = data.bmi || "--";
  if (elements.bodyFat) elements.bodyFat.textContent = data.bodyFat || "--";
  if (elements.visceralFat) elements.visceralFat.textContent = data.visceralFat || "--";
  if (elements.dashboardRating) elements.dashboardRating.textContent = data.selfRating || "--";
  if (elements.breakfast)
    elements.breakfast.textContent = data.breakfast === "yes" ? "Regular" :
                                     data.breakfast === "no" ? "Not Regular" : "--";
  if (elements.satisfaction)
    elements.satisfaction.textContent = data.satisfaction === "yes" ? "Satisfied" :
                                        data.satisfaction === "no" ? "Not satisfied" : "--";

  /* -------------------- Compute BMI Category -------------------- */
  let category = "--";
  if (data.bmi) {
    const bmiNum = parseFloat(data.bmi);
    if (bmiNum < 18.5) category = "Underweight";
    else if (bmiNum < 25) category = "Normal";
    else if (bmiNum < 30) category = "Overweight";
    else category = "Obese";
  }
  console.log(category)
if (elements.bmicategoryEl) {
    elements.bmicategoryEl.textContent = category;
}
  /* -------------------- Health Rating Progress -------------------- */
  if (elements.ratingBar && data.selfRating) {
    elements.ratingBar.style.width = `${(data.selfRating / 10) * 100}%`;
  }

  /* -------------------- Compute Wellness Score -------------------- */
  let wellness = 40; // base
  if (category === "Normal") wellness += 30;
  else if (category === "Overweight") wellness += 15;
  else if (category === "Underweight") wellness += 10;
  else if (category === "Obese") wellness += 5;

  if (data.bodyFat) {
    const bf = parseFloat(data.bodyFat);
    wellness += bf >= 10 && bf <= 25 ? 10 : 5;
  }

  if (data.visceralFat) {
    const vf = parseFloat(data.visceralFat);
    wellness += vf <= 10 ? 10 : 5;
  }

  if (data.breakfast === "yes") wellness += 10;
  else wellness -= 5;
  if (data.satisfaction === "yes") wellness += 10;
  else wellness -= 5;

  wellness = Math.max(0, Math.min(100, wellness));


  data.wellnessScore = wellness;
  localStorage.setItem("assessmentdata", JSON.stringify(data));



  let wellnessCategory = wellness >= 75 ? "Good" : wellness >= 45 ? "Average" : "Poor";

  if (elements.wellnessScore) elements.wellnessScore.textContent = wellness;
  if (elements.wellnessBar) elements.wellnessBar.style.width = `${wellness}%`;



  /* -------------------- Risk Factor -------------------- */
  let riskLevel = "Unknown";
  let riskScore = 0;
  const bodyFat = parseFloat(data.bodyFat) || 0;
  const visceralFat = parseFloat(data.visceralFat) || 0;

  if (bodyFat === 0 && visceralFat === 0) {
    riskLevel = "Not Assessed";
  } else if (bodyFat < 20 && visceralFat < 10) {
    riskLevel = "Low Risk";
    riskScore = 1;
  } else if (bodyFat < 30 && visceralFat < 15) {
    riskLevel = "Moderate Risk";
    riskScore = 2;
  } else {
    riskLevel = "High Risk";
    riskScore = 3;
  }

  const riskCard = document.createElement("div");
  riskCard.classList.add("card");
  riskCard.innerHTML = `
    <h3>Health Risk Factor</h3>
    <p id="riskValue">${riskLevel}</p>
    <small>Based on body fat & visceral fat</small>
  `;
  document.querySelector(".card-container").appendChild(riskCard);




  /* -------------------- Summary Text -------------------- */
  if (elements.summaryText) {
    elements.summaryText.textContent = `
      ${data.name ? data.name + "," : "You"} your BMI is ${data.bmi || "--"} (${category}).
      You rated your health ${data.selfRating || "--"}/10.
      Your body fat is ${data.bodyFat || "--"}% and visceral fat is ${data.visceralFat || "--"}.
      Your overall Wellness Score is ${wellness}/100 (${wellnessCategory}).
      ${data.breakfast === "yes"
        ? "Excellent job maintaining your breakfast routine!"
        : "Try to include breakfast consistently to boost metabolism."}
      ${data.satisfaction === "yes"
        ? " You’re feeling confident about your health!"
        : " Let’s work toward higher satisfaction through small improvements."}
    `;
  }

  /* -------------------- Health Tips -------------------- */
  if (elements.healthTip) {
    const healthTips = {
      "Underweight": [
        "Eat more frequently and include healthy fats like nuts and avocados.",
        "Combine resistance training with a protein-rich diet.",
        "Monitor calorie intake to ensure a surplus."
      ],
      "Normal": [
        "Maintain balanced nutrition and consistent workouts.",
        "Stay hydrated and get 7–8 hours of sleep.",
        "Continue regular health monitoring."
      ],
      "Overweight": [
        "Focus on portion control and daily movement.",
        "Reduce refined sugars and increase dietary fiber.",
        "Include cardio + strength workouts for fat management."
      ],
      "Obese": [
        "Consult a nutritionist or health coach for guidance.",
        "Incorporate gentle, regular activity to start.",
        "Avoid crash diets; aim for gradual, sustainable change."
      ],
      "default": [
        "Complete your full assessment for personalized tips.",
        "Drink plenty of water and prioritize consistent meals.",
        "Incorporate fruits, vegetables, and daily exercise."
      ]
    };
    const selectedTips = healthTips[category] || healthTips["default"];
    elements.healthTip.innerHTML = "<ul>" + selectedTips.map(t => `<li>${t}</li>`).join("") + "</ul>";
  }

  /* -------------------- Bar Chart -------------------- */
  const ctx = document.getElementById("healthChart");
  if (ctx) {
    const bmiQuality = category === "Normal" ? 1 : category === "Underweight" ? 2 :
                       category === "Overweight" ? 2 : category === "Obese" ? 3 : 0;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["BMI", "Risk Factor"],
        datasets: [{
          label: "Health Level (1 = Optimal, 3 = High Risk)",
          data: [bmiQuality, riskScore],
          backgroundColor: ["#66bb6a", "#ef5350"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            min: 0,
            max: 3,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return value === 1 ? "Optimal"
                     : value === 2 ? "Moderate"
                     : value === 3 ? "High Risk" : "";
              }
            },
            title: { display: true, text: "Health Risk Level" }
          }
        }
      }
    });
  }

  /* -------------------- Donut Chart -------------------- */
  const donutEl = document.getElementById("bmiDonut");
  if (donutEl) {
    const donutCtx = donutEl.getContext("2d");
    const bmiDistribution = [7, 50, 27, 16];
    const labels = ["Underweight", "Normal", "Overweight", "Obese"];
    const colors = ["#ffcc80", "#66bb6a", "#ffb74d", "#e57373"];
    const index = labels.indexOf(category);

    new Chart(donutCtx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: bmiDistribution,
          backgroundColor: colors,
          borderColor: labels.map((_, i) => i === index ? "#000" : "#fff"),
          borderWidth: labels.map((_, i) => i === index ? 4 : 2)
        }]
      },
      options: {
        responsive: true,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              generateLabels: chart => chart.data.labels.map((l, i) => ({
                text: `${l}: ${chart.data.datasets[0].data[i]}%${i === index ? " (You)" : ""}`,
                fillStyle: chart.data.datasets[0].backgroundColor[i],
                strokeStyle: chart.data.datasets[0].borderColor[i],
                lineWidth: chart.data.datasets[0].borderWidth[i]
              }))
            }
          }
        }
      }
    });
  }
  });

  // nutrition.js
document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("assessmentdata")) || {};

  // Determine BMI category
  let category = "--";
  if (data.bmi) {
      const bmiNum = parseFloat(data.bmi);
      if (bmiNum < 18.5) category = "Underweight";
      else if (bmiNum < 25) category = "Normal";
      else if (bmiNum < 30) category = "Overweight";
      else category = "Obese";
  }

  /* -------------------- Nutrition Targets -------------------- */
  let userTargets = { calories: 2000, protein: 75, carbs: 250, fats: 70 };
  if (data.bmi) {
    const bmiNum = parseFloat(data.bmi);
    if (bmiNum < 18.5) userTargets = { calories: 2500, protein: 90, carbs: 300, fats: 80 };
    else if (bmiNum < 25) userTargets = { calories: 2000, protein: 75, carbs: 250, fats: 70 };
    else if (bmiNum < 30) userTargets = { calories: 1800, protein: 70, carbs: 220, fats: 60 };
    else userTargets = { calories: 1600, protein: 65, carbs: 200, fats: 50 };
  }

  document.getElementById("caloriesTarget").textContent = userTargets.calories;
  document.getElementById("proteinTarget").textContent = userTargets.protein;
  document.getElementById("carbsTarget").textContent = userTargets.carbs;
  document.getElementById("fatsTarget").textContent = userTargets.fats;

  /* -------------------- Nutrition Tips -------------------- */
  const nutritionTipsList = document.getElementById("nutritionTips");
  if (nutritionTipsList) {
    nutritionTipsList.innerHTML = ""; // clear previous
    const nutritionTips = {
      "Underweight": [
        "Eat 5–6 small meals per day instead of 2–3 big ones.",
        "Include strength training to build lean muscle mass.",
        "Get at least 7–9 hours of quality sleep to support weight gain.",
        "Manage stress, as high stress can reduce appetite."
      ],
      "Normal": [
        "Maintain consistent meal timings to support digestion.",
        "Stay active with at least 30 minutes of daily movement.",
        "Aim for 7–8 hours of sleep for overall health.",
        "Practice mindful eating to avoid overeating."
      ],
      "Overweight": [
        "Add at least 30–45 minutes of physical activity most days.",
        "Prioritize good sleep (7–9 hours) to regulate appetite hormones.",
        "Limit screen time before bed for better rest quality.",
        "Manage stress with yoga, meditation, or light walks."
      ],
      "Obese": [
        "Start with low-impact activities like walking, swimming, or cycling.",
        "Break long sitting periods with short activity breaks every hour.",
        "Focus on consistent sleep schedules to support metabolism.",
        "Work on stress management – high stress can hinder weight loss."
      ],
      "--": ["Complete your assessment to get personalized tips."]
    };
    (nutritionTips[category] || nutritionTips["--"]).forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip;
      nutritionTipsList.appendChild(li);
    });
  }

  /* -------------------- Food Guidance -------------------- */
  const foodGuidancedata = {
    Underweight: {
      bestFriends: ["Nuts & Seeds 🌰", "Whole Milk 🥛", "Avocados 🥑", "Lean Protein 🍗"],
      sometimes: ["Smoothies 🍹", "Cheese 🧀", "Whole Grain Bread 🍞"],
      avoid: ["Diet Sodas 🥤", "Excess Caffeine ☕", "Processed Snacks 🍪"]
    },
    Normal: {
      bestFriends: ["Leafy Greens 🥬", "Lean Protein (Fish, Eggs, Lentils) 🍳", "Whole Grains 🌾", "Nuts & Seeds 🌰"],
      sometimes: ["Dark Chocolate 🍫", "Pasta 🍝", "Smoothies 🍹"],
      avoid: ["Sugary Drinks 🥤", "Fried Snacks 🍟", "Processed Meats 🌭"]
    },
    Overweight: {
      bestFriends: ["Vegetables 🥦", "Legumes (Beans, Lentils) 🫘", "Lean Protein 🐟", "Fruits 🍎"],
      sometimes: ["Nuts (small portions) 🌰", "Cheese 🧀", "Brown Rice 🍚"],
      avoid: ["Refined Carbs 🍞", "Sugary Drinks 🥤", "Fried Foods 🍟", "Sweets 🍬"]
    },
    Obese: {
      bestFriends: ["High-Fiber Veggies 🥦", "Lean Protein 🥩", "Fruits 🍓", "Oats & Barley 🌾"],
      sometimes: ["Olive Oil 🫒", "Avocado 🥑", "Nuts (tiny portions) 🌰"],
      avoid: ["Fast Food 🍔", "Sugary Desserts 🍩", "Refined Carbs 🍞", "Fizzy Drinks 🥤"]
    },
    "--": {
      bestFriends: ["Complete your assessment to get suggestions."],
      sometimes: [],
      avoid: []
    }
  };

  function renderFoodGuidance(cat) {
    const guidance = foodGuidancedata[cat] || foodGuidancedata["--"];
    document.getElementById("bestFriendsList").innerHTML = guidance.bestFriends.map(i => `<li>${i}</li>`).join("");
    document.getElementById("sometimesList").innerHTML = guidance.sometimes.map(i => `<li>${i}</li>`).join("");
    document.getElementById("avoidList").innerHTML = guidance.avoid.map(i => `<li>${i}</li>`).join("");
  }

  renderFoodGuidance(category);

  /* -------------------- Plate Chart -------------------- */
  const plateConfigs = {
    Underweight: [
      { name: 'Carbs', y: 40, color: '#ffcc80', customTip: 'Boost energy with more carbs', sources: 'Rice, Oats, Quinoa, Potatoes' },
      { name: 'Healthy Fats', y: 20, color: '#ff7043', customTip: 'Add nuts, seeds & healthy oils', sources: 'Avocado, Nuts, Olive Oil, Seeds' },
      { name: 'Protein', y: 20, color: '#42a5f5', customTip: 'Support healthy weight gain', sources: 'Eggs, Lentils, Chicken, Tofu' },
      { name: 'Vegetables/Fruits', y: 20, color: '#66bb6a', customTip: 'Essential fiber & vitamins', sources: 'Spinach, Broccoli, Berries, Apples' }
    ],
    Normal: [
      { name: 'Carbs', y: 35, color: '#ffcc80', customTip: 'Balanced energy source', sources: 'Rice, Oats, Quinoa, Potatoes' },
      { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Supports hormones & brain health', sources: 'Avocado, Nuts, Olive Oil, Seeds' },
      { name: 'Protein', y: 20, color: '#42a5f5', customTip: 'Maintains muscle mass', sources: 'Eggs, Lentils, Chicken, Tofu' },
      { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'Packed with nutrients', sources: 'Spinach, Broccoli, Berries, Apples' }
    ],
    Overweight: [
      { name: 'Carbs', y: 30, color: '#ffcc80', customTip: 'Prefer whole grains, avoid sugars', sources: 'Rice, Oats, Quinoa, Potatoes' },
      { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Limit oils, focus on healthy fats', sources: 'Avocado, Nuts, Olive Oil, Seeds' },
      { name: 'Protein', y: 25, color: '#42a5f5', customTip: 'Supports satiety & metabolism', sources: 'Eggs, Lentils, Chicken, Tofu' },
      { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'High fiber to aid digestion', sources: 'Spinach, Broccoli, Berries, Apples' }
    ],
    Obese: [
      { name: 'Carbs', y: 25, color: '#ffcc80', customTip: 'Cut refined carbs, go for low GI foods', sources: 'Rice, Oats, Quinoa, Potatoes' },
      { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Avoid fried foods, use olive oil', sources: 'Avocado, Nuts, Olive Oil, Seeds' },
      { name: 'Protein', y: 30, color: '#42a5f5', customTip: 'High protein to aid weight loss', sources: 'Eggs, Lentils, Chicken, Tofu' },
      { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'Fill half the plate with fiber', sources: 'Spinach, Broccoli, Berries, Apples' }
    ]
  };

  const chartData = plateConfigs[category] || plateConfigs.Normal;

  Highcharts.chart('container', {
    chart: { type: 'pie' },
    title: { text: 'What Your Body Needs' },
    subtitle: { text: `Your category: <b>${category}</b>` },
    accessibility: { announceNewData: { enabled: true }, point: { valueSuffix: '%' } },
    plotOptions: {
      pie: {
        borderRadius: 5,
        dataLabels: [
          { enabled: true, distance: 15, format: '{point.name}' },
          {
            enabled: true,
            distance: '-30%',
            filter: { property: 'percentage', operator: '>', value: 4 },
            format: '{point.y:.1f}%',
            style: { fontSize: '0.9em', textOutline: 'none' }
          }
        ]
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return `${this.point.customTip}<br/><span style="color:#2c3e50"><b>Sources:</b> ${this.point.sources}</span>`;
      }
    },
    series: [{ name: 'Nutrients', colorByPoint: false, data: chartData }],
    navigation: { breadcrumbs: { buttonTheme: { style: { color: 'var(--highcharts-highlight-color-100)' } } } }
  });

});



// Resources page
document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".resource-card");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Remove active from all
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.dataset.category;
      console.log("Selected category:", category); // debug

      cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = ""; // reset to CSS default
        } else {
          card.style.display = "none";
        }
      });
    });
  });


});


// Progress Page
document.addEventListener("DOMContentLoaded", () => {


      // Progress bar logic
      const checkboxes = document.querySelectorAll(".checklist input[type='checkbox']");
      const progressBar = document.getElementById("progressBar");
      const progressText = document.getElementById("progressText");

      // Create a message container
      let message = document.createElement("div");
      message.id = "progressMessage";
      message.style.marginTop = "10px";
      message.style.opacity = 0;
      message.style.transition = "opacity 0.5s ease";
      document.querySelector(".checklist").appendChild(message);

      function updateProgress() {
        const total = checkboxes.length;
        const checked = document.querySelectorAll(".checklist input:checked").length;
        const percent = (checked / total) * 100;

        progressBar.style.width = percent + "%";
        progressText.textContent = `${checked} / ${total} completed`;

        // Show message if all done
        if (checked === total) {
          message.textContent = "🎉 Good work! Keep it up!";
          message.style.opacity = 1;

          // Optional: brief animation
          message.style.transform = "scale(1.1)";
          setTimeout(() => { message.style.transform = "scale(1)"; }, 300);
        } else {
          message.style.opacity = 0;
        }
      }

      // Attach event listeners
      checkboxes.forEach(cb => cb.addEventListener("change", updateProgress));



      // Custom plugin to draw center text
      const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart, args, options) {
          const { ctx, chartArea: { width, height } } = chart;
          ctx.save();
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(options.text, width / 2, height / 2);
          ctx.restore();
        }
      };


    //ring chart
      function createRingChart(canvasId, value, color) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [value, 100 - value],
          backgroundColor: [color, "#e0e0e0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "75%",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          centerText: { text: value + "%" } // <-- pass text here
        }
      },
      plugins: [centerTextPlugin] // register plugin
    });
  }

  // Create rings with example values
  createRingChart("hydrationRing", 75, "#42a5f5"); // Blue
  createRingChart("sleepRing", 60, "#7e57c2");     // Purple
  createRingChart("exerciseRing", 40, "#ef5350");  // Red
  createRingChart("nutritionRing", 85, "#66bb6a"); // Green



  const goalForm = document.getElementById("goalForm");
  const goalList = document.getElementById("goalList");

  // Handle goals
  const addGoalBtn = document.getElementById("addGoalBtn");
  const goalsList = document.getElementById("goalsList");

  addGoalBtn.addEventListener("click", () => {
    const name = document.getElementById("goalName").value.trim();
    const current = parseFloat(document.getElementById("currentValue").value);
    const target = parseFloat(document.getElementById("targetValue").value);
    const deadline = document.getElementById("deadline").value;

    if (!name || isNaN(current) || isNaN(target) || !deadline) {
      alert("Please fill in all fields.");
      return;
    }

    // Calculate initial progress
    const progress = ((target < current) 
      ? ((current - target) / (current - target)) * 100 // if target < current
      : (current / target) * 100).toFixed(1);

    // Goal Card
    const goalCard = document.createElement("div");
    goalCard.classList.add("goal-card");
    goalCard.innerHTML = `
      <h5>${name}</h5>
      <p><strong>Deadline:</strong> ${deadline}</p>
      <div class="progress-container">
        <div class="progress-bar" style="width:${progress}%"></div>
      </div>
      <p class="progress-text">Current: ${current} | Target: ${target}</p>
      <input type="number" class="updateValue" placeholder="Update current value">
      <button class="updateBtn">Update</button>
    `;

    // Remove "No goals" text if first goal
    if (goalsList.querySelector("p")) goalsList.innerHTML = "";

    goalsList.appendChild(goalCard);

    // Handle updating progress
    const updateBtn = goalCard.querySelector(".updateBtn");
    const updateInput = goalCard.querySelector(".updateValue");
    const progressBar = goalCard.querySelector(".progress-bar");
    const progressText = goalCard.querySelector(".progress-text");

    updateBtn.addEventListener("click", () => {
      const newVal = parseFloat(updateInput.value);
      if (isNaN(newVal)) return;

      let newProgress;
      if (target < current) {
        // Weight loss or decrease goals
        newProgress = ((current - newVal) / (current - target)) * 100;
      } else {
        // Weight gain or increase goals
        newProgress = (newVal / target) * 100;
      }

      newProgress = Math.min(100, Math.max(0, newProgress));
      progressBar.style.width = newProgress + "%";
      progressText.textContent = `Current: ${newVal} | Target: ${target}`;

      updateInput.value = "";
    });

    // Reset form
    document.getElementById("goalName").value = "";
    document.getElementById("currentValue").value = "";
    document.getElementById("targetValue").value = "";
    document.getElementById("deadline").value = "";
  });


  const moodButtons = document.querySelectorAll(".mood-btn");
  const journalInput = document.getElementById("journalInput");
  const saveBtn = document.getElementById("saveEntryBtn");
  const entriesList = document.getElementById("entriesList");

  let selectedMood = "";

  // Handle mood selection
  moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedMood = btn.dataset.mood;
      moodButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });

  // Save journal entry
  saveBtn.addEventListener("click", () => {
    const text = journalInput.value.trim();
    if (!selectedMood && !text) return;

    const li = document.createElement("li");
    const date = new Date().toLocaleDateString();

    li.innerHTML = `
      <div class="entry-card">
        <span class="entry-mood">${selectedMood || "📝"}</span>
        <div class="entry-details">
          <p class="entry-text">${text || "(No text provided)"}</p>
          <span class="entry-date">${date}</span>
        </div>
      </div>
    `;

    entriesList.prepend(li); // newest on top
    journalInput.value = "";
    selectedMood = "";
    moodButtons.forEach(b => b.classList.remove("selected"));
  });


  const joinButtons = document.querySelectorAll(".join-btn");
  const badgesContainer = document.getElementById("achievementBadges");

  joinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const challengeName = btn.dataset.challenge;

      // Create badge
      const badge = document.createElement("div");
      badge.classList.add("badge");
      badge.innerText = challengeName;

      // Add badge to achievements
      if (badgesContainer.querySelector("p")) {
        badgesContainer.innerHTML = ""; // clear "no achievements" text
      }
      badgesContainer.appendChild(badge);

      // Disable join button after joining
      btn.innerText = "Joined ✅";
      btn.disabled = true;
      btn.classList.add("joined");
    });
  });


  const generateBtn = document.getElementById("generateReportBtn");
  const reportPreview = document.getElementById("reportPreview");
  const reportList = document.getElementById("reportList");
  const reportDate = document.getElementById("reportDate");
  const downloadBtn = document.getElementById("downloadReportBtn");

  // Retrieve user data from localStorage
  const data = JSON.parse(localStorage.getItem("assessmentdata")) || {};
  
  //test
  console.log(data)  
       
  const category = data.bmi ? (
    data.bmi < 18.5 ? "Underweight" :
    data.bmi < 25 ? "Normal" :
    data.bmi < 30 ? "Overweight" : "Obese"
  ) : "--";

  // Dummy values for now (replace with real values from your dashboard logic)
  const wellnessScore = data.wellnessScore || 78;
  const checklistCompletion = data.checklistCompletion || 75;
  const goalsAchieved = data.goalsAchieved || 2;
  const totalGoals = data.totalGoals || 5;
  const recentMoodTrend = data.moodTrend || ["😀", "🙂", "😐"];
  const challenges = data.challenges || ["Yoga", "Hydration"];


  generateBtn.addEventListener("click", () => {
    reportPreview.style.display = "block";
    reportDate.textContent = new Date().toLocaleDateString();

    // Generate report content dynamically
    reportList.innerHTML = `
      <li><strong>Name:</strong> ${data.name}</li>
      <li><strong>Age:</strong> ${data.age}</li>
      <li><strong>Wellness Score:</strong> ${wellnessScore} / 100</li>
      <li><strong>Checklist Completion:</strong> ${checklistCompletion}% (Avg)</li>
      <li><strong>Goals Achieved:</strong> ${goalsAchieved} / ${totalGoals}</li>
      <li><strong>Recent Mood Trend:</strong> ${recentMoodTrend.join(" ")}</li>
      <li><strong>Challenges Joined:</strong> ${challenges.join(", ")}</li>
      <li><strong>Current BMI:</strong> ${data.bmi || "--"} (${category})</li>
      <li><strong>Estimated Daily Calories:</strong> ${data.calories || "2000"} kcal</li>
      <li><strong>General Suggestion:</strong> ${
        category === "Underweight"
          ? "Increase calorie intake and include protein-rich foods."
          : category === "Normal"
          ? "Maintain balanced nutrition and stay active."
          : category === "Overweight"
          ? "Focus on portion control and increase physical activity."
          : category === "Obese"
          ? "Consult a nutritionist and start a gradual workout routine."
          : "Complete your assessment for personalized advice."
      }</li>
    `;
  });

  // Download as PDF
  downloadBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("🌿 Wellness Progress Report", 20, 20);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text("-----------------------------------------", 20, 35);

    let y = 50;
    const reportItems = [
      `Checklist Completion: ${checklistCompletion}% (Avg)`,
      `Goals Achieved: ${goalsAchieved} / ${totalGoals}`,
      `Recent Mood Trend: ${recentMoodTrend.join(" ")}`,
      `Challenges Joined: ${challenges.join(", ")}`,
      `Current BMI: ${data.bmi || "--"} (${category})`,
      `Estimated Daily Calories: ${data.calories || "2000"} kcal`,
      `Wellness Score: ${wellnessScore}/100`,
      `Suggestion: ${
        category === "Underweight"
          ? "Eat more frequently and include calorie-dense foods."
          : category === "Normal"
          ? "Maintain consistency with your habits."
          : category === "Overweight"
          ? "Increase activity levels and track calories."
          : category === "Obese"
          ? "Begin gradual lifestyle changes and seek professional support."
          : "Complete your assessment for full insights."
      }`
    ];

    reportItems.forEach(item => {
      doc.text(item, 20, y);
      y += 12;
    });

    doc.save("Wellness_Progress_Report.pdf");
  });



  // Weekly Progress chart
  const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    const weeklyChart = new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
          label: 'Checklist Completion',
          data: [3,4,2,4,3,4,1],
          backgroundColor: '#4caf50'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Wellness Journey Chart
    // const journeyCtx = document.getElementById('journeyChart').getContext('2d');
    // const journeyChart = new Chart(journeyCtx, {
    //   type: 'line',
    //   data: {
    //     labels: ['Week 1','Week 2','Week 3','Week 4'],
    //     datasets: [{
    //       label: 'Wellness Score',
    //       data: [60, 70, 75, 85],
    //       fill: true,
    //       backgroundColor: 'rgba(76,175,80,0.2)',
    //       borderColor: '#4caf50',
    //       tension: 0.3
    //     }]
    //   },
    //   options: { responsive: true }
    // });


});

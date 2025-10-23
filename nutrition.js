// Personalized daily nutrition targets
document.addEventListener("DOMContentLoaded", () => {
  const Data = JSON.parse(localStorage.getItem("assessmentData")) || {};

  let userTargets = { calories: 2000, protein: 75, carbs: 250, fats: 70 };

  if (Data.bmi) {
    const bmiNum = parseFloat(Data.bmi);
    if (bmiNum < 18.5) {
      userTargets = { calories: 2500, protein: 90, carbs: 300, fats: 80 };
    } else if (bmiNum < 25) {
      userTargets = { calories: 2000, protein: 75, carbs: 250, fats: 70 };
    } else if (bmiNum < 30) {
      userTargets = { calories: 1800, protein: 70, carbs: 220, fats: 60 };
    } else {
      userTargets = { calories: 1600, protein: 65, carbs: 200, fats: 50 };
    }
  }

  // Update the HTML dynamically
  document.getElementById("caloriesTarget").textContent = userTargets.calories;
  document.getElementById("proteinTarget").textContent = userTargets.protein;
  document.getElementById("carbsTarget").textContent = userTargets.carbs;
  document.getElementById("fatsTarget").textContent = userTargets.fats;

  // Personalized nutrition tips
      const tipsList = document.getElementById("nutritionTips");
      let Category = "--";
      if (Data.bmi) {
        const bmiNum = parseFloat(Data.bmi);
        if (bmiNum < 18.5) Category = "Underweight";
        else if (bmiNum < 25) Category = "Normal";
        else if (bmiNum < 30) Category = "Overweight";
        else Category = "Obese";
      }

      const tips = {
          Underweight: [
            "Eat 5–6 small meals per day instead of 2–3 big ones.",
            "Include strength training to build lean muscle mass.",
            "Get at least 7–9 hours of quality sleep to support weight gain.",
            "Manage stress, as high stress can reduce appetite."
          ],
          Normal: [
            "Maintain consistent meal timings to support digestion.",
            "Stay active with at least 30 minutes of daily movement.",
            "Aim for 7–8 hours of sleep for overall health.",
            "Practice mindful eating to avoid overeating."
          ],
          Overweight: [
            "Add at least 30–45 minutes of physical activity most days.",
            "Prioritize good sleep (7–9 hours) to regulate appetite hormones.",
            "Limit screen time before bed for better rest quality.",
            "Manage stress with yoga, meditation, or light walks."
          ],
          Obese: [
            "Start with low-impact activities like walking, swimming, or cycling.",
            "Break long sitting periods with short activity breaks every hour.",
            "Focus on consistent sleep schedules to support metabolism.",
            "Work on stress management – high stress can hinder weight loss."
          ],
        "--": ["Complete your assessment to get personalized tips."]
      };

      tips[Category].forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsList.appendChild(li);
      });

      const plateConfigs = {
        Underweight: [
          { name: 'Carbs', y: 40, color: '#ffcc80', customTip: 'Boost energy with more carbs', sources: 'Rice, Oats, Quinoa, Potatoes' },
          { name: 'Healthy Fats', y: 20, color: '#ff7043', customTip: 'Add nuts, seeds & healthy oils', sources: 'Avocado, Nuts, Olive Oil, Seeds'},
          { name: 'Protein', y: 20, color: '#42a5f5', customTip: 'Support healthy weight gain',sources: 'Eggs, Lentils, Chicken, Tofu' },
          { name: 'Vegetables/Fruits', y: 20, color: '#66bb6a', customTip: 'Essential fiber & vitamins', sources: 'Spinach, Broccoli, Berries, Apples'}
        ],
        Normal: [
          { name: 'Carbs', y: 35, color: '#ffcc80', customTip: 'Balanced energy source',sources: 'Rice, Oats, Quinoa, Potatoes'},
          { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Supports hormones & brain health',sources: 'Avocado, Nuts, Olive Oil, Seeds' },
          { name: 'Protein', y: 20, color: '#42a5f5', customTip: 'Maintains muscle mass',sources: 'Eggs, Lentils, Chicken, Tofu'  },
          { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'Packed with nutrients', sources: 'Spinach, Broccoli, Berries, Apples' }
        ],
        Overweight: [
          { name: 'Carbs', y: 30, color: '#ffcc80', customTip: 'Prefer whole grains, avoid sugars' ,sources: 'Rice, Oats, Quinoa, Potatoes'},
          { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Limit oils, focus on healthy fats',sources: 'Avocado, Nuts, Olive Oil, Seeds' },
          { name: 'Protein', y: 25, color: '#42a5f5', customTip: 'Supports satiety & metabolism' ,sources: 'Eggs, Lentils, Chicken, Tofu' },
          { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'High fiber to aid digestion', sources: 'Spinach, Broccoli, Berries, Apples' }
        ],
        Obese: [
          { name: 'Carbs', y: 25, color: '#ffcc80', customTip: 'Cut refined carbs, go for low GI foods',sources: 'Rice, Oats, Quinoa, Potatoes' },
          { name: 'Healthy Fats', y: 15, color: '#ff7043', customTip: 'Avoid fried foods, use olive oil',sources: 'Avocado, Nuts, Olive Oil, Seeds' },
          { name: 'Protein', y: 30, color: '#42a5f5', customTip: 'High protein to aid weight loss' ,sources: 'Eggs, Lentils, Chicken, Tofu' },
          { name: 'Vegetables/Fruits', y: 30, color: '#66bb6a', customTip: 'Fill half the plate with fiber' , sources: 'Spinach, Broccoli, Berries, Apples'}
        ]
      };

      const chartData = plateConfigs[Category] || plateConfigs.Normal;

// ✅ Food Guidance Section
const foodGuidanceData = {
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

// Render Food Guidance
function renderFoodGuidance(cat) {
  const Data = foodGuidanceData[cat] || foodGuidanceData["--"];
  document.getElementById("bestFriendsList").innerHTML = Data.bestFriends.map(i => `<li>${i}</li>`).join("");
  document.getElementById("sometimesList").innerHTML = Data.sometimes.map(i => `<li>${i}</li>`).join("");
  document.getElementById("avoidList").innerHTML = Data.avoid.map(i => `<li>${i}</li>`).join("");
}

// Run once on load
renderFoodGuidance(Category);



// Create the diet plate chart
Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Balanced Plate'
    },
    subtitle: {
        text: `For your Category: <b>${Category}</b>`
    },

    accessibility: {
        announceNewData: {
            enabled: true
        },
        point: {
            valueSuffix: '%'
        }
    },

    plotOptions: {
        pie: {
            borderRadius: 5,
            dataLabels: [{
                enabled: true,
                distance: 15,
                format: '{point.name}'
            }, {
                enabled: true,
                distance: '-30%',
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                },
                format: '{point.y:.1f}%',
                style: {
                    fontSize: '0.9em',
                    textOutline: 'none'
                }
            }]
        }
    },

    tooltip: {
        useHTML: true,
    formatter: function () {
      return `
        ${this.point.customTip}<br/>
        <span style="color:#2c3e50"><b>Sources:</b> ${this.point.sources}</span>
      `;
    }
    },

    series: [
    {
      name: 'Nutrients',
      colorByPoint: false,
      Data: chartData
    }
  ],

    navigation: {
        breadcrumbs: {
            buttonTheme: {
                style: {
                    color: 'var(--highcharts-highlight-color-100)'
                }
            }
        }
    }
});


});
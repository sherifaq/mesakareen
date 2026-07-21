/******************************************************
 *
 * Diabetes Food Guide
 * app.js
 *
 ******************************************************/

/******************************************************
 * المتغيرات العامة
 ******************************************************/

let meal = [];

let selectedFood = null;

/******************************************************
 * عناصر الصفحة
 ******************************************************/

const searchInput = document.getElementById("search");
const resultsContainer = document.getElementById("results");

const mealBody = document.getElementById("mealBody");

const quantityModal =
document.getElementById("quantityModal");

const quantityInput =
document.getElementById("quantityInput");

const modalFoodName =
document.getElementById("modalFoodName");

const confirmButton =
document.getElementById("confirmAdd");

const cancelButton =
document.getElementById("cancelAdd");

/******************************************************
 * عناصر الملخص
 ******************************************************/

const totalCarbs =
document.getElementById("totalCarbs");

const totalProtein =
document.getElementById("totalProtein");

const totalFat =
document.getElementById("totalFat");

const totalCalories =
document.getElementById("totalCalories");

const averageGI =
document.getElementById("averageGI");

const mealGL =
document.getElementById("mealGL");

const mealScore =
document.getElementById("mealScore");

const mealAbsorption =
document.getElementById("mealAbsorption");

const mealDelay =
document.getElementById("mealDelay");

const mealLevel =
document.getElementById("mealLevel");

const mealAdvice =
document.getElementById("mealAdvice");

/******************************************************
 * بدء التطبيق
 ******************************************************/

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp(){

    registerEvents();

    renderFoods(foods);

}

/******************************************************
 * ربط الأحداث
 ******************************************************/

function registerEvents(){

    searchInput.addEventListener(
        "input",
        searchFoods
    );

    confirmButton.addEventListener(
        "click",
        confirmAddFood
    );

    cancelButton.addEventListener(
        "click",
        closeModal
    );

    quantityInput.addEventListener(
        "keydown",
        function(e){

            if(e.key==="Enter"){

                confirmAddFood();

            }

        }
    );

    quantityModal.addEventListener(
        "click",
        function(e){

            if(e.target===quantityModal){

                closeModal();

            }

        }
    );

}

/******************************************************
 * البحث
 ******************************************************/

function searchFoods(){

    const keyword =

    searchInput.value
    .trim()
    .toLowerCase();

    if(keyword===""){

        renderFoods(foods);

        return;

    }

    const filtered = foods.filter(food=>{

        if(

            food.name
            .toLowerCase()
            .includes(keyword)

        ){

            return true;

        }

        return food.aliases.some(alias=>

            alias
            .toLowerCase()
            .includes(keyword)

        );

    });

    renderFoods(filtered);

}

/******************************************************
 * عرض بطاقات الأطعمة
 ******************************************************/

function renderFoods(foodList){

    resultsContainer.innerHTML = "";

    if(foodList.length===0){

        resultsContainer.innerHTML = `

            <div class="foodCard">

                <div class="foodName">

                    لا توجد نتائج

                </div>

            </div>

        `;

        return;

    }

    foodList.forEach(food=>{

        let giColor="green";

        if(food.gi>=70){

            giColor="red";

        }
        else if(food.gi>=56){

            giColor="orange";

        }

        /* سرعة الامتصاص */

        let absorptionText="";

        switch(food.absorption){

            case 0:
                absorptionText="🚀 امتصاص سريع";
                break;

            case 1:
                absorptionText="⚡ امتصاص متوسط";
                break;

            case 2:
                absorptionText="🐢 امتصاص بطيء";
                break;

            default:
                absorptionText="غير محدد";

        }

        /* عامل التأخير */

        let delayText="";

        switch(food.delayFactor){

            case 0:
                delayText="🟢 تأخير منخفض";
                break;

            case 1:
                delayText="🟡 تأخير متوسط";
                break;

            case 2:
                delayText="🔴 تأخير مرتفع";
                break;

            default:
                delayText="غير محدد";

        }

        const card=document.createElement("div");

        card.className="foodCard";

        card.innerHTML=`

            <div class="foodName">

                ${food.name}

            </div>

            <div class="category">

                ${food.category}

            </div>

            <div class="grid">

                <div class="info">

                    <small>الكربوهيدرات</small>

                    <b>${food.carbs} جم</b>

                </div>

                <div class="info">

                    <small>البروتين</small>

                    <b>${food.protein} جم</b>

                </div>

                <div class="info">

                    <small>الدهون</small>

                    <b>${food.fat} جم</b>

                </div>

                <div class="info">

                    <small>السعرات</small>

                    <b>${food.calories}</b>

                </div>

            </div>

            <div class="tags">

                <div class="tag ${giColor}">
                    GI ${food.gi}
                </div>

                <div class="tag blue">
                    GL ${food.gl}
                </div>

                <div class="tag">
                    ${absorptionText}
                </div>

                <div class="tag">
                    ${delayText}
                </div>

            </div>

            <button class="addButton">

                إضافة للوجبة

            </button>

        `;

        card
        .querySelector(".addButton")
        .addEventListener(
            "click",
            ()=>openModal(food)
        );

        resultsContainer.appendChild(card);

    });

}

/******************************************************
 * فتح نافذة الوزن
 ******************************************************/

function openModal(food){

    selectedFood=food;

    modalFoodName.innerText=
    food.name;

    quantityInput.value=100;

    quantityModal.style.display="flex";

    quantityInput.focus();

    quantityInput.select();

}

/******************************************************
 * إغلاق النافذة
 ******************************************************/

function closeModal(){

    quantityModal.style.display="none";

    selectedFood=null;

}

/******************************************************
 * إضافة الطعام للوجبة
 ******************************************************/

function confirmAddFood(){

    if(selectedFood===null){

        return;

    }

    const grams=
    parseFloat(quantityInput.value);

    if(isNaN(grams) || grams<=0){

        alert("أدخل وزنًا صحيحًا.");

        return;

    }

    const factor=
    grams/100;

    meal.push({

        id:selectedFood.id,

        name:selectedFood.name,

        grams:grams,

        carbs:selectedFood.carbs*factor,

        protein:selectedFood.protein*factor,

        fat:selectedFood.fat*factor,

        fiber:selectedFood.fiber*factor,

        calories:selectedFood.calories*factor,

        gi:selectedFood.gi,

        gl:selectedFood.gl*factor,

        absorption:selectedFood.absorption,

        delayFactor:selectedFood.delayFactor,

        notes:selectedFood.notes,

        recommendation:selectedFood.recommendation

    });

    closeModal();

    renderMeal();

}

/******************************************************
 * حذف عنصر من الوجبة
 ******************************************************/

function deleteMealItem(index){

    meal.splice(index,1);

    renderMeal();

}

/******************************************************
 * رسم جدول الوجبة
 ******************************************************/

function renderMeal(){

    mealBody.innerHTML="";

    if(meal.length===0){

        mealBody.innerHTML=`
        <tr>
            <td colspan="8">
                لم تتم إضافة أي عنصر
            </td>
        </tr>
        `;

        updateSummary({
            carbs:0,
            protein:0,
            fat:0,
            calories:0,
            avgGI:0,
            totalGL:0,
            avgDelay:0
        });

        return;

    }

    let carbs=0;
    let protein=0;
    let fat=0;
    let calories=0;
    let totalGL=0;

    let weightedGI=0;
    let carbWeight=0;

    let delaySum=0;

    meal.forEach((item,index)=>{

        carbs+=item.carbs;
        protein+=item.protein;
        fat+=item.fat;
        calories+=item.calories;

        totalGL+=item.gl;

        weightedGI+=item.gi*item.carbs;
        carbWeight+=item.carbs;

        delaySum+=item.delayFactor;

        mealBody.innerHTML+=`

        <tr>

            <td>${item.name}</td>

            <td>${item.grams.toFixed(0)}</td>

            <td>${item.carbs.toFixed(1)}</td>

            <td>${item.protein.toFixed(1)}</td>

            <td>${item.fat.toFixed(1)}</td>

            <td>${item.calories.toFixed(0)}</td>

            <td>${item.gl.toFixed(1)}</td>

            <td>

                <button
                onclick="deleteMealItem(${index})">

                🗑️

                </button>

            </td>

        </tr>

        `;

    });

    const avgGI=

    carbWeight===0

    ?0

    :weightedGI/carbWeight;

    const avgDelay=

    delaySum/

    meal.length;

    updateSummary({

        carbs,

        protein,

        fat,

        calories,

        avgGI,

        totalGL,

        avgDelay

    });

}

/******************************************************
 * تحديث الملخص
 ******************************************************/

function updateSummary(data){

    totalCarbs.innerText=data.carbs.toFixed(1);

    totalProtein.innerText=data.protein.toFixed(1);

    totalFat.innerText=data.fat.toFixed(1);

    totalCalories.innerText=data.calories.toFixed(0);

    averageGI.innerText=data.avgGI.toFixed(0);

    mealGL.innerText=data.totalGL.toFixed(1);

    const analysis=

    calculateMealScore(data);

    mealScore.innerText=

    analysis.score;

    mealAbsorption.innerText = analysis.absorption;

    mealDelay.innerText=

    analysis.delay;

    mealLevel.innerText=

    analysis.level;

    mealAdvice.innerHTML=

    analysis.advice;

}

/******************************************************
 * حساب مؤشر التعقيد
 ******************************************************/

function calculateMealScore(data){

    // GL

    const glScore=

    Math.min(

        data.totalGL*2,

        100

    );

    // نسبة الدهون والبروتين للكربوهيدرات

    const ratio=

    (data.fat+data.protein)

    /

    Math.max(data.carbs,1);

    const ratioScore=

    Math.min(

        ratio*100,

        100

    );

    let absorption = "سريع";

        if(data.avgGI >= 70){

            absorption = "سريع";

        }
        else if(data.avgGI >= 56){

            absorption = "متوسط";

        }
        else{

            absorption = "بطيء";

        }

    // Delay

    const delayScore=

    (data.avgDelay/2)*100;

    // المعادلة النهائية

    let score=

    glScore*0.50+

    ratioScore*0.30+

    delayScore*0.20;

    score=Math.round(score);

    let delay="منخفض";

    if(data.avgDelay>=1.5){

        delay="مرتفع";

    }

    else if(data.avgDelay>=0.5){

        delay="متوسط";

    }

    let level="";
    let advice="";

    if(score<=30){

        level="🟢 بسيطة";

        advice="وجبة بسيطة غالبًا ولا تحتوي على عوامل كثيرة تؤخر امتصاص الكربوهيدرات.";

    }

    else if(score<=60){

        level="🟡 متوسطة";

        advice="وجبة متوسطة التعقيد، يُنصح بمتابعة سكر الدم بعد الوجبة لأنها قد تختلف في تأثيرها بين الأشخاص.";

    }

    else if(score<=80){

        level="🟠 مرتفعة";

        advice="الوجبة تحتوي على عوامل قد تؤدي إلى ارتفاع ممتد في سكر الدم، لذا تستحق متابعة القراءات خلال الساعات التالية.";

    }

    else{

        level="🔴 معقدة";

        advice="وجبة عالية التعقيد وقد يكون تأثيرها على سكر الدم ممتدًا بسبب مكوناتها. استخدم هذا التقييم كأداة تعليمية ولا تعتمد عليه وحده لاتخاذ قرارات جرعات الإنسولين.";

    }

    return{

        score,

        absorption,

        delay,

        level,

        advice

    };

}

/******************************************************
 * بدء التشغيل
 ******************************************************/

renderFoods(foods);
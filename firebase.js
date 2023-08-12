
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // RealtimeDatabase使うよ
const dbRef = ref(db, "grass"); // RealtimeDatabase”chat“を使うよ


function saveData() {
    const result = {
        name: $("#name").val(),
        score: $("#score").text()
    }
    console.log(result);
    const newPostRef = push(dbRef);//鍵を取得
    set(newPostRef, result);//鍵とデータの紐付け


}

//  ランキングを見るで保存
$("#ranking").on("click", function () {
    saveData();
});


//追加されたデータの自動取得と上位5位までのソート
function displayData(scores) {
    const $rankDiv = $("#rank");
    $rankDiv.empty();


    scores.sort((a, b) => b.score - a.score).slice(0, 5).forEach((score, index) => {
        const rank = index + 1;
        const $box = $("<div>").addClass("box5");
        const $rank = $("<p>").text(`${rank.toString()}位`);
        const $name = $("<p>").text(`${score.name}さん`);
        const $score = $("<p>").text(`${score.score}点`);
        // const $deleteBtn = $("<img>").addClass("deleteBtn").attr("src", "./img/trash.svg").attr("data-key", key);
        $box.append($rank, $name, $score);
        $rankDiv.append($box);


    });
}


//リセットボタンで2回目が自動で再開する
$("#reset").on("click", function () {
    saveData();
    $("#score").text("");

    const intervalId = setInterval(displayRandomImage, 1000);

    //10秒で終わるタイマーの中に、繰り返しのタイマーを入れる
    setTimeout(function () {
        clearInterval(intervalId);
        $('.cell').css('background-image', 'none');
    }, 10000);

    $(".cell").css('background-image', 'none');



});

//はじめに戻る　名前の入力から
$("#back").on("click", function () {
    saveData();
    $("#score").text("");
    $("#name").val("");

});






const scores = [];

onChildAdded(dbRef, function (data) {
    const result = data.val();
    const key = data.key;
    const score = result.score;
    const name = result.name;

    const scoreData = { key: key, score: score, name: name };
    scores.push(scoreData); score

    displayData(scores);

});


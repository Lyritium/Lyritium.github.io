var infoBox, tempBox, chineseBox; 
var startStopButton; 
var recognizing = false; 
var recognition;
var mouth = ['','ㄅ','ㄅ','ㄆ','ㄆ','ㄇ','ㄇ','ㄈ','ㄈ','ㄉ','ㄉ','ㄊ','ㄊ','ㄋ','ㄋ','ㄌ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ','ㄚ','ㄛ','ㄜ','ㄝ','ㄞ','ㄞ','ㄟ','ㄟ','ㄠ','ㄠ','ㄡ','ㄡ','ㄢ','ㄢ','ㄣ','ㄣ','ㄤ','ㄤ','ㄥ','ㄥ','ㄦ','ㄦ','ㄧ','ㄨ','ㄩ'];

$(document).ready(function () {
  infoBox = document.getElementById("infoBox");
  tempBox = document.getElementById("tempBox"); 
  chineseBox = document.getElementById("chineseBox"); 
  startStopButton = document.getElementById("startStopButton"); 

  /*確認瀏覽器是否支援API*/
  if (!('webkitSpeechRecognition' in window)) {  
    infoBox.innerText = "本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)";
  } 
  if (!('speechSynthesis' in window)) {
    infoBox.innerText = "本瀏覽器不支援語音合成，請更換瀏覽器！(Chrome 33 版以上才支援語音辨識)";
  }
  else {
    //錄音設置
    recognition = new webkitSpeechRecognition(); 
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'cmn-Hant-TW';
  
    //錄製開始
    recognition.onstart = function() { 
      recognizing = true; 
      startStopButton.value = "stop";  
      tempBox.innerHTML = '...請開始說話...'; 
    };
  
    //錄製停止
    recognition.onend = function() { 
      recognizing = false;
      startStopButton.value = "start";  
      tempBox.innerHTML = '...'; 
    };
  
    //錄製結果
    recognition.onresult = function(event) {
      var interim_transcript = ''; 
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        interim_transcript += event.results[i][0].transcript;
      }
      if (interim_transcript.trim().length > 0) 
          tempBox.innerText = interim_transcript; //中文
          chineseBox.innerText = pinyinUtil.getPinyin(interim_transcript); //注音
    };
  }
});

/*錄音按鈕*/ 
function startButton(event) {
  if (recognizing) { 
    //停止錄製
    recognition.stop();
  } 
  else { 
    //開始錄製
    recognition.start();
  }
}


function speakButton(event) {
  //動畫設置
  let vid = document.getElementById("mouthvideo");
  vid.playbackRate = 10;
  
  //語音合成
  var msg = new SpeechSynthesisUtterance('語音輸入測試');
  window.speechSynthesis.speak(msg);
  
  //語音轉注音
  var chinese = pinyinUtil.getPinyin('語音輸入測試');

  console.log(chinese);
  chineseBox.innerText = chinese;
  chinese = new String(chinese).split(' ')
  var index = 0;

  /*動畫播放__需要重寫*/ 
  let speakanimation = setInterval(() => {
      if (index >= chinese.length-1)clearInterval(speakanimation);
      //for (var i = 0; i< chinese[index].length; i++){
        switch(chinese[index][0]){
          case' ': case'ˋ': case'ˇ': case'ˊ': case'ˉ': break;
          case undefined:    
            mouthdom.src = "./image/mouth-1.png";
            break;
          default:
            changeimg(chinese,index,0);
        }
      //}
      index++;
  }, 250);
}

function changeimg(chinese,index,i){
  var mouthdom = document.getElementById("mouth");
  var mouthvideo = document.getElementById("mouthvideo");
  console.log(chinese[index][i] ,mouth.indexOf(chinese[index][i]));
  mouthdom.src = "./image/mouth-"+mouth.indexOf(chinese[index][i])+".png"
  mouthvideo.setAttribute('src',  "./video/document_"+mouth.indexOf(chinese[index][i])+".mp4");
  mouthvideo.setAttribute('playbackRate', '10');
}
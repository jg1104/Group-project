let jsonNum = 1;
async function beginbot() {
  await fetch("./Botquestions.json")
    .then(response => {
      return response.json();
    })
    .then((collectjson) => {
      pile(collectjson);
    });
}
function pile(collectjson) {
  livemessage = findMessageInJsonById(collectjson, jsonNum);

  beforeChat("show", document.getElementById("botFramestyle"));
  document.getElementById("Chatsetup").style.visibility = 'hidden';
  document.getElementById("messagePattern").style.visibility = 'visible';
  setTimeout(function () {
    beforeChat("remove");
    compileLivechat(collectjson, livemessage);
  }, 1000);
}
function pick(collectjson, livemessage) {
  let botFrame = document.getElementById("botFramestyle");
  let pickoneBox = document.createElement("li");
  pickoneBox.classList.add("pickone");
  pickoneBox.setAttribute('id', 'pickone');
  let pickoneRecord = document.createElement("ul");
  pickoneRecord.classList.add("pickoneDesign");

  for (let i = 0; i < livemessage.pickone.length; i++) {
    let dialogueList = document.createElement("li");
    dialogueList.setAttribute("after_Chat", livemessage.pickone[i].afterChatNum);
    dialogueList.innerText = livemessage.pickone[i].content;
    dialogueList.addEventListener("click", function (event) {
      let afterChatNum = event.target.getAttribute("after_Chat");
      chat = findMessageInJsonById(collectjson, afterChatNum);
      setTimeout(function () {
        selectOption(collectjson, dialogueList.innerText, chat);
      }, 800);
    });
    pickoneRecord.appendChild(dialogueList);
    pickoneBox.appendChild(pickoneRecord);
  }
  botFrame.appendChild(pickoneBox);
}
function findMessageInJsonById(questions, id) {
  let allChats = questions;

  for (var i = 0; allChats.length > i; i++)
    if (allChats[i].id == id) return allChats[i];
}
function beforeChat(level, dialogueFrame = null) {
  if (level == "show")
    dialogueFrame.innerHTML =
    "<li class='chatLoading' id='chatLoading'><span></span><span></span><span></span></li>";
  else document.getElementById("chatLoading").remove();
}
function selectOption(questions, chat, laterQuery = null) {
  let choices = document.getElementById("pickone");
  choices.remove();
  let botFrame = document.getElementById("botFramestyle");
  let dialogueList = document.createElement("li");
  dialogueList.classList.add("user");
  let divItem = document.createElement("div");
  divItem.classList.add("content");
  divItem.innerText = chat;
  dialogueList.appendChild(divItem);
  botFrame.appendChild(dialogueList);
  if (laterQuery) {
    compileLivechat(questions, laterQuery)
  }
}
function compileLivechat(questions, chat) {
  let botFrame = document.getElementById("botFramestyle");
  let dialogueList = document.createElement("li");
  dialogueList.classList.add("bot");
  let divItem = document.createElement("div");
  divItem.classList.add("content");
  divItem.innerText = chat.content;
  dialogueList.appendChild(divItem);
  botFrame.appendChild(dialogueList);

  if (chat.afterChatNum) {
    let newMessage = findMessageInJsonById(questions, chat.afterChatNum);
    setTimeout(function () {
      compileLivechat(questions, newMessage)
    }, 1200);
  } else if (chat.pickone) {
    pick(questions, chat);
  }
}
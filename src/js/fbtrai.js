
function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSubject() {
  return "Seeking explanation for non-receipt of TRAI's message";
  return pickOne([
    pickOne(["Re:", "Regarding the", "On the", "About the", "Sub:", "Response:", "In reply to the"]) +" "+
    pickOne(["Paper", "paper", "Consultation Paper", "proposal", "publication"])+" "+
    pickOne(["about", "on", "concerned with", "regarding"])+" "+
    pickOne(["regulation of OTTs", "Breaking net neutrality", "regulation of On-The-Top services"])
    ,
    pickOne(["Stop ","Desist ","Disallow ","Hold back ","Don't permit ","Disapprove "]) +
    pickOne(["operators", "ISPs", "TSPs", "telecom service providers","telecom operators", "internet service providers"])+
    " from " +
    pickOne(["breaking ", "violating ", "destroying ", "beraching ","tampering with ", "disrupting ","disregarding ", "meddling ","encroaching ","defying ","trampling on "]) +
    pickOne(["Net Neutrality", "the open internet", "the internet", "the equally open Internet", "the equally accessible Internet"])
    ]);
}
var toAddress = "ankhi@fb.com, advisorfea1@trai.gov.in, fb-trai@email.savetheinternet.in";
var ccAddress = "advisorfea1@trai.gov.in";

// Don't give me that look. I know this is horrible. But limits ok! - https://support.google.com/a/answer/1366776?hl=en
// Out of rotation: "netneutrality62@gmail.com"
// Warning: there are no #32 & #42. Someone else owns that address. Don't add it here.
var bccAddresses = ["fb-trai@email.savetheinternet.in"];
var bccAddress = pickOne(bccAddresses);

//        ZeroClipboard.setMoviePath('swf/ZeroClipboard.swf');

var subject = getSubject();
$(function () {
  initAnswers();
  styleEm();

  $("#responseTextarea,#responseSubject").focus(function(e) {
    $(this).select();
  });

  $("#responseTextarea,#responseSubject").click(function(e) {
    $(this).select();
  });

  initListeners();

  $('.chooseAnswers').click(function(e) {
    $('.navBarSend').toggle();
    e.preventDefault();
    initListeners();
    window.location.hash = '#collapseContainer';
  });
});

function selectOneAnswer(arr) {
  $(pickOne(arr)).removeClass("hidden skip");
}

function initAnswers() {
    $('.answer').addClass("hidden skip");
    var qs = $('.question');
    for (var i = 0; i < qs.length; i++) {
      var answers = [];
      if(i!=qs.length-1) {
        answers = $(qs[i]).nextUntil(qs[i+1]);
      }
      else {
          answers = $(qs[i]).nextAll();
      }
      selectOneAnswer(answers);
    };
}

function initListeners() {

  var IEMobile = /IEMobile/i.test(navigator.userAgent);
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) && !IEMobile;

  $('#bccAddressModal,.bccAddressModal').html(bccAddress);

  if(isMobile) {
    $('.sendResponse, .sendResponseAuto').click(function() {
      sendEmailMobile();
      $('#submitModal').modal('show');
    });
  }
  else {
    if(IEMobile) $('.copy-short').hide();

    $(".sendResponse, .sendResponseAuto").click(showSendModal);
    $("#responseTextarea").bind("copy", onCopyComplete);
    $("#copyBtn").click(onCopyComplete);

    $("#sendModal a").click(function () {
      $("#sendModal").modal("hide");
      $("#submitModal").modal("show");
    });

    $("#otherSend").attr("href", "mailto:"+encodeURIComponent(toAddress)+"?subject="+encodeURIComponent(subject)+"&bcc="+encodeURIComponent(bccAddress));
    if(IEMobile) {
      $('#gmailSend, #yahooSend').hide();
      $('#otherSend').text('Send')
    }
    else {
      $("#gmailSend").attr("href", "https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to="+encodeURIComponent(toAddress)+"&bcc="+encodeURIComponent(bccAddress)+"&su="+encodeURIComponent(subject));
      $("#yahooSend").attr("href", "http://compose.mail.yahoo.com/?Subject="+encodeURIComponent(subject)+"&To="+encodeURIComponent(toAddress)+"&Bcc="+encodeURIComponent(bccAddress));
    }
  }
}

function showSendModal() {
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  var response = generateResponse(true);

  $("#sendModal").modal("show");
  $('#responseSubject').val(subject);
  $('#responseTextarea').val(response);

  if(isMac) $(".control-str").html("Cmd");

  $("#copyBtn").parent().hide();
  $("#response-copied").hide();

  setTimeout(function() {
    $('#responseTextarea').focus();
    $("#copyBtn").parent().show();
  }, 1000);
}

function onCopyComplete () {
      $("#response-copied").show();
      $("#copyBtn").parent().hide();
}

function styleEm() {
  $(".answer").prop("contenteditable", true).focus(function () {
    $(this).addClass("focused");
  }).blur(function () {
    $(this).removeClass("focused");
  });

}

function sendEmailMobile() {
  var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
  var body = generateResponse()
  if(iOS) {
      /* I'm guessing encodeURIComponent works differently with line breaks on iOS? */
      body = body.replace("\n","%0D%0A");
  }

  window.location.href = "mailto:"+ encodeURIComponent(toAddress) +"?subject="+encodeURIComponent(subject)+"&bcc="+encodeURIComponent(bccAddress)+"&body="+body;
}

function generateResponse(forClipboard) {
  var nLine = "\r\n";
  var text = "";
  var container=$('#responseContainer').children("div").each(function (i, p) {
    var $p = $(p), val;
    if($p.hasClass('question')) {
      text = text + nLine+nLine;
    }
    if(!$p.hasClass('skip')) {
      var t =  $(p).text().split('\n');
      var tt = [];
      for(i=0;i<t.length;i++) if(t[i] = t[i].replace(/^\s+|\s+$/g, ''))tt.push(t[i]);

      text += tt.join(nLine+nLine) + nLine+nLine;
    }
  });
  return forClipboard? text: encodeURIComponent(text);
}

loadSocialIcons();
function loadSocialIcons() {
  Socialite.load($('.social-buttons'));
}
var uc = /UCBrowser/g.test( navigator.userAgent );
var uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
if(uc) $('.browser_name').text('UC Browser');
if(uc || uiwebview)$('#browser_warning').removeClass('hidden');
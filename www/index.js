// require(peerjs);
// require(jquery);

"use strict";

var peer, conn;

function init(){
	$("button#create-channel").click(onClickCreateChannel);
	$("button#connect-to-peer").click(onClickConnectToPeer);
	$("button#change-color").click(onClickChangeColor);
}

// ---------------------------------------
// UI Event Handlers



function onClickConnectToPeer(){
	connectToPeer($("#peer-id").val());
}

function onClickCreateChannel(){
	createConnection();
}

function onClickChangeColor(){
	let color = generateColor();
	$("body").css({
		background: color
	});
	sendPeerData({color});
}


// ---------------------------------------
// Peer Event Handlers


function onOpenConnection(myId){
	$("#my-id").val(myId);
}

function onPeerConnect(_conn){
	conn = _conn;
	conn.on("data", onPeerData);
	$("button#change-color").show();
}

function onPeerData(data){
	console.log(data)
	$("body").css({
		background: data.color
	})
}

function sendPeerData(dataObj){
	console.log(conn)
	conn.send(dataObj);
}


// ---------------------------------------
// Connection setup


function createConnection(peerId){

	peer = new Peer({key: '61a9bdwxzfzjjor'});
	if (!peerId){
		// first one on the page
		// wait to be given a channel ID
		peer.on('open', onOpenConnection);
		// wait for a connection
		peer.on("connection", onPeerConnect)
	} else {
		// wait to be given a channel ID
		peer.on('open', function(myId){
			onOpenConnection(myId)
			// then try to connect to the peer again
			connectToPeer(peerId);
		});
	}
}

function connectToPeer(peerId){
	if (!peer) {
		// have to create a connection first
		// by passing a peerId it tells create connection to retry once a channel is open
		createConnection(peerId);
		return;
	}
	conn = peer.connect(peerId);
	conn.on("data", onPeerData);
}


// ---------------------------------------
// App functions

function generateColor(){
	let r = Math.round(Math.random() * 255);
	let g = Math.round(Math.random() * 255);
	let b = Math.round(Math.random() * 255);
	return `rgb(${r}, ${g}, ${b})`;
}

init();
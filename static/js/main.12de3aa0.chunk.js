(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{160:function(e,t,a){e.exports=a.p+"static/media/logo.ac288ddb.svg"},166:function(e,t,a){e.exports=a(389)},171:function(e,t,a){},247:function(e,t,a){},389:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(27),o=a.n(s),i=(a(171),a(16)),l=a(17),c=a(19),u=a(18),m=a(20),d=a(38),h=a.n(d),f=(a(244),a(247),a(160)),p=a.n(f),g=a(22),v=a.n(g),y=a(162),R=a.n(y),E=a(32),w=a.n(E),D={layout:{},textField:{margin:"5px"}},b=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleCreateRoom=function(){a.state.nickName?a.props.onCreateRoom?a.props.onCreateRoom(a.state.roomName.toUpperCase(),a.state.nickName):console.log("Component was not given a create room handler."):window.alert("No nickname entered.")},a.handleJoinRoom=function(){a.state.nickName?a.state.roomName?a.props.onJoinRoom?a.props.onJoinRoom(a.state.roomName.toUpperCase(),a.state.nickName):console.log("Component was not given a join room handler."):window.alert("No room name entered."):window.alert("No nickname entered.")},a.state={roomName:"",nickName:""},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:D.layout},r.a.createElement("img",{src:p.a,className:"App-logo",alt:"logo"}),r.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},r.a.createElement(w.a,{label:"Room Name",value:this.state.roomName,onChange:function(t){return e.setState({roomName:t.target.value})},style:D.textField}),r.a.createElement(w.a,{required:!0,label:"Nickname",value:this.state.nickName,onChange:function(t){return e.setState({nickName:t.target.value})},style:D.textField}),r.a.createElement("div",{style:{display:"flex",flexDirection:"row"}},r.a.createElement(v.a,{variant:"contained",onClick:this.handleCreateRoom,style:{flex:"1 1 auto",margin:"5px"}},"Create Room"),r.a.createElement(v.a,{variant:"contained",onClick:this.handleJoinRoom,style:{flex:"1 1 auto",margin:"5px"}},"Join Room")),r.a.createElement(R.a,{href:"https://github.com/Subtlemon/ChalkChain",variant:"body1"},"View Source on Github")))}}]),t}(n.Component),C=a(26),k=a.n(C),I=a(103),x=a.n(I),S=a(105),j=a.n(S),O=a(163),N=a.n(O),P=a(106),M=a.n(P),T=a(6),L=a.n(T),W=a(10),V=a.n(W),G=a(104),U=a.n(G),A={layout:{},paper:{padding:"30px",margin:"10px"},divider:{margin:"10px"},settingsContainer:{display:"flex",flexDirection:"column"},settingsRow:{marginBottom:"10px"},textField:{marginLeft:"5px",marginRight:"5px"}},F=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.userRef=a.state.roomRef.child("users"),a.userRef.on("value",function(e){e.val()&&a.setState({users:e.val()})}),a.sharedRef=a.state.roomRef.child("waitingState"),a.sharedRef.on("value",function(e){e.val()&&a.setState({sharedState:e.val()})})},a.handleSaveButton=function(e){a.sharedRef.set(a.state.sharedState)},a.handleStartButton=function(e){if(a.state.users){var t=Object.keys(a.state.users),n=t.length;if(!(n<2)){var r={};r[t[0]]={prev:t[n-1]};for(var s=1;s<n;++s)r[t[s]]={prev:t[s-1]},r[t[s-1]].next=t[s];return r[t[n-1]].next=t[0],a.state.roomRef.child("game").transaction(function(e){return null===e?{settings:Object.assign(a.state.sharedState,{order:r,players:a.state.users})}:void 0},function(e,t,a){e?window.alert("Error: "+e):t?console.log("Game started successfully."):window.alert("Game is already started.")})}window.alert("Can't start game with less than 2 players.")}else window.alert("Internal Error: No users found.")},a.getUserListItems=function(){return a.state.users&&Object.keys(a.state.users).length?Object.keys(a.state.users).map(function(e,t){return r.a.createElement(j.a,{key:e},r.a.createElement(N.a,null,r.a.createElement(U.a,null)),r.a.createElement(M.a,{primary:a.state.users[e].nickName,primaryTypographyProps:{variant:"h6"}}))}).reduce(function(e,t){return[e,r.a.createElement(k.a,{key:e+"div"}),t]}):r.a.createElement(j.a,null,r.a.createElement(M.a,{primary:"You've somehow entered a ghost room. It's probably in your best interest to leave."}))},a.state={users:[],sharedState:{drawTime:60}},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentWillUnmount",value:function(){this.userRef.off("value"),this.sharedRef.off("value")}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:A.layout},r.a.createElement(L.a,{style:A.paper},r.a.createElement(V.a,{variant:"h4"},"Room Name: ",r.a.createElement("b",null,this.state.roomName)),r.a.createElement(V.a,{variant:"subtitle1"},"Ask your friends to join using the above room name!"),r.a.createElement(k.a,{variant:"middle",style:A.divider}),r.a.createElement("div",{style:A.settingsContainer},r.a.createElement("div",{style:A.settingsRow},r.a.createElement(w.a,{label:"Round Theme (unused)",value:this.state.sharedState.theme||"",onChange:function(t){return e.setState({sharedState:{theme:t.target.value}})},style:A.textField}),r.a.createElement(w.a,{required:!0,label:"Seconds per drawing",type:"number",value:this.state.sharedState.drawTime,onChange:function(t){return e.setState({sharedState:{drawTime:t.target.value}})},style:A.textField})),r.a.createElement(v.a,{variant:"contained",onClick:this.handleSaveButton},"Save Settings"))),r.a.createElement(L.a,{style:A.paper},r.a.createElement(V.a,{variant:"h5"},"Lobby"),r.a.createElement(x.a,null,this.getUserListItems()),r.a.createElement(v.a,{variant:"contained",onClick:this.handleStartButton},"Start Game")))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{roomRef:e.roomRef,roomName:e.roomName,userID:e.userID}}}]),t}(n.Component),B=a(74),J=a(164),_=a.n(J),Y=a(54),H=a.n(Y),q=a(165),z=a.n(q),K={canvas:{position:"absolute",height:"100%",width:"100%",top:"0",left:"0"},canvasContainer:{position:"relative",paddingTop:"100%",width:"100%",maxHeight:"500px",maxWidth:"500px"},divider:{margin:"10px"},toolbar:{display:"grid",gridTemplateColumns:"auto auto",gridColumnGap:"10px"},colours:{justifySelf:"center",display:"grid",gridColumnGap:"5px",gridRowGap:"5px",gridTemplateColumns:"40px 40px 40px 40px 40px",gridTemplateRows:"40px 40px"},svg:{height:"100%",width:"100%"},misc:{justifySelf:"center",display:"grid",gridColumnGap:"5px",gridRowGap:"5px",gridTemplateColumns:"40px 40px",gridTemplateRows:"40px 40px"}},X=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleMouseDown=function(e){var t=a.getCursorPosition(e),n=Object(B.a)(t,2),r=n[0],s=n[1];a.drawCircle(r,s),a.ctx.beginPath(),a.ctx.moveTo(r,s),a.setState({penDown:!0})},a.handleMouseUp=function(e){if(a.state.penDown){a.ctx.closePath();var t=a.getCursorPosition(e),n=Object(B.a)(t,2),r=n[0],s=n[1];a.drawCircle(r,s)}a.setState({penDown:!1})},a.handleMouseMove=function(e){if(a.state.penDown){var t=a.getCursorPosition(e),n=Object(B.a)(t,2),r=n[0],s=n[1];a.ctx.lineTo(r,s),a.ctx.stroke()}},a.handleTouchStart=function(e){e.touches.length&&a.handleMouseDown(e.touches[0])},a.handleTouchEnd=function(e){e.touches.length&&a.handleMouseUp(e.touches[0])},a.handleTouchMove=function(e){e.touches.length&&(e.preventDefault(),console.log("preventing default?"),a.handleMouseMove(e.touches[0]))},a.getCursorPosition=function(e,t){var n=a.refs.canvas.getBoundingClientRect();return[e.clientX-n.left,e.clientY-n.top]},a.drawCircle=function(e,t){a.ctx.beginPath(),a.ctx.arc(e,t,a.state.radius,0,2*Math.PI),a.ctx.fill(),a.ctx.closePath()},a.clearscreen=function(){a.ctx.fillRect(0,0,a.refs.canvas.width,a.refs.canvas.height)},a.handleNewRadius=function(e){a.setState({radius:e})},a.handleColour=function(e){a.setState({colour:e.target.style.backgroundColor})},a.state={colour:"black",radius:3},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this.refs.canvas;this.ctx=e.getContext("2d");var t=e.getBoundingClientRect();e.width=t.width,e.height=t.height,this.ctx.fillStyle="white",this.clearscreen(),this.ctx.fillStyle=this.state.colour,e.ontouchmove=this.handleTouchMove}},{key:"componentDidUpdate",value:function(){this.ctx.fillStyle=this.state.colour,this.ctx.strokeStyle=this.state.colour,this.ctx.lineWidth=2*this.state.radius}},{key:"componentWillUnmount",value:function(){delete this.ctx}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(L.a,{style:K.canvasContainer},r.a.createElement("canvas",{ref:"canvas",onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,onMouseMove:this.handleMouseMove,onTouchStart:this.handleTouchStart,onTouchEnd:this.handleTouchEnd,style:K.canvas})),r.a.createElement(k.a,{style:K.divider}),r.a.createElement("div",{style:K.toolbar},r.a.createElement("div",{style:K.colours},r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"black"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"red"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"blue"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"green"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"yellow"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"white"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"aqua"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"fuchsia"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"brown"}}),r.a.createElement(L.a,{onClick:this.handleColour,style:{backgroundColor:"lime"}})),r.a.createElement("div",{style:K.misc},r.a.createElement(H.a,{title:"Small Brush",placement:"top"},r.a.createElement(L.a,{onClick:this.handleNewRadius.bind(this,1)},r.a.createElement("svg",{style:K.svg},r.a.createElement("circle",{cx:"20",cy:"20",r:"5",fill:"black"})))),r.a.createElement(H.a,{title:"Medium Brush",placement:"top"},r.a.createElement(L.a,{onClick:this.handleNewRadius.bind(this,3)},r.a.createElement("svg",{style:K.svg},r.a.createElement("circle",{cx:"20",cy:"20",r:"10",fill:"black"})))),r.a.createElement(H.a,{title:"Large Brush",placement:"bottom"},r.a.createElement(L.a,{onClick:this.handleNewRadius.bind(this,15)},r.a.createElement("svg",{style:K.svg},r.a.createElement("circle",{cx:"20",cy:"20",r:"15",fill:"black"})))),r.a.createElement(H.a,{title:"Fill Screen",placement:"bottom"},r.a.createElement(_.a,{onClick:this.clearscreen},r.a.createElement(z.a,null))))))}}]),t}(n.Component),Q={layout:{},paper:{padding:"20px"},divider:{margin:"10px"}},$=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.progressPresenseRef=a.state.progressRef.child(a.state.chainID),a.progressPresenseRef.onDisconnect().remove(),a.progressPresenseRef.set(!1),a.setState({ready:!1,timer:a.state.drawTime}),a.intervalID=setInterval(function(){a.setState({timer:a.state.timer-1}),a.state.timer<=0&&(clearInterval(a.intervalID),a.state.ready||a.handleConfirmDrawing())},1e3)},a.componentWillUnmount=function(){a.intervalID&&clearInterval(a.intervalID),delete a.chainRef},a.handleConfirmDrawing=function(e){a.chainRef?a.chainRef.update({image:a.refs.drawing.refs.canvas.toDataURL()}):(a.chainRef=a.state.gameRef.child("chains").child(a.state.chainID).push(),a.chainRef.set({image:a.refs.drawing.refs.canvas.toDataURL(),userID:a.state.userID})),a.state.ready||(a.progressPresenseRef.remove().then(function(){a.progressPresenseRef.onDisconnect().cancel(),delete a.progressPresenseRef}),a.setState({ready:!0}))},a.state={timer:60},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:Q.layout},r.a.createElement(L.a,{style:Q.paper},r.a.createElement(V.a,{variant:"h6"},"You are drawing ",r.a.createElement("b",null,this.state.players[this.state.data.userID].nickName),"'s word:"),r.a.createElement(V.a,{variant:"h5"},r.a.createElement("b",null,this.state.data.word))),r.a.createElement(k.a,{style:Q.divider}),r.a.createElement(X,{ref:"drawing"}),r.a.createElement(k.a,{style:Q.divider}),r.a.createElement(L.a,{style:Q.paper},r.a.createElement(V.a,{variant:"h6"},this.state.timer?this.state.timer+"s remaining":""),r.a.createElement(v.a,{variant:"contained",onClick:this.handleConfirmDrawing},this.state.ready?"Update Drawing":"Finished Drawing")))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.gameRef,progressRef:e.progressRef,players:e.players,drawTime:e.drawTime,userID:e.userID,chainID:e.chainID,data:e.data}}}]),t}(n.Component),Z={layout:{},paper:{padding:"20px"},divider:{margin:"10px"}},ee=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.progressPresenseRef=a.state.progressRef.child(a.state.chainID),a.progressPresenseRef.onDisconnect().remove(),a.progressPresenseRef.set(!1),a.setState({ready:!1})},a.componentWillUnount=function(){delete a.chainRef},a.handleConfirmGuess=function(e){a.state.guess?(a.chainRef?a.chainRef.update({word:a.state.guess}):(a.chainRef=a.state.gameRef.child("chains").child(a.state.chainID).push(),a.chainRef.set({word:a.state.guess,userID:a.state.userID})),a.state.ready||(a.progressPresenseRef.remove().then(function(){a.progressPresenseRef.onDisconnect().cancel(),delete a.progressPresenseRef}),a.setState({ready:!0}))):window.alert("You didn't guess anything")},a.state={ready:!1,guess:""},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:Z.layout},r.a.createElement(L.a,{style:Z.paper},r.a.createElement(V.a,{variant:"h6"},"You are guessing ",r.a.createElement("b",null,this.state.players[this.state.data.userID].nickName),"'s image:")),r.a.createElement(k.a,{style:Z.divider}),r.a.createElement(L.a,null,r.a.createElement("img",{ref:"img",alt:"guess",src:this.state.data.image})),r.a.createElement(k.a,{style:Z.divider}),r.a.createElement(L.a,{style:Z.paper},r.a.createElement(w.a,{label:"What do you see?",value:this.state.guess,onChange:function(t){return e.setState({guess:t.target.value})}}),r.a.createElement(v.a,{variant:"contained",onClick:this.handleConfirmGuess},this.state.ready?"Guess Again":"Guess")))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.gameRef,progressRef:e.progressRef,players:e.players,chainID:e.chainID,userID:e.userID,data:e.data}}}]),t}(n.Component),te={layout:{},paper:{padding:"20px"}},ae=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidUpdate=function(e){e.chainID!==a.props.chainID&&a.updateChainLinkData()},a.componentDidMount=function(){a.updateChainLinkData()},a.updateChainLinkData=function(){a.state.gameRef.child("chains").child(a.state.chainID).limitToLast(1).once("child_added",function(e){e.val()&&a.setState({chainLinkData:e.val()})})},a.getMainComponent=function(){return a.state.chainLinkData&&a.state.chainLinkData.image?r.a.createElement(ee,{gameRef:a.state.gameRef,progressRef:a.state.progressRef,players:a.state.settings.players,chainID:a.state.chainID,userID:a.state.userID,data:a.state.chainLinkData}):a.state.chainLinkData&&a.state.chainLinkData.word?r.a.createElement($,{gameRef:a.state.gameRef,progressRef:a.state.progressRef,players:a.state.settings.players,drawTime:a.state.settings.drawTime,chainID:a.state.chainID,userID:a.state.userID,data:a.state.chainLinkData}):r.a.createElement(L.a,{style:te.paper},r.a.createElement(V.a,{variant:"h5"},"Loading game phase..."))},a.state={ready:!1},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:te.layout},this.getMainComponent())}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.gameRef,progressRef:e.progressRef,settings:e.settings,chainID:e.chainID,userID:e.userID}}}]),t}(n.Component),ne={layout:{}},re=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).getMainComponent=function(){return a.state.data.word?r.a.createElement(V.a,{variant:"subtitle1"},r.a.createElement("b",null,a.state.players[a.state.data.userID].nickName)," guessed: ",r.a.createElement("b",null,a.state.data.word)):[r.a.createElement(V.a,{variant:"subtitle1"},r.a.createElement("b",null,a.state.players[a.state.data.userID].nickName)," drew this:"),r.a.createElement("img",{src:a.state.data.image,alt:"Broken Image, Sorry!"})]},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:ne.layout},this.getMainComponent())}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{data:e.data,players:e.players}}}]),t}(n.Component),se={layout:{},chainContainer:{},divider:{margin:"10px"},paper:{padding:"20px",margin:"10px"},headerContainer:{maxWidth:"500px"}},oe=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.sharedRef=a.state.gameRef.child("spectateState"),a.sharedRef.on("value",function(e){e.val()&&a.setState({synced:!0,sharedState:e.val()})}),a.state.gameRef.child("chains").once("value").then(function(e){if(e.val()){var t={};e.forEach(function(e){var a=[];e.forEach(function(e){a.push(e.val())}),t[e.key]=a}),a.setState({chains:t})}})},a.handleStartSync=function(e){a.sharedRef.set({chainID:a.state.userID})},a.handleNext=function(e){var t=Object.keys(a.state.chains),n=t.indexOf(a.state.sharedState.chainID)+1;n>=t.length&&(n=0),a.sharedRef.set({chainID:t[n]})},a.handlePrevious=function(e){var t=Object.keys(a.state.chains),n=t.indexOf(a.state.sharedState.chainID);0===n&&(n=t.length),a.sharedRef.set({chainID:t[n-1]})},a.handleLeave=function(e){a.props.onLeave?a.props.onLeave():console.log("No onLeave handler found.")},a.getChainItems=function(e){return[r.a.createElement(V.a,{variant:"h6"},"The original word was: ",r.a.createElement("b",null,a.state.chains[e][0].word)),r.a.createElement(k.a,{style:se.divider}),a.state.chains[e].slice(1).map(function(e){return r.a.createElement(re,{data:e,players:a.state.players})})]},a.getMainComponent=function(){if(a.state.chains){var e=a.state.userID;return a.state.sharedState&&a.state.sharedState.chainID&&(e=a.state.sharedState.chainID),r.a.createElement("div",{style:se.chainContainer},a.getChainItems(e))}return r.a.createElement(V.a,null,"Loading results...")},a.getHeader=function(){return a.state.synced?r.a.createElement("div",null,r.a.createElement(V.a,{variant:"h5"},"Reviewing Results"),r.a.createElement(V.a,{variant:"subtitle1"},"Let's see the results with everyone!"),r.a.createElement(v.a,{variant:"contained",onClick:a.handlePrevious,style:{margin:"5px"}},"Previous Chain"),r.a.createElement(v.a,{variant:"contained",onClick:a.handleNext,style:{margin:"5px"}},"Next Chain")):r.a.createElement("div",{style:se.headerContainer},r.a.createElement(V.a,{variant:"h5"},"Your Chain"),r.a.createElement(V.a,{variant:"subtitle1"},"Take a sneak peak at how your chalk chain turned out, then join everyone else in reviewing their results!"),r.a.createElement(v.a,{variant:"contained",onClick:a.handleStartSync},"Review Results"))},a.state={synced:!1},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:se.layout},r.a.createElement(L.a,{style:se.paper},this.getHeader()),r.a.createElement(L.a,{style:se.paper},this.getMainComponent(),r.a.createElement(k.a,{style:se.divider}),r.a.createElement(v.a,{variant:"contained",onClick:this.handleLeave},"Back to Waiting Room")))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.gameRef,players:e.players,userID:e.userID}}}]),t}(n.Component),ie={layout:{},paper:{padding:"20px"}},le=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.progressPresenseRef=a.state.progressRef.child(a.state.chainID),a.progressPresenseRef.onDisconnect().remove(),a.progressPresenseRef.set(!1),a.setState({ready:!1})},a.componentWillUnmount=function(){delete a.chainRef},a.handleConfirmWord=function(e){a.state.word?(a.chainRef?a.chainRef.update({word:a.state.word}):(a.chainRef=a.state.gameRef.child("chains").child(a.state.chainID).push(),a.chainRef.set({word:a.state.word,userID:a.state.chainID})),a.state.ready||(a.progressPresenseRef.remove().then(function(){a.progressPresenseRef.onDisconnect().cancel(),delete a.progressPresenseRef}),a.setState({ready:!0}))):window.alert("Please enter a word for people to draw")},a.state={ready:!1,word:""},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:ie.layout},r.a.createElement(L.a,{style:ie.paper},r.a.createElement(V.a,{variant:"h6"},"You are selecting a word for: ",r.a.createElement("b",null,this.state.prevNick)),r.a.createElement(w.a,{label:"Your word",value:this.state.word,onChange:function(t){return e.setState({word:t.target.value})}}),r.a.createElement(v.a,{variant:"contained",onClick:this.handleConfirmWord},this.state.ready?"Reconfirm":"Confirm")))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.gameRef,progressRef:e.progressRef,chainID:e.chainID,prevNick:e.players[e.prevID].nickName,users:e.players}}}]),t}(n.Component),ce={layout:{}},ue=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).componentDidMount=function(){a.presenseRef=a.state.gameRef.child("activePlayers").child(a.state.userID),a.presenseRef.onDisconnect().remove(),a.presenseRef.set(a.state.userID),a.progressRef=a.state.gameRef.child("notReady"),a.progressRef.on("value",function(e){e.val()||a.progressGame()}),a.setState({mainView:"START_VIEW",chainID:a.state.userID})},a.componentWillUnmount=function(){a.progressRef.off(),delete a.progressRef,a.presenseRef.remove().then(function(){a.presenseRef.onDisconnect().cancel(),delete a.presenseRef}),a.state.gameRef.child("settings").child("players").child(a.state.userID).remove()},a.progressGame=function(){var e=a.state.settings.order[a.state.chainID].next;e===a.state.userID?a.setState({mainView:"SPECTATE_VIEW"}):a.setState({mainView:"GAME_PHASE_VIEW",chainID:e})},a.getMainComponent=function(){return"GAME_PHASE_VIEW"===a.state.mainView?r.a.createElement(ae,{gameRef:a.state.gameRef,progressRef:a.state.gameRef.child("notReady"),settings:a.state.settings,chainID:a.state.chainID,userID:a.state.userID}):"SPECTATE_VIEW"===a.state.mainView?r.a.createElement(oe,{gameRef:a.state.gameRef,players:a.state.settings.players,userID:a.state.userID,onLeave:a.props.onLeave}):r.a.createElement(le,{gameRef:a.state.gameRef,progressRef:a.state.gameRef.child("notReady"),chainID:a.state.userID,prevID:a.state.settings.order[a.state.userID].prev,players:a.state.settings.players})},a.state={mainView:"START_VIEW"},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{style:ce.layout},this.getMainComponent())}}],[{key:"getDerivedStateFromProps",value:function(e,t){return{gameRef:e.viewProps.gameRef,settings:e.viewProps.settings,userID:e.userID}}}]),t}(n.Component),me=function(e){function t(e){var a;Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleCreateRoom=function(e,t){e?a.joinIfNotExist(e,t,a.onJoinedRoom,function(e){window.alert("Failed to join room: "+e)},function(){window.alert("Room already exists with that name.")}):a.createRandomRoom(t,a.onJoinedRoom,function(e){window.alert("Failed to join room: "+e)})},a.handleJoinRoom=function(e,t){a.joinIfExist(e,t,a.onJoinedRoom,void 0,function(){window.alert("No room found with that name.")})},a.createRandomRoom=function(e,t,n){a.joinIfNotExist(a.randomName(),e,t,n,a.createRandomRoom)},a.joinIfNotExist=function(e,t,a,n,r){var s="/rooms/"+e;return h.a.database().ref(s).transaction(function(e){return null===e?{users:null}:void console.log("Room already exists.")},function(o,i,l){if(o)n(o);else if(i){var c=h.a.database().ref(s+"/users").push();c.onDisconnect().remove(),c.set({nickName:t}).then(function(){return a(e,c.key)})}else r&&r(t,a,n)})},a.joinIfExist=function(e,t,a,n,r){h.a.database().ref("/rooms").once("value",function(n){if(n.hasChild(e)){var s=h.a.database().ref("/rooms/"+e+"/users").push();s.onDisconnect().remove(),s.set({nickName:t}).then(function(){return a(e,s.key)})}else r()})},a.onJoinedRoom=function(e,t){var n=h.a.database().ref("/rooms/"+e+"/game");a.setState({mainView:"ROOM_VIEW",viewProps:{},roomName:e,userID:t}),n.on("value",function(e){var n=e.val();n&&n.settings&&n.settings.players&&n.settings.players[t]&&(a.setState({mainView:"GAME_VIEW",viewProps:{settings:n.settings,gameRef:e.ref}}),e.ref.off("value"))})},a.randomName=function(){var e=new Uint8Array(3);return window.crypto.getRandomValues(e),Array.from(e,function(e){return("0"+e.toString(16)).substr(-2)}).join("").toUpperCase()},a.handleLeaveGame=function(){a.onJoinedRoom(a.state.roomName,a.state.userID)},a.getMainComponent=function(){return"ROOM_VIEW"===a.state.mainView?r.a.createElement(F,{viewProps:a.state.viewProps,roomName:a.state.roomName,userID:a.state.userID,roomRef:h.a.database().ref("/rooms/"+a.state.roomName)}):"GAME_VIEW"===a.state.mainView?r.a.createElement(ue,{viewProps:a.state.viewProps,userID:a.state.userID,onLeave:a.handleLeaveGame}):r.a.createElement(b,{onJoinRoom:a.handleJoinRoom,onCreateRoom:a.handleCreateRoom})};return h.a.initializeApp({apiKey:"AIzaSyClKxVy0DcO8fSDemWvGIBgolbfDgX3jQo",authDomain:"chalkchain.firebaseapp.com",databaseURL:"https://chalkchain.firebaseio.com",projectId:"chalkchain",storageBucket:"chalkchain.appspot.com",messagingSenderId:"654172560168"}),a.state={mainView:"ENTRY_VIEW"},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},this.getMainComponent()))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(me,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[166,1,2]]]);
//# sourceMappingURL=main.12de3aa0.chunk.js.map
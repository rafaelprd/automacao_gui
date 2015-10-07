/*!
 * Interface gráfica para automação residencial
 *
 * Rafael Prado
 * Data: 06/10/2015
 */
 
/**
 * 
 **/
function Objeto(nome,x,y,w,h,img) {
	this.id = 0;
	this.nome = nome || "Objeto";
	this.tag = nome;
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
	this.nomePos = {x:this.x,y:this.y}
	this.fillStyle = "white";
	this.fillNameStyle = "white";
	this.font = "18px SketchBlock";
	this.estado = false;
	this.estadoArray = [];
	
	this.selecionavel = false;
	this.exibeSelecao = false;
	
	this.exibeNome = false;
	
	this.tipoInterruptor;
	this.interruptor;
	
	this.onclick = function() {};
	
}
Objeto.prototype.addState = function(e, i) {
	this.w = i.width;
	this.h = i.height;
	this.estadoArray.push({ estado:e , img:i });
}
Objeto.prototype.getImageState = function(e) {
	for(var i=0; i<this.estadoArray.length; i++) {
		if( this.estadoArray[i].estado == e )
			return this.estadoArray[i].img;
	}
	
	return null;
}
Objeto.prototype.isInside = function(x,y) {
	  return  (this.x <= x) && (this.x + this.w >= x) &&
          (this.y <= y) && (this.y + this.h >= y);
}
Objeto.prototype.draw = function(ctx) {
	var img = this.getImageState( this.estado );
	
	if( this.exibeNome ) {				
		ctx.fillStyle = "white"
		ctx.font = this.font;
		//console.log(s.nomePos.x+","+s.nomePos.y)
		ctx.fillText(this.nome,this.nomePos.x,this.nomePos.y);
	}
	
	if(img)
		ctx.drawImage(img,this.x,this.y,this.w,this.h);
	
}
Objeto.prototype.setEstado = function(estado) {
	this.estado = estado;
}



/**
 *
 **/
function InterruptorOnOff() {
	Objeto.call(this);
	
	this.ligadoEm = [];
	
	this.selecionavel = true;
	
	this.nomePos = {x:0,y:0}
	
	var on	= document.getElementById("switch_on"),
		off = document.getElementById("switch_off");
	
	this.addState(true,on);
	this.addState(false,off);
}
InterruptorOnOff.prototype = Object.create(Objeto.prototype);
InterruptorOnOff.prototype.addObjeto = function(o) {
	this.ligadoEm.push(o);
	
	this.nome = o.nome;
	this.estado = o.estado;
	this.onclick = function() {
		for(var i=0; i<this.ligadoEm.length; i++)
			this.estado = o.onclick(this.ligadoEm[i]);
	}
}



/**
 *
 **/
function Lampada() {
	Objeto.call(this);
	//this.interruptores = [];
	this.addState(true,document.getElementById("lampada_acesa"));
	this.addState(false,document.getElementById("lampada_apagada"));
}
Lampada.prototype = Object.create(Objeto.prototype);
Lampada.prototype.setEstado = function(estado) {
	this.estado = estado;
	if(this.interruptor)
		this.interruptor.estado = estado;
	//if( this.interruptores )
	//	for(var i=0; i<this.interruptores.length; i++)
	//		this.interruptores[i].estado = this.estado;
}



/**
 *
 **/
function Informacao(valor) {
	Objeto.call(this);
	this.valor = valor || "";
	
}
Informacao.prototype = Object.create(Objeto.prototype);
Informacao.prototype.draw = function(ctx) {
	ctx.fillStyle = "white";
	ctx.font = "30px Helvetica"
	ctx.fillText(this.valor,this.x,this.y);
	
	if( this.exibeNome ) {				
		ctx.fillStyle = "white"
		ctx.font = this.font;
		//console.log(s.nomePos.x+","+s.nomePos.y)
		ctx.fillText(this.nome,this.nomePos.x,this.nomePos.y);
	}
}


/**
 *
 **/
function Sensor(tipo) {
	Objeto.call(this);
	this.valor = "0";
	this.estado = true;
	this.informacao = new Informacao();
	this.informacao.nome = this.nome;
	this.informacao.valor = this.valor;
	this.tipo = tipo || 0;
	//* gambis
	this.exibeValor = true;
	if(tipo==1)
		this.exibeValor = false;
	//*/
	
	//*
	switch(this.tipo){
		case 1:
			var img = document.getElementById("sensor_presenca");
			this.addState(true, img);
			this.w = img.width;
			this.h = img.height;
			
			break;
		case 0:
			this.addState(true, document.getElementById("termometro"));
			
			break;
	}
	//console.log(this.estadoArray)
	//*/
	
	
}
Sensor.prototype = Object.create(Objeto.prototype);
Sensor.prototype.draw = function(ctx) {
	var img = this.getImageState( this.estado );
	
	if( this.exibeNome ) {				
		ctx.fillStyle = "white"
		ctx.font = this.font;
		//console.log(s.nomePos.x+","+s.nomePos.y)
		ctx.fillText(this.nome,this.nomePos.x,this.nomePos.y);
	}
	
	if(this.exibeValor) {
		ctx.fillStyle = "white"
		ctx.font = "12px Helvetica";
		ctx.fillText(this.valor,this.x+35,this.y+12);
	}
	
	if(img)
		ctx.drawImage(img,this.x,this.y,this.w,this.h);
	
}
Sensor.prototype.setValor = function(valor) {
	this.valor = valor;
	this.informacao.valor = valor;
}
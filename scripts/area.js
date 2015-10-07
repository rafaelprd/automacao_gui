/*!
 * Interface gráfica para automação residencial
 *
 * Rafael Prado
 * Data: 06/10/2015
 */
 
/**
 *
 **/
function Area(nome, vertices, fill, lineWidth) {
	this.nome = nome;
	this.x = vertices[0].x;
	this.y = vertices[0].y;
	this.nomePos = {x:this.x+6,y:this.y+20}
	this.vertices = vertices;
	this.vx=[];
	this.vy=[];
	this.strokeColor = fill || GUI.stroke_color;
	this.lineWidth = lineWidth || GUI.line_width;
	this.fillStyle = fill || GUI.fill_color;
	this.fillNameStyle = "white";
	
	this.lineDotted = false;
	
	this.font = "18px Helvetica";
	this.id = 0;
	
	// Define se deve preencher o poligono
	this.preencher = true;
	// Quando TRUE => gera o menu com suas informacoes
	this.exibeMenu = true;
	// Permite que o elemento seja capturado pelo clique
	this.selecionavel = true;
	// Define se deve exibir o contorno da marcação
	this.exibeSelecao = true;
	
	this.exibeNome = true;
	
	this.onclick = null;
	
	this.objetos = [];
	
	//this.vx.push(x);
	//this.vy.push(y);
	
	for(var i=0; i<this.vertices.length; i++) {
		this.vx.push(this.vertices[i].x);
		this.vy.push(this.vertices[i].y);
	}
	
}

Area.prototype.draw = function(ctx) {
		ctx.beginPath();
		ctx.lineWidth = this.lineWidth;
		
		if(this.lineDotted) 
			ctx.strokeStyle = ctx.createPattern(document.getElementById("textura_riscos"),'repeat');
		else
			ctx.strokeStyle = this.strokeColor;
		
		ctx.moveTo(this.x, this.y);
		
		for( var i=0; i<this.vertices.length; i++ ) {
			v = this.vertices[i];
			ctx.lineTo(v.x, v.y);
		}
		
		ctx.closePath();
		
		if( this.preencher ) {
			ctx.fillStyle = this.fillStyle;
			ctx.fill();
		}
		
		ctx.stroke();

	
	
	if( this.exibeNome ) {				
		ctx.fillStyle = this.fillNameStyle;
		ctx.font = this.font;
		//console.log(s.nomePos.x+","+s.nomePos.y)
		ctx.fillText(this.nome,this.nomePos.x,this.nomePos.y);
	}
}

Area.prototype.isInside = function(x,y) {
	var j=this.vx.length-1;
	var r=false;
	var vx=this.vx,
		vy=this.vy;
	
	for (i=0; i<vx.length; i++) {
		if (vy[i]<y && vy[j]>=y
		||  vy[j]<y && vy[i]>=y) {
			if (vx[i]+(y-vy[i])/(vy[j]-vy[i])*(vx[j]-vx[i])<x) {
				r=!r; 
			}
		}
		
		j=i; 
	}
	
	return r;
}

Area.prototype.addObj = function(obj) {
	obj.x += this.x;
	obj.y += this.y;
	obj.nomePos.x = obj.x + this.x;
	obj.nomePos.y = obj.y + this.y;
	this.objetos.push(obj);
}

/*!
 * Interface gráfica para automação residencial
 *
 * Rafael Prado
 * Data: 06/10/2015
 */

/**
 * ManipulaMenu
 * Gerencia 
 **/
function ManipulaMenu() {
	this.borderLine = document.getElementById("line");
	this.titulo = "Menu";
	
	this.ativo = false;
	
	this.x = 10;
	this.y = 150;
	this.largura = 320;
	
	this.shapesMenu = [];
	
}

ManipulaMenu.prototype.montarMenu = function(area) {
	
	var objetos = area.objetos,
		menuHeight = objetos.length*60 + 100;
	this.shapesMenu = [];
	
	//*
	var areaMenu = new Area("Area Menu",[
		 {x:this.x,y:this.y}
		,{x:this.x,y:this.y+menuHeight}
		,{x:this.x+this.largura,y:this.y+menuHeight}
		,{x:this.x+this.largura,y:this.y}
	]);
	areaMenu.strokeColor = "rgba(0,0,0,0)";
	areaMenu.lineWidth = 1;
	areaMenu.selecionavel = true;
	areaMenu.preencher = false;
	areaMenu.exibeMenu = false;
	areaMenu.exibeNome = false;
	areaMenu.exibeSelecao = false;
	
	this.shapesMenu.push(areaMenu);
	//*/
	
	this.titulo = area.nome;
	
	// Monta os itens de menu
	for(var i=0; i<area.objetos.length; i++) {
		var o = area.objetos[i];
		
		if( o instanceof Lampada ) {
			var interruptor = new InterruptorOnOff();
				interruptor.exibeNome = true;
				interruptor.x = 190;
				interruptor.y = 240+i*60;
				
				interruptor.nomePos.x = 20
				interruptor.nomePos.y = 260+i*60;
				interruptor.addObjeto(o);
			
			//o.interruptores.push(interruptor);
			o.interruptor = interruptor;
			
			this.shapesMenu.push(interruptor);
		} if( o instanceof Sensor ) {
			
			o.informacao.x = 190;
			o.informacao.y = (240+i*60)+22;
			
			o.informacao.nome = o.nome;
			o.informacao.nomePos.x = 20;
			o.informacao.nomePos.y = 260+i*60;
			o.informacao.exibeNome = true;
			o.informacao.valor = o.valor;
			
			this.shapesMenu.push(o.informacao);
		}
		
	}
	
	//console.log(this.shapesMenu)
	//this.areaMenu.fill = "white";
}   

ManipulaMenu.prototype.draw = function(ctx) {
	ctx.fillStyle = "white";
	ctx.font = "40px SketchBlock"
	
	var mEsq = (320-23*this.titulo.length)/2; //Margem esquerda
	ctx.fillText(this.titulo,mEsq,this.y+50);
	
	ctx.drawImage(this.borderLine,this.largura+5,this.y);
}


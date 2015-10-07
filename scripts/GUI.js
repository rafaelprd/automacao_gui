/*!
 * Interface gráfica para automação residencial
 *
 * Rafael Prado
 * Data: 06/10/2015
 */




/**
 * Parâmetros de configuração da interface
 **/
var GUI = {
	cabecalho: "Projeto 001",
	background_color: '#000000',
	stroke_color: '#FFFFFF',
	line_width: '3',
	fill_color: 'rgba(130,180,220,0.5)',
	selected_color: '#FF0000'
}

/**
 * ManipulaCanvas
 *
 * Controlar os elementos na tela
 **/
function ManipulaCanvas(canvas) {
	this.redraw = true;
	this.shapes = [];
	this.selecionado = null;
	this.ativo = false;
	
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	
	var mCanvas = this;
	
	
	this.menu = new ManipulaMenu();
	
	
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	// Seleciona elemento
	canvas.addEventListener('mousedown', function(e){
		var mouse = mCanvas.getMouse(e);
		//console.log(mouse.x+":"+mouse.y)
		var shapes = [];
		
		// Concatena os elementos do menu para que possam ser desenhados na tela
		if(mCanvas.menu.ativo)
			shapes = mCanvas.shapes.concat(mCanvas.menu.shapesMenu)
		else
			shapes = mCanvas.shapes;
		
		for(var i=shapes.length-1; i>=0; i--) {
			if( shapes[i].selecionavel &&
				shapes[i].isInside(mouse.x, mouse.y) ) {
					
				var elSel = shapes[i];
				
				mCanvas.selecionado = elSel;
				
				// Monta o menu com as informações da area selecionada
				if( elSel.exibeMenu ) {
					mCanvas.menu.ativo = true;
					mCanvas.menu.montarMenu(elSel);
				}
				
				if( elSel.onclick )
					elSel.onclick(elSel);
				
				mCanvas.redraw = true;
				return;
			}
		}
		
		if(mCanvas.selecionado)  {
			mCanvas.selecionado = null;
			mCanvas.menu.ativo = false;
			mCanvas.redraw = true;
		}
	});
	
	setInterval(function(){mCanvas.draw()},30);
}

ManipulaCanvas.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	
	if(shape.objetos)
		for( var i=0; i<shape.objetos.length; i++) {
			var o = shape.objetos[i];
			//console.log(o.x+":"+o.y)
			this.shapes.push(o);
		}
		
};

ManipulaCanvas.prototype.draw = function() {
	var ctx = this.ctx;
	var c = this.canvas;
	
	var shapes = [];
		
	if(this.redraw) {
		
		this.clear();
		
		// Cabeçalho do projeto
		ctx.fillStyle = "white";
		ctx.font = "60px SketchBlock"
		
		var mEsq = (c.width-23*GUI.cabecalho.length)/2; //Margem esquerda
		ctx.fillText(GUI.cabecalho,mEsq,60);
		///////////////////////////////////////////////
		
		
		
		// Concatena os elementos do menu para que possam ser desenhados na tela
		if(this.menu.ativo) {
			shapes = this.shapes.concat(this.menu.shapesMenu)
			this.menu.draw(ctx);
			
		} else
			shapes = this.shapes;
		
		for( var i=0; i<shapes.length; i++) {
			var s = shapes[i];
			
			s.draw(ctx);
			
		}
		
		//
		// Desenha contorno da area selecionada
		if( this.selecionado != null) 
			if( this.selecionado.exibeSelecao ) {
				var sel = this.selecionado
				
				if(sel instanceof Area) {
					var selecao = new Area("", sel.vertices, GUI.selected_color, parseInt(sel.lineWidth)+1 );
					selecao.preencher = false;
					selecao.draw(ctx);
				}
			}
		
		this.redraw = false;
	}
	
}

ManipulaCanvas.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	// Compute the total offset
	if (element.offsetParent !== undefined) {
	do {
		offsetX += element.offsetLeft;
		offsetY += element.offsetTop;
	} while ((element = element.offsetParent));
	}
	
	var cv = document.getElementById("content_canvas");
	
	cOffsetLeft = cv.scrollLeft || 0;
	cOffsetTop = cv.scrollTop || 0;
	
	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft - cOffsetLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop - cOffsetTop;
	
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	// We return a simple javascript object (a hash) with x and y defined
	return {x: mx, y: my};
}

ManipulaCanvas.prototype.clear = function() { 
	var ctx = this.ctx;
	var c = this.canvas;
	var img = document.getElementById("bg_blueprint");
	var pattern = ctx.createPattern(img,"repeat")
	ctx.fillStyle = pattern
	ctx.fillRect(0, 0, c.width, c.height);
}

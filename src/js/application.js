!function ($) {
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	DOM Event Listeners
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	$(document).ready(function() {
		
	});
	
	$(window).on("load", function() {
		
		init();
		
	});
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Initialize
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function init() {

		/* ----------------------------------------------------------------------------------------------------
		Define Namespace
		---------------------------------------------------------------------------------------------------- */
		
		$.app = {};
		
		$.app.canvas = $("#canvas");
		
		$.app.scrollbar_width = get_scrollbar_width();
		
		
		
		/* ----------------------------------------------------------------------------------------------------
		Define window resize event listener
		---------------------------------------------------------------------------------------------------- */
		
		$(window).resize(function () { 
			
			window_resize();
			
		});
		
		window_resize();
		
		
		
		/* ----------------------------------------------------------------------------------------------------
		Define window scroll event listener
		---------------------------------------------------------------------------------------------------- */
		
		$(window).scroll(function () { 
			
			window_scroll();
			
		});
		
		window_scroll();
		
		
		
		/* ----------------------------------------------------------------------------------------------------
		Simulate placeholder text
		---------------------------------------------------------------------------------------------------- */
		
		simulate_placeholders();

		window.simulate_placeholders = simulate_placeholders;



		/* ----------------------------------------------------------------------------------------------------
		Initialize Scrollbars
		---------------------------------------------------------------------------------------------------- */

		$('.container-scrollable').perfectScrollbar();



		/* ----------------------------------------------------------------------------------------------------
		Allow modal backdrop click to trigger close
		---------------------------------------------------------------------------------------------------- */
		
		$(document.body).on('click','> .modal-backdrop',function() {
			
			$('.modal').modal('hide');
			
		});
		
		
		
		/* ----------------------------------------------------------------------------------------------------
		Initialize Views
		---------------------------------------------------------------------------------------------------- */
		
		views_init();
		
	}
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Initialize: Views
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function views_init() {
		
	}
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Event Handler: Window Resize
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function window_resize() {
		
	    var responsive_viewport = $(window).width() + $.app.scrollbar_width;

	    if (responsive_viewport < 481) {

	    }

	    if (responsive_viewport > 481) {

	    }

	    if (responsive_viewport < 768) {

	    }

	    if (responsive_viewport >= 992) {

	    	canvas_sidebar_close();

	    }
	    
	    
	    
		/* ----------------------------------------------------------------------------------------------------
		Resize canvas to fit height of viewport
		---------------------------------------------------------------------------------------------------- */
	    
	    $('#canvas').height($(window).height());
	    
	    
	    
		/* ----------------------------------------------------------------------------------------------------
		Resize sidebar content height
		---------------------------------------------------------------------------------------------------- */
	    
	    var sidebar = $('#sidebar');
	    var sidebar_header = $('#sidebar-header');
	    var sidebar_content = $('#sidebar-content');
	    var sidebar_footer = $('#sidebar-footer');
	    
	    var sidebar_content_height = sidebar.outerHeight() - sidebar_header.outerHeight() - sidebar_footer.outerHeight();
	    
	    if (sidebar_content_height < 0) {
    	    
    	    sidebar_content_height = 0;
    	    
	    }
	    
	    sidebar_content.css({
    	   
    	   'height' :   sidebar_content_height
    	    
	    });
	    
	    
	    
		/* ----------------------------------------------------------------------------------------------------
		Resize page content height
		---------------------------------------------------------------------------------------------------- */
	    
	    var page = $('#sidebar');
	    var page_header = $('#page-header');
	    var page_content = $('#page-content');
	    
	    var page_content_height = page.outerHeight() - page_header.outerHeight();
	    
	    if (page_content_height < 0) {
    	    
    	    page_content_height = 0;
    	    
	    }
	    
	    page_content.css({
    	   
    	   'height' :   page_content_height
    	    
	    });
	    
	    
		/* ----------------------------------------------------------------------------------------------------
		Invoke Window Scroll method
		---------------------------------------------------------------------------------------------------- */
		
		window_scroll();



		/* ----------------------------------------------------------------------------------------------------
		Resize Modal
		---------------------------------------------------------------------------------------------------- */
	    
		modal_resize();
		
	}
	
	window.window_resize = window_resize;






	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------

	Event Handler: Modal Resize

	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function modal_resize() {
		
		$('.modal').each(function(index, value) { 
			
			if($(this).hasClass('fade') && !$(this).hasClass('in')) {
				
				$(this).css({
					
					display:    'block'
					
				});
				
			}
			
			var modal_header = $(this).find('.modal-header');
			var modal_footer = $(this).find('.modal-footer');
			var modal_content = $(this).find('.modal-content');
			var modal_content_inner = $(this).find('.modal-content-inner');
			
			var window_height = $(window).height();
			var modal_header_height = modal_header.outerHeight();
			var modal_footer_height = modal_footer.outerHeight();
			var modal_content_height = modal_content.height();
			var modal_content_padding = modal_content.outerHeight() - modal_content_height;
			var modal_content_inner_height = modal_content_inner.outerHeight();
			var modal_total_height = modal_header_height + modal_content_padding + modal_content_inner_height + modal_footer_height;
			var modal_margins = 15;
			
			if ((modal_total_height + (2 * modal_margins)) > window_height) {
				
				modal_content.css({
					
					'height'	:	window_height - modal_header_height - modal_content_padding - modal_footer_height - (2 * modal_margins)
					
				});
				
			} else {
				
				modal_content.css({
					
					'height'	:	modal_content_inner_height
					
				});
				
			}
			
			$(this).css({
				
				'margin-top'	:	-1 * ($(this).outerHeight() / 2)
				
			});
			
			// Remove display:block for resizing calculations to avoid element covering screen
			
			if($(this).hasClass('fade') && !$(this).hasClass('in')) {
				
				$(this).css({
					
					display:    'none'
					
				});
				
			}
			
		});
		
	}

	window.modal_resize = modal_resize;
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Event Handler: Window Scroll
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function window_scroll() {
		
		var scroll_top = $(window).scrollTop() - $('#canvas').offset().top;
		
	}






	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------

	Canvas Sidebar Toggle

	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */

	function canvas_sidebar_toggle() {

		if($('body').hasClass("canvas-sidebar-open")) {

			canvas_sidebar_close();

		} else {

			canvas_sidebar_open();

		}

	}

	function canvas_sidebar_open() {

		$('body').addClass("canvas-sidebar-open");

	}

	function canvas_sidebar_close() {

		$('body').removeClass("canvas-sidebar-open");

	}
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Simulate input placeholder
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function simulate_placeholders() {
		
		var input = document.createElement("input");
		
		if(('placeholder' in input) == false) {
			
			$('[placeholder]').focus(function() {
				
				var i = $(this);
				
				if(i.val() == i.attr('placeholder')) {
					
					i.val('').removeClass('placeholder');
					
					if(i.hasClass('password')) {
						
						i.removeClass('password');
						this.type='password';
						
					}
							
				}
				
			}).blur(function() {
				
				var i = $(this);	
				
				if(i.val() == '' || i.val() == i.attr('placeholder')) {
					
					if(this.type=='password') {
						
						i.addClass('password');
						this.type='text';
						
					}
					
					i.addClass('placeholder').val(i.attr('placeholder'));
					
				}
				
			}).blur().parents('form').submit(function() {
				
				$(this).find('[placeholder]').each(function() {
					
					var i = $(this);
					
					if(i.val() == i.attr('placeholder')) {
						
						i.val('');
						
					}
					
				})
				
			});
			
		}
				
	}
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Get Browser Dimensions
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function get_browser_dimensions() {
		
		var dimensions = {
			
			width: 0,
			height: 0
			
		};
		
		if ($(window)) {
			
			dimensions.width = $(window).width();
			dimensions.height = $(window).height();
			
		}
		
		return dimensions;
		
	}
	
	
	
	
	
	
	/* ----------------------------------------------------------------------------------------------------
	-------------------------------------------------------------------------------------------------------
	
	Get Scrollbar Width
	
	-------------------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------------- */
	
	function get_scrollbar_width() {
		
	    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>'); 
	    $('body').append(div); 
	    var w1 = $('div', div).innerWidth(); 
	    div.css('overflow-y', 'auto'); 
	    var w2 = $('div', div).innerWidth(); 
	    $(div).remove(); 
	    return (w1 - w2);
	    
	}
	
} (window.jQuery)
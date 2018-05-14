//
//* Used to size vertically stretched (.al_vertical_stretch) columns.
//* Should fill screen based on height and create scroll bars when necessary.
//
	function al_vertical_sizing() {
		$('body,html').css('overflow-y','hidden');
		var w = $(window).height();
		$('.al_vertical_stretch:visible').each(function() {
			var p = parseInt($(this).css('padding-top').split('px')[0]) + parseInt($(this).css('padding-bottom').split('px')[0]);
			var m = parseInt($(this).css('margin-top').split('px')[0]) + parseInt($(this).css('margin-bottom').split('px')[0]);
			var b = parseInt($(this).css('border-top-width').split('px')[0]) + parseInt($(this).css('border-bottom-width').split('px')[0]);
			var o = $(this).offset().top;
			var h = w-(o+p+m+b);
			$(this).css({
				'height': h,
				'overflow': 'auto',
			});
		});
		$('body,html').css('overflow-y','auto');
	}
	al_vertical_sizing();
// End vertical stretch JS


//
//* AJAX Popup Controller...
//
	//* Popup Object...
	//
		var al_popup = {
			exists: false,
			html: function() {
				var r = '<div id="al_popup_mask" class="al_popup_close" style="display:none;"></div>';
					r+= '<div id="al_popup" style="display:none;">';
					r+= '	<div id="al_popup_content">';
					r+= '	</div>';
					r+= '</div>';
				//
				return r;
			},
			create: function() {
				if (!this.exists) {
					$('#al_body').append(this.html)
					$('#al_popup_mask').css({
						'height': '100%',
						'width': '100%',
						'background': '#000',
						'opacity': '.5',
						'position':'absolute',
						'top':'0px',
						'left': '0px',
						'z-index': '500'
					});
					$('#al_popup').css({
						'background':'#fff',
						'padding': '10px',
						'position':'absolute',
						'top':'20px',
						'z-index': '550'
					});
					this.exists = true;
				}
			},
			position: function() {
				$('#al_popup').css({
					'margin-left': function() {
						var w = $('#al_popup').width();
						var b = $('#al_body').width();
						return (b/2)-(w/2);
					}
				});
			},
			bind: function() {
				$(window).bind('resize.al_popup_resize',function() {
					al_popup.position();
				});
				$('.al_popup_close').bind('click.al_popup_close',function() {
					al_popup.close();
				});
			},
			unbind: function() {
				$(window).unbind('resize.al_popup_resize');
				$('.al_popup_close').unbind('click.al_popup_close');
			},
			show: function() {
				this.position();
				this.bind();
				$('#al_popup_mask').fadeIn(250,function() {
					$('#al_popup').show();
				});
			},
			close: function() {
				this.unbind();
				$('#al_popup').hide();
				$('#al_popup_mask').fadeOut(250);
			}
		}
	//
	//* Popup controller...
	//
		function al_load_popup(url) {
			$('#al_folders').unbind('tree.click');
			if (!al_popup.exists) {
				al_popup.create();
			}
			$.get(url,function(res) {
				$('#al_popup_content').html(res);
				al_popup.show();
				al_bind_tree();
			});
		}
	//
// End Popup JS
function al_bind_tree() {
	$('#al_folders').bind('tree.click', function(e) {
		var node = e.node;
		$(this).tree('toggle', node);
	});
}

$(document).ready(function() {


	//* Drag and drop functionality for folders panel
	//
		// Temporary filler data...
		//
			var tmp_data = [
				{	label: 'Interpretation' },
				{	label: 'Strategy',
					children: [
						{	label: 'Mathematically Sound' },
						{	label: 'Got Lucky' }
					]},
				{	label: 'Accuracy' },
				{	label: 'Completeness' },
				{	label: 'Clarity' },
				{	label: 'Reflection' }
			];
		//
		// Initialize plugin...
		//
			$('#al_folders').tree({
				data: tmp_data, 
				autoOpen: false,
				dragAndDrop: true,
				openedIcon: '',
				closedIcon: '',
				onCreateLi: function(node, $li) {

					var indent = node.getLevel() * 15;
					var children = node.children.length;
					var indicator = (children > 0) ? '' : ' al_empty';

					$li.find('.jqtree-element')
						.attr('title',node.name)
						.prepend(
							'<span class="al_sprite al_folder" style="margin-left:'+ indent +'px;"></span>')
						.append(
							'<aside>'+
								'<div class="al_indicator">'+
									'<span class="al_sprite '+ ((children > 0) ? 'al_folder_ct' : ' al_empty') +'"></span>'+
									'<span class="al_number">'+ ((children > 0) ? children : '') +'</span>'+
								'</div>'+
								'<div class="al_indicator">'+
									'<span class="al_sprite al_selection_ct"></span>'+
									'<span class="al_number al_selection">999</span>'+
								'</div>'+
							'</aside>')
						.end()
						.find('.al_sprite.al_folder')
						.css('margin-left',indent);
					//
					if (children > 0) $li.addClass('al_hasChild');
				}
			});
		//
		// Click action...
		//
			$('#al_folders').bind('tree.click', function(e) {
				var node = e.node;
				$(this).tree('toggle', node);
			});
		//
	//*

	//* Initiate vertical sizing for scrolling columns...
	//
		//al_vertical_sizing();
		$(window).bind('resize.al_body_resize', function() {
			al_vertical_sizing();
		});
	//
	//* Initiate custom scroll bars on scrolling columns...
	//
		$('.al_vertical_stretch')
			.mCustomScrollbar({
				advanced: {
					updateOnBrowserResize:true,
					updateOnContentResize: true
				}
			});
		//
	//
	
	//* Temporary click actions for various page interactions...
	//
		//* Ajax controller...
		//
			$('a.al_ajax').bind('click.al_ajax',function() {
				var url = $(this).attr('href');
				al_load_popup(url)
				return false;
			});
		//
		//* Selection controller...
		//
			$('.al_show_selections').click(function() {
				if ($('#al_center').hasClass('al_showall')) {
					$('#al_center').removeClass('al_showall');
					$('#al_center .al_selected').removeClass('al_selected');
					$('#al_right').removeClass('al_enabled');
					$('#al_submission p>span:visible').unbind('click.selected');
				} else {
					$('#al_center').addClass('al_showall');
					$('#al_submission p>span:visible').bind('click.selected',function() {
						$('#al_submission .al_selected').removeClass('al_selected');
						$(this).toggleClass('al_selected');
						if ($(this).hasClass('al_selected')) {
							$('#al_right').addClass('al_enabled');
							$('.al_enabled td').click(function() {
								$('.al_enabled td.al_active').removeClass('al_active');
								$(this).addClass('al_active');
								$('#al_right textarea')
									.attr('placeholder', $(this).text()+'...')
									.attr('value', '');
								//
							});
							$('.al_enabled td:first').click();
						} else {
							$('#al_right').removeClass('al_enabled');
						}al_vertical_sizing();
					});
				}
			});
			$('.al_make_selection').click(function() {
				if ($('#al_center').hasClass('al_makeselect')) {
					$('#al_center').removeClass('al_makeselect al_showall');
					$('#al_popup_mask')
						.fadeOut(250);
					//
				} else {
					al_popup.create();
					al_popup.bind();
					$('#al_center')
						.removeClass('al_showall')
						.addClass('al_showall al_makeselect');
					//
					$('#al_center p>span:visible')
						.bind('click.al_addselection',function() {
							$('#al_center').removeClass('al_makeselect al_showall');
							al_load_popup('templates/al-add-selection.php');
						});
					//
					$('#al_popup_mask')
						.fadeIn(250)
						.bind('click.al_makeselect', function() {
							$('#al_center').removeClass('al_makeselect al_showall');
							$(this).unbind('click.al_makeselect')
						});
					//
				}
			});
		//
		//* Folder jawns...
		//
			$('.al_remove_folder').click(function() {
				$(this).toggleClass('al_cancel');
				if ($('#al_folders').hasClass('al_remove')) {
					$('#al_folders').unbind('tree.click');
					$('.al_remove .al_sprite.al_folder').unbind('click.al_remove_folder');
					al_bind_tree();
					$('#al_folders').removeClass('al_remove');
				} else {
					$('#al_folders').addClass('al_remove');
					$('.al_remove .al_sprite.al_folder').bind('click.al_remove_folder', function() {
						var folder = $(this).parent('.jqtree_common').attr('title');
						var url = 'templates/al-remove-folder.php?id='+ folder;
						al_load_popup(url);
					});
				}
			});
		//
	//
});


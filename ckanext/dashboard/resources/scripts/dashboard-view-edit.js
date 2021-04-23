this.ckan.module('dashboard-view-edit', function ($, _) {
  return {
    options: {
      size: 130,
      widgetSizeX: 4,
      widgetSizeY: 3,
      i18n: {
        edit: _('Edit'),
        remove: _('Remove')
      }
    },
	
    initialize: function () {

	  // TODO: proxy all jquery
      $.proxyAll(this, /_/);
	  this.el.ready(this._onReady);

    },
	
	// TODO: create dashboard-grid onReady
	_onReady: function(){
		
		var dashboard_grid = $('.dashboard-grid');
		if (dashboard_grid.length === 0) {
			$('.dropdown-toggle', this.el).addClass('disabled');
			$('#dashboard-view-add-url-button', this.el).addClass('disabled');
			$('#dashboard-view-add-url-input', this.el).prop('disabled', true);
		} 
		else {
			$('#dashboard-view-edit-new a', this.el).on('click', this._add);
			$('#dashboard-view-add-url-button', this.el).on('click', this._add_from_url);
			dashboard_grid.find('.btn-danger').on('click', this._remove);

			this.gridster = dashboard_grid
			  .gridster({
				widget_margins: [10, 10],
				widget_base_dimensions: [this.options.size, this.options.size],
				min_cols: 6,
				max_cols: 6,
				draggable: {
				  stop: this._serialize
				},
				resize: {
				  enabled: true,
				  stop: this._serialize
				},
				serialize_params: function($w, wgd) {
				  return { col: wgd.col, row: wgd.row, sizex: wgd.size_x, sizey: wgd.size_y, id: $w.attr('id') };
				}
			  })
			  .data('gridster');

			dashboard_grid.find(".module .module-heading").dotdotdot({
			  // configuration
			  after: "a.readmore"
			});

			this._serialize();
		}
	},

    _add: function (e) {
      e.preventDefault();
      var view_id = $(e.target).data('view_id'),
          widgetSizeX = this.options.widgetSizeX,
          widgetSizeY = this.options.widgetSizeY;
	  // TODO: poor preview to get feedback, if widgets get added 
      template = '<li id="' + view_id + '"><p style="display:block; background-color:#f6f6f6; text-align:center; vertical-align:middle; width:100%; height:100%">' + e.target.innerText + '</p></li>';
	  	  
	  this.gridster.add_widget(template, widgetSizeX, widgetSizeY);
      this._serialize();
	  // TODO: preview not really usefull since it reloads the whole form with saved data
      //$(this.el.parent()).find('[name="preview"]').click();
    },

    _remove: function (e) {
      e.preventDefault();
      var widget = $(e.target).parents('.box');
      this.gridster.remove_widget(widget);
      this._serialize();
    },

    _add_from_url: function (e) {
      e.preventDefault();
      var view_url = $(e.target).siblings().val().trim();
      var view_id = view_url.substr(view_url.length-36, 36);
	  
	  // TODO: same problem as above, not "fixed" 
      template = '<li id="' + view_id + '"></li>';
      this.gridster.add_widget(template, 2, 2);
      this._serialize();
	  // TODO: preview not really usefull since it reloads the whole form with saved data
      //$(this.el.parent()).find('[name="preview"]').click();

    },

    _serialize: function () {
      var items = this.gridster.serialize();
      var data = JSON.stringify(items);
      $('input[name="json"]', this.el).val(data);
    }

  };
});
